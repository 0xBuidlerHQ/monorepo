import { DatabaseSync } from "node:sqlite";
import { randomUUID, randomBytes, scryptSync, timingSafeEqual } from "node:crypto";
import { mkdirSync } from "node:fs";
import { dirname } from "node:path";
import { digest } from "@0xhq/api-client/protocol";
import { certifiers, type Certifier, staffTransitions, submissionStatuses, type Submission, type SubmissionInput, type SubmissionStatus, type PhotoSide } from "@0xhq/api-client/types";
import { HttpError } from "./errors.ts";

export type Actor = { kind: "customer" | "staff"; id: string };
type Row = { id: string; reference: string; owner: string; grading_company: Certifier; request_id: string; data: string; payload_hash: string; status: SubmissionStatus; version: number; created_at: string; updated_at: string };
type Photo = { side: PhotoSide; content_type: string; size: number; sha256: string; filename: string };

export function validateSubmission(value: unknown): SubmissionInput {
	if (!value || typeof value !== "object" || Array.isArray(value)) throw new HttpError(400, "Enter the item details.");
	const data = value as Record<string, unknown>;
	const text = (key: string, max: number) => {
		if (typeof data[key] !== "string" || data[key].length > max) throw new HttpError(400, `Invalid ${key}.`);
		return data[key].trim();
	};
	const result = { requestId: text("requestId", 36), gradingCompany: text("gradingCompany", 12) as Certifier, certificationNumber: text("certificationNumber", 40).toUpperCase(), contactEmail: text("contactEmail", 254), recipientAddress: text("recipientAddress", 42), notes: data.notes === undefined ? "" : text("notes", 3000) };
	if (!/^[0-9a-f-]{36}$/i.test(result.requestId)) throw new HttpError(400, "Invalid request ID.");
	if (!certifiers.some((company) => company.id === result.gradingCompany)) throw new HttpError(400, "Select a supported certifier.");
	if (result.gradingCompany === "PSA" && !/^\d{6,16}$/.test(result.certificationNumber)) throw new HttpError(400, "Enter the numeric PSA certification number.");
	if (!/^[A-Z0-9-]{3,40}$/.test(result.certificationNumber)) throw new HttpError(400, "Enter a valid certification ID.");
	if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(result.contactEmail)) throw new HttpError(400, "Enter a valid contact email.");
	if (!/^0x[0-9a-fA-F]{40}$/.test(result.recipientAddress) || /^0x0{40}$/i.test(result.recipientAddress)) throw new HttpError(400, "A valid account wallet is required.");
	return result;
}

