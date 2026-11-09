import { ContentSurface } from "@/features/shell/content-surface";

export const metadata = { title: "Scan" };

export default function ScanPage() {
	return <ContentSurface><h1 className="pb-8 text-[clamp(48px,9vw,120px)] font-medium leading-none tracking-[-0.065em] text-white">Scan</h1></ContentSurface>;
}
