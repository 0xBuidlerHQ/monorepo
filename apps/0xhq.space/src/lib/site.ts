export const site = {
	name: "0xhq.space",
	description:
		"Art, code, music, ideas, and things worth sharing.",
	url: new URL(process.env.SITE_URL || "https://0xhq.space").origin,
	author: "Maxime",
};

export function absoluteUrl(path: string) {
	return new URL(path, `${site.url}/`).href;
}

export const shareImageSize = { width: 1200, height: 480 };