export function openStore(path: string, password: string) {
	mkdirSync(dirname(path), { recursive: true });
	const db = new DatabaseSync(path);
	const schema = db.prepare("PRAGMA user_version").get() as { user_version: number };
	if (schema.user_version > 1) { db.close(); throw new Error("This database requires a newer API service."); }
	db.exec(`PRAGMA journal_mode=WAL; PRAGMA foreign_keys=ON; PRAGMA busy_timeout=5000;
		CREATE TABLE IF NOT EXISTS submissions (
		 id TEXT PRIMARY KEY, reference TEXT NOT NULL UNIQUE, owner TEXT NOT NULL, request_id TEXT NOT NULL,
		 data TEXT NOT NULL, payload_hash TEXT NOT NULL, grading_company TEXT NOT NULL DEFAULT 'PSA', cert TEXT NOT NULL,
		 status TEXT NOT NULL CHECK(status IN ('draft','requested','accepted','in_transit','received','under_inspection','approved','rejected','cancelled')),
		 version INTEGER NOT NULL DEFAULT 1, created_at TEXT NOT NULL, updated_at TEXT NOT NULL, UNIQUE(owner,request_id));
		CREATE UNIQUE INDEX IF NOT EXISTS active_cert ON submissions(grading_company,cert) WHERE status NOT IN ('draft','rejected','cancelled');
		CREATE INDEX IF NOT EXISTS submissions_owner ON submissions(owner,created_at);
		CREATE TABLE IF NOT EXISTS photos (submission_id TEXT NOT NULL REFERENCES submissions(id), side TEXT NOT NULL CHECK(side IN ('front','back')), filename TEXT NOT NULL, content_type TEXT NOT NULL, size INTEGER NOT NULL, sha256 TEXT NOT NULL, PRIMARY KEY(submission_id,side));
		CREATE TABLE IF NOT EXISTS history (id INTEGER PRIMARY KEY, submission_id TEXT NOT NULL REFERENCES submissions(id), status TEXT NOT NULL, note TEXT NOT NULL, actor TEXT NOT NULL, created_at TEXT NOT NULL);
		CREATE TABLE IF NOT EXISTS staff (id TEXT PRIMARY KEY, salt TEXT NOT NULL, password_hash TEXT NOT NULL);
		CREATE TABLE IF NOT EXISTS staff_sessions (token_hash TEXT PRIMARY KEY, staff_id TEXT NOT NULL REFERENCES staff(id), expires INTEGER NOT NULL);
		CREATE TABLE IF NOT EXISTS request_nonces (client TEXT NOT NULL, nonce TEXT NOT NULL, expires INTEGER NOT NULL, PRIMARY KEY(client,nonce));
		CREATE TABLE IF NOT EXISTS login_attempts (at INTEGER NOT NULL);
		PRAGMA user_version=1;`);
	const existing = db.prepare("SELECT salt,password_hash FROM staff WHERE id='admin'").get() as { salt: string; password_hash: string } | undefined;
	if (!existing || !timingSafeEqual(Buffer.from(existing.password_hash, "hex"), scryptSync(password, existing.salt, 32))) {
		const salt = randomBytes(16).toString("hex");
		db.prepare("INSERT INTO staff VALUES ('admin',?,?) ON CONFLICT(id) DO UPDATE SET salt=excluded.salt,password_hash=excluded.password_hash").run(salt, scryptSync(password, salt, 32).toString("hex"));
		db.exec("DELETE FROM staff_sessions");
	}
	function transaction<T>(operation: () => T): T {
		db.exec("BEGIN IMMEDIATE");
		try { const result = operation(); db.exec("COMMIT"); return result; }
		catch (error) { db.exec("ROLLBACK"); throw error; }
	}
	function rowFor(id: string, actor: Actor) {
		const row = db.prepare("SELECT * FROM submissions WHERE id=?").get(id) as Row | undefined;
		if (!row || (actor.kind === "customer" && row.owner !== actor.id)) throw new HttpError(404, "Submission not found.");
		if (actor.kind === "staff" && !db.prepare("SELECT id FROM history WHERE submission_id=? AND status='requested' LIMIT 1").get(id)) throw new HttpError(404, "Submission not found.");
		return row;
	}
	function record(row: Row): Submission {
		const data = JSON.parse(row.data) as SubmissionInput & { title?: string; grade?: string };
		const photos = db.prepare("SELECT side,content_type,size,sha256 FROM photos WHERE submission_id=? ORDER BY side").all(row.id) as unknown as Photo[];
		const history = db.prepare("SELECT id,status,note,created_at FROM history WHERE submission_id=? ORDER BY id").all(row.id) as unknown as { id: number; status: SubmissionStatus; note: string; created_at: string }[];
		return { ...data, id: row.id, reference: row.reference, title: data.title ?? "", grade: data.grade ?? "", gradingCompany: row.grading_company, status: row.status, version: row.version, createdAt: row.created_at, updatedAt: row.updated_at, photos: photos.map((photo) => ({ side: photo.side, contentType: photo.content_type, size: photo.size, sha256: photo.sha256 })), history: history.map((event) => ({ id: event.id, status: event.status, note: event.note, createdAt: event.created_at })) };
	}
	function addHistory(id: string, status: SubmissionStatus, note: string, actor: Actor, time: string) { db.prepare("INSERT INTO history(submission_id,status,note,actor,created_at) VALUES (?,?,?,?,?)").run(id, status, note, `${actor.kind}:${actor.id}`, time); }
	return {
		close: () => db.close(),
		get: (id: string, actor: Actor) => record(rowFor(id, actor)),
		list(actor: Actor) {
			const rows = (actor.kind === "customer" ? db.prepare("SELECT * FROM submissions WHERE owner=? ORDER BY created_at DESC,id DESC LIMIT 100").all(actor.id) : db.prepare("SELECT * FROM submissions WHERE EXISTS (SELECT 1 FROM history WHERE history.submission_id=submissions.id AND history.status='requested') ORDER BY created_at DESC,id DESC LIMIT 100").all()) as unknown as Row[];
			return rows.map(record);
		},
		create(value: unknown, actor: Actor) {
			if (actor.kind !== "customer") throw new HttpError(403, "Customers create submissions.");
			const input = validateSubmission(value), hash = digest(JSON.stringify(input));
			return transaction(() => {
				const existing = db.prepare("SELECT * FROM submissions WHERE owner=? AND request_id=?").get(actor.id, input.requestId) as Row | undefined;
				if (existing) {
					if (existing.payload_hash !== hash) throw new HttpError(409, "This request ID was already used for different details. Refresh to start a new request.");
					return record(existing);
				}
				const id = randomUUID(), time = new Date().toISOString(), reference = `TO-${id.replaceAll("-", "").slice(0, 12).toUpperCase()}`;
				db.prepare("INSERT INTO submissions(id,reference,owner,request_id,data,payload_hash,grading_company,cert,status,created_at,updated_at) VALUES (?,?,?,?,?,?,?,?,'draft',?,?)").run(id, reference, actor.id, input.requestId, JSON.stringify(input), hash, input.gradingCompany, input.certificationNumber, time, time);
				addHistory(id, "draft", "", actor, time);
				return record(rowFor(id, actor));
			});
		},
		photo(id: string, side: PhotoSide, actor: Actor) {
			rowFor(id, actor);
			const photo = db.prepare("SELECT * FROM photos WHERE submission_id=? AND side=?").get(id, side) as Photo | undefined;
			if (!photo) throw new HttpError(404, "Photo not found.");
			return photo;
		},
		savePhoto(id: string, side: PhotoSide, photo: Omit<Photo, "side">, actor: Actor) {
			return transaction(() => {
				const row = rowFor(id, actor);
				if (actor.kind !== "customer" || row.status !== "draft") throw new HttpError(409, "Photos can only be added to your draft.");
				db.prepare("INSERT INTO photos VALUES (?,?,?,?,?,?) ON CONFLICT(submission_id,side) DO UPDATE SET filename=excluded.filename,content_type=excluded.content_type,size=excluded.size,sha256=excluded.sha256").run(id, side, photo.filename, photo.content_type, photo.size, photo.sha256);
				return record(rowFor(id, actor));
			});
		},
		submit(id: string, actor: Actor) {
			if (actor.kind !== "customer") throw new HttpError(403, "Customers submit their own requests.");
			return transaction(() => {
				const row = rowFor(id, actor);
				if (row.status === "requested") return record(row);
				if (row.status !== "draft") throw new HttpError(409, "This submission has already been processed.");
				const time = new Date().toISOString();
				try { db.prepare("UPDATE submissions SET status='requested',version=version+1,updated_at=? WHERE id=?").run(time, id); }
				catch (error) { if (error instanceof Error && error.message.includes("UNIQUE")) throw new HttpError(409, "This certification already has an active submission or passport."); throw error; }
				addHistory(id, "requested", "Request received. Wait for acceptance before shipping your item.", actor, time);
				return record(rowFor(id, actor));
			});
		},
		transition(id: string, value: unknown, actor: Actor) {
			if (!value || typeof value !== "object") throw new HttpError(400, "Invalid status update.");
			const { status, version, note } = value as Record<string, unknown>;
			if (typeof status !== "string" || !submissionStatuses.includes(status as SubmissionStatus) || !Number.isInteger(version) || typeof note !== "string" || note.length > 3000) throw new HttpError(400, "Invalid status update.");
			return transaction(() => {
				const row = rowFor(id, actor), next = status as SubmissionStatus;
				if (row.version !== version) throw new HttpError(409, "The submission changed. Refresh before updating it.");
				const allowed = actor.kind === "staff" ? staffTransitions[row.status] ?? [] : ["draft", "requested", "accepted"].includes(row.status) ? ["cancelled"] : [];
				if (!allowed.includes(next)) throw new HttpError(403, "This status change is not permitted.");
				if (next === "rejected" && !note.trim()) throw new HttpError(400, "Provide a reason for rejection.");
				const time = new Date().toISOString();
				db.prepare("UPDATE submissions SET status=?,version=version+1,updated_at=? WHERE id=?").run(next, time, id);
				addHistory(id, next, note.trim(), actor, time);
				return record(rowFor(id, actor));
			});
		},
		useNonce(client: string, nonce: string, expires: number) {
			db.prepare("DELETE FROM request_nonces WHERE expires<?").run(Date.now());
			try { db.prepare("INSERT INTO request_nonces VALUES (?,?,?)").run(client, nonce, expires); }
			catch { throw new HttpError(401, "Request already used."); }
		},
		login(value: unknown) {
			const now = Date.now(); db.prepare("DELETE FROM login_attempts WHERE at<?").run(now - 15 * 60_000);
			const attempts = db.prepare("SELECT COUNT(*) AS total FROM login_attempts").get() as { total: number };
			if (attempts.total >= 10) throw new HttpError(429, "Too many attempts. Try again in 15 minutes.");
			db.prepare("INSERT INTO login_attempts VALUES (?)").run(now);
			const row = db.prepare("SELECT * FROM staff WHERE id='admin'").get() as { salt: string; password_hash: string };
			if (typeof value !== "string" || value.length > 256 || !timingSafeEqual(Buffer.from(row.password_hash, "hex"), scryptSync(value, row.salt, 32))) throw new HttpError(401, "Invalid staff credentials.");
			db.exec("DELETE FROM login_attempts");
			db.prepare("DELETE FROM staff_sessions WHERE expires<?").run(now);
			const token = randomBytes(32).toString("base64url"), expires = now + 8 * 60 * 60_000;
			db.prepare("INSERT INTO staff_sessions VALUES (?,'admin',?)").run(digest(token), expires);
			return { token, expires };
		},
		staff(token: string): Actor {
			const row = db.prepare("SELECT staff_id FROM staff_sessions WHERE token_hash=? AND expires>?").get(digest(token), Date.now()) as { staff_id: string } | undefined;
			if (!row) throw new HttpError(401, "Staff sign-in required.");
			return { kind: "staff", id: row.staff_id };
		},
		logout(token: string) { db.prepare("DELETE FROM staff_sessions WHERE token_hash=?").run(digest(token)); },
	};
}
