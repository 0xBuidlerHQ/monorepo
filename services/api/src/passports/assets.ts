const imageTypes: Record<string, string> = {
 "passport.svg": "image/svg+xml", "passport.webp": "image/webp", "passport.png": "image/png", "passport.jpg": "image/jpeg",
};
export function passportAsset(uri: string, kind: "image" | "metadata") {
 const parsed = new URL(uri);
 const name = parsed.pathname.slice(1);
 const contentType = kind === "metadata" && name === "metadata.json" ? "application/json" : kind === "image" ? imageTypes[name] : undefined;
 if (parsed.protocol !== "ipfs:" || parsed.search || parsed.hash || !contentType) throw new Error("Invalid passport asset reference.");
 return { name, contentType };
}
export type PassportImage = { name: "passport.webp" | "passport.png" | "passport.jpg"; contentType: string; bytes: Uint8Array; development?: boolean };
