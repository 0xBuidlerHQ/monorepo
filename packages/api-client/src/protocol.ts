import { createHash, createHmac, timingSafeEqual, randomUUID } from "node:crypto";
export type ApiClient = "customer" | "admin";
export type ServiceKeys = { customer: string; admin: string };
export const digest = (value: string | Uint8Array) => createHash("sha256").update(value).digest("hex");

function message(method: string, path: string, subject: string, time: string, nonce: string, authorization: string, body: Uint8Array) {
	return [method.toUpperCase(), path, subject, time, nonce, digest(authorization), digest(body)].join("\n");
}
export function signedHeaders({ client, secret, subject, method, path, body = new Uint8Array(), token = "", now = Date.now() }: {
	client: ApiClient; secret: string; subject: string; method: string; path: string; body?: Uint8Array; token?: string; now?: number;
}) {
	const time = String(now), nonce = randomUUID(), authorization = token ? `Bearer ${token}` : "";
	const signature = createHmac("sha256", secret).update(message(method, path, subject, time, nonce, authorization, body)).digest("hex");
	return { "X-Trueorigin-Client": client, "X-Trueorigin-Subject": subject, "X-Trueorigin-Time": time, "X-Trueorigin-Nonce": nonce, "X-Trueorigin-Signature": signature, ...(authorization ? { Authorization: authorization } : {}) };
}
export function verifySignature({ headers, keys, method, path, body, now = Date.now() }: {
	headers: Headers; keys: ServiceKeys; method: string; path: string; body: Uint8Array; now?: number;
}) {
	const client = headers.get("x-trueorigin-client");
	const subject = headers.get("x-trueorigin-subject") ?? "";
	const time = headers.get("x-trueorigin-time") ?? "";
	const nonce = headers.get("x-trueorigin-nonce") ?? "";
	const signature = headers.get("x-trueorigin-signature") ?? "";
	if ((client !== "customer" && client !== "admin") || !/^[a-z0-9:-]{1,160}$/.test(subject) || !/^\d{13}$/.test(time) || Math.abs(now - Number(time)) > 30_000 || !/^[a-f0-9-]{36}$/.test(nonce) || !/^[a-f0-9]{64}$/.test(signature)) return null;
	const expected = createHmac("sha256", keys[client]).update(message(method, path, subject, time, nonce, headers.get("authorization") ?? "", body)).digest();
	if (!timingSafeEqual(expected, Buffer.from(signature, "hex"))) return null;
	return { client, subject, nonce, expires: Number(time) + 30_000 };
}
