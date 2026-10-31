import { createShareImage } from "@/lib/share-image";

export function GET() {
	return createShareImage();
}
