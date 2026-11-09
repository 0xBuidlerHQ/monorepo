import Link from "next/link";
import { ContentSurface } from "@/features/shell/content-surface";

export const metadata = { title: "Collection" };

export default function CollectionPage() {
	return <ContentSurface><h1 className="pb-8 text-[clamp(48px,9vw,120px)] font-medium leading-none tracking-[-0.065em] text-white">Collection</h1><Link href="/submit" className="inline-flex rounded-full bg-white px-5 py-3 text-sm text-black">Submit an item ↗</Link></ContentSurface>;
}
