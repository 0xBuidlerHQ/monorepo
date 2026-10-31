export function getTitleHue(title: string): number {
	const normalized = title
		.normalize("NFKC")
		.trim()
		.replace(/\s+/g, " ")
		.toLowerCase();
	let hash = 0x811c9dc5;
	for (let index = 0; index < normalized.length; index++) {
		hash = Math.imul(hash ^ normalized.charCodeAt(index), 0x01000193);
	}
	return (hash >>> 0) % 360;
}
