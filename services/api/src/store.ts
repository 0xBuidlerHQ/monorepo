import { DatabaseSync } from "node:sqlite";
import { randomUUID, randomBytes, scryptSync, timingSafeEqual } from "node:crypto";
import { mkdirSync } from "node:fs";
import { dirname } from "node:path";
import { digest } from "@0xhq/api-client/protocol";
import { certifiers, type Certifier, staffTransitions, submissionStatuses, type Submission, type SubmissionInput, type SubmissionStatus, type PhotoSide, type PassportIssuance } from "@0xhq/api-client/types";
import { parseHandover, type PhysicalHandover } from "@0xhq/api-client/handovers";
import { HttpError } from "./errors.ts";

export type Actor = { kind: "customer" | "staff"; id: string };
type Row = { id: string; reference: string; owner: string; grading_company: Certifier; cert: string; request_id: string; data: string; payload_hash: string; status: SubmissionStatus; version: number; created_at: string; updated_at: string };
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
	// Version 5 was an experimental exchange schema; keep existing databases readable without creating or using its tables.
	if (schema.user_version > 5) { db.close(); throw new Error("This database requires a newer API service."); }
	db.exec(`PRAGMA journal_mode=WAL; PRAGMA synchronous=FULL; PRAGMA foreign_keys=ON; PRAGMA busy_timeout=5000;
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
		CREATE TABLE IF NOT EXISTS passports (submission_id TEXT PRIMARY KEY REFERENCES submissions(id), item_id TEXT NOT NULL UNIQUE, data TEXT NOT NULL, raw_tx TEXT);
		CREATE TABLE IF NOT EXISTS submission_handovers (submission_id TEXT PRIMARY KEY REFERENCES submissions(id), method TEXT NOT NULL, details TEXT NOT NULL,
         status TEXT NOT NULL CHECK(status IN ('awaiting_receipt','received')), recorded_at TEXT NOT NULL, received_at TEXT, recorded_by TEXT NOT NULL, received_by TEXT);`);
    // Upgrade legacy delivery records atomically. The old table is kept as a migration backup.
    if (schema.user_version < 4) {
        db.exec("BEGIN IMMEDIATE");
        try {
            if (db.prepare("SELECT name FROM sqlite_master WHERE type='table' AND name='submission_returns'").get()) {
                db.exec(`INSERT OR IGNORE INTO submission_handovers SELECT submission_id, 'delivery', json_object('carrier',carrier,'trackingNumber',tracking_number),
                  CASE status WHEN 'received' THEN 'received' ELSE 'awaiting_receipt' END, dispatched_at, received_at, dispatched_by, received_by FROM submission_returns`);
            }
            db.exec("PRAGMA user_version=4; COMMIT");
        } catch (error) { db.exec("ROLLBACK"); db.close(); throw error; }
    }

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
		return { ...data, passport: passportFor(row.id), returnHandover: returnFor(row.id), id: row.id, reference: row.reference, title: data.title ?? "", grade: data.grade ?? "", gradingCompany: row.grading_company, status: row.status, version: row.version, createdAt: row.created_at, updatedAt: row.updated_at, photos: photos.map((photo) => ({ side: photo.side, contentType: photo.content_type, size: photo.size, sha256: photo.sha256 })), history: history.map((event) => ({ id: event.id, status: event.status, note: event.note, createdAt: event.created_at })) };
	}
	function returnFor(id: string): PhysicalHandover | null {
        const row = db.prepare("SELECT method,details,status,recorded_at,received_at FROM submission_handovers WHERE submission_id=?").get(id) as { method: string; details: string; status: PhysicalHandover["status"]; recorded_at: string; received_at: string | null } | undefined;
        return row ? { ...parseHandover({ method: row.method, details: JSON.parse(row.details) }), status: row.status, recordedAt: row.recorded_at, receivedAt: row.received_at } : null;
    }

	function passportFor(id: string): PassportIssuance | null {
		const saved = db.prepare("SELECT data FROM passports WHERE submission_id=?").get(id) as { data: string } | undefined;
		return saved ? JSON.parse(saved.data) : null;
	}

	function addHistory(id: string, status: SubmissionStatus, note: string, actor: Actor, time: string) {
		db.prepare("INSERT INTO history(submission_id,status,note,actor,created_at) VALUES (?,?,?,?,?)").run(id, status, note, `${actor.kind}:${actor.id}`, time);
	}
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
		recordReturn(id: string, value: unknown, actor: Actor) {
            if (actor.kind !== "staff") throw new HttpError(403, "Only staff can record a return handover.");
            let handover: ReturnType<typeof parseHandover>;
            try { handover = parseHandover(value); } catch (error) { throw new HttpError(400, error instanceof Error ? error.message : "Invalid handover."); }
            const version = (value as { version?: unknown }).version;
            if (!Number.isInteger(version)) throw new HttpError(400, "Enter a valid submission version.");
            return transaction(() => {
                const row = rowFor(id, actor), existing = returnFor(id);
                if (existing) {
                    if (existing.method === handover.method && JSON.stringify(existing.details) === JSON.stringify(handover.details)) return record(row);
                    throw new HttpError(409, "A return handover is already recorded. Its details cannot be overwritten.");
                }
                if (!["approved", "rejected"].includes(row.status) || !db.prepare("SELECT id FROM history WHERE submission_id=? AND status='received'").get(id)) throw new HttpError(409, "Record receipt and complete inspection before returning the item.");
                if (row.version !== version) throw new HttpError(409, "The submission changed. Refresh before recording the return.");
                const time = new Date().toISOString();
                db.prepare("INSERT INTO submission_handovers VALUES (?,?,?,'awaiting_receipt',?,NULL,?,NULL)").run(id, handover.method, JSON.stringify(handover.details), time, actor.id);
                db.prepare("UPDATE submissions SET version=version+1,updated_at=? WHERE id=?").run(time, id);
                return record(rowFor(id, actor));
            });
        },
		confirmReturn(id: string, value: unknown, actor: Actor) {
			if (actor.kind !== "customer") throw new HttpError(403, "Only the owner can confirm receiving the physical item.");
			const input = value as { version?: unknown } | null;
			return transaction(() => {
				const row = rowFor(id, actor), shipment = returnFor(id);
				if (!shipment) throw new HttpError(409, "A return handover has not been recorded.");
				if (shipment.status === "received") return record(row);
				if (!input || row.version !== input.version) throw new HttpError(409, "The submission changed. Refresh before confirming receipt.");
				const time = new Date().toISOString();
				db.prepare("UPDATE submission_handovers SET status='received',received_at=?,received_by=? WHERE submission_id=?").run(time, actor.id, id);
				db.prepare("UPDATE submissions SET version=version+1,updated_at=? WHERE id=?").run(time, id);
				return record(rowFor(id, actor));
			});
		},
		queuePassport(id: string, value: unknown, actor: Actor) {
			if (actor.kind !== "staff") throw new HttpError(403, "Only staff can issue passports.");
			return transaction(() => {
				const row = rowFor(id, actor);
				if (row.status !== "approved") throw new HttpError(409, "Approve the inspection before issuing a passport.");
				const existing = passportFor(id);
				if (existing && existing.status !== "failed") return existing;
				if (existing) {
					const retry = { ...existing, status: "queued" as const, transactionHash: null, error: null };
					db.prepare("UPDATE passports SET data=?,raw_tx=NULL WHERE submission_id=?").run(JSON.stringify(retry), id);
					return retry;
				}
				const input = value as { title?: unknown; grade?: unknown; version?: unknown } | null;
				if (!input || typeof input.title !== "string" || !input.title.trim() || input.title.trim().length > 200 || typeof input.grade !== "string" || input.grade.length > 40) throw new HttpError(400, "Enter an item name and a valid grade, or leave grade empty.");
				if (input.version !== row.version) throw new HttpError(409, "The submission changed. Refresh before issuing.");
				const data = JSON.parse(row.data) as SubmissionInput;
				const approval = db.prepare("SELECT created_at FROM history WHERE submission_id=? AND status='approved' ORDER BY id DESC LIMIT 1").get(id) as { created_at: string };
				const passport: PassportIssuance = { inspectionApprovedAt: approval.created_at, itemId: `0x${digest(`trueorigin:item:${randomUUID()}`)}`, title: input.title.trim(), grade: input.grade.trim(), certifier: row.grading_company, certificationNumber: row.cert,
					recipientAddress: data.recipientAddress, chainId: 31337, contractAddress: null, tokenId: null, metadataURI: null, imageURI: null, transactionHash: null, status: "queued", error: null, createdAt: new Date().toISOString(), confirmedAt: null };
				db.prepare("INSERT INTO passports(submission_id,item_id,data) VALUES (?,?,?)").run(id, passport.itemId, JSON.stringify(passport));
				db.prepare("UPDATE submissions SET data=?,version=version+1 WHERE id=?").run(JSON.stringify({ ...data, title: passport.title, grade: passport.grade }), id);
				return passport;
			});
		},
		passportJobs() {
			return (db.prepare("SELECT submission_id,data,raw_tx FROM passports WHERE json_extract(data,'$.status') NOT IN ('confirmed','failed') ORDER BY rowid").all() as { submission_id: string; data: string; raw_tx: string | null }[]).map(row => ({ submissionId: row.submission_id, passport: JSON.parse(row.data) as PassportIssuance, raw: row.raw_tx }));
		},
		updatePassport(id: string, patch: Partial<PassportIssuance>, raw?: string) {
			const current = passportFor(id); if (!current) throw new Error("Passport job missing.");
			const next = { ...current, ...patch };
			if (raw !== undefined) db.prepare("UPDATE passports SET data=?,raw_tx=? WHERE submission_id=?").run(JSON.stringify(next), raw, id);
			else db.prepare("UPDATE passports SET data=? WHERE submission_id=?").run(JSON.stringify(next), id);
			return next;
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

export type SubmissionStore = ReturnType<typeof openStore>;
