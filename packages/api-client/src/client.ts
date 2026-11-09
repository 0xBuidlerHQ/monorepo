import "server-only";
import { readFile } from "node:fs/promises";
import { resolve } from "node:path";
import { signedHeaders, type ApiClient, type ServiceKeys } from "./protocol.ts";

export class ApiError extends Error {
	status: number;
	constructor(message: string, status: number) { super(message); this.status = status; }
}
async function secretFor(client: ApiClient) {
	const configured = client === "customer" ? process.env.API_CUSTOMER_SECRET : process.env.API_ADMIN_SECRET;
	if (configured && configured.length >= 32) return configured;
	if (process.env.NODE_ENV === "production") throw new Error("Configure the API service credentials.");
	const path = process.env.API_SERVICE_KEYS_FILE ?? resolve(process.cwd(), "../../services/api/.data/service-keys.json");
	const keys = JSON.parse(await readFile(/* turbopackIgnore: true */ path, "utf8")) as ServiceKeys;
	if (!keys[client] || keys[client].length < 32) throw new Error("Invalid API service credentials.");
	return keys[client];
}
export async function apiRequest(client: ApiClient, subject: string, path: string, options: {
	method?: string; json?: unknown; body?: Uint8Array; contentType?: string; token?: string;
} = {}) {
	if (!path.startsWith("/v1/") || path.includes("\n")) throw new Error("Invalid API path.");
	const origin = process.env.API_URL ?? (process.env.NODE_ENV === "production" ? undefined : "http://localhost:3004");
	if (!origin) throw new Error("Configure API_URL.");
	const method = options.method ?? "GET";
	const body = options.json === undefined ? options.body ?? new Uint8Array() : Buffer.from(JSON.stringify(options.json));
	const headers: Record<string, string> = signedHeaders({ client, secret: await secretFor(client), subject, method, path, body, token: options.token });
	if (body.length) headers["Content-Type"] = options.contentType ?? "application/json";
	const response = await fetch(new URL(path, origin), { method, headers, body: body.length ? Buffer.from(body) : undefined, cache: "no-store", redirect: "error", signal: AbortSignal.timeout(30_000) });
	if (!response.ok) {
		const error = await response.json().catch(() => null);
		throw new ApiError(typeof error?.error === "string" ? error.error : "The service could not complete this request.", response.status);
	}
	return response;
}
export async function apiJson<T>(client: ApiClient, subject: string, path: string, options: Parameters<typeof apiRequest>[3] = {}): Promise<T> {
	return (await apiRequest(client, subject, path, options)).json();
}
