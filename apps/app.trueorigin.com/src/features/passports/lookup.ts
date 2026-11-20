export function passportIdFromInput(input: string): string | null {
	const value = input.trim();
	if (/^0x[0-9a-f]{64}$/i.test(value)) return value.toLowerCase();
	try {
		const url = new URL(value, "https://app.trueorigin.com");
		if (url.protocol !== "https:" && url.protocol !== "http:") return null;
		const match = url.pathname.match(/^\/(?:registry|items)\/(0x[0-9a-f]{64})\/?$/i);
		return match?.[1].toLowerCase() ?? null;
	} catch { return null; }
}
