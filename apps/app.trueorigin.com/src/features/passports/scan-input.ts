import { passportIdFromInput } from "./lookup.ts";

export function verificationInputFromScan(
	input: string,
): { query: string; certifier?: string } | null {
	const value = input.trim();
	const itemId = passportIdFromInput(value);
	if (itemId) return { query: itemId };
	if (/^[A-Z0-9-]{3,40}$/i.test(value)) return { query: value };
	try {
		const url = new URL(value);
		if (!["http:", "https:"].includes(url.protocol)) return null;
		if (
			["psacard.com", "www.psacard.com"].includes(url.hostname.toLowerCase())
		) {
			const number = url.pathname.match(
				/^\/cert\/(\d{6,16})(?:\/psa)?\/?$/i,
			)?.[1];
			if (number) return { query: number, certifier: "PSA" };
		}
	} catch {
		/* Unsupported codes stay within Verify rather than opening arbitrary links. */
	}
	return null;
}
