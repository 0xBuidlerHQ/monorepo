import { type NextRequest, NextResponse } from "next/server";
import { isContentLocale, isTranslatedCollection } from "@/lib/locales";

export function proxy(request: NextRequest) {
	const { pathname } = request.nextUrl;
	const segments = pathname.split("/").filter(Boolean);
	if (isContentLocale(segments[0])) {
		// Article image routes keep their own cards. Every other share-image URL
		// uses the static default, including pages that don't otherwise exist.
		if (
			segments.at(-1) === "share-image" &&
			(segments.length !== 4 || !isTranslatedCollection(segments[1]))
		) {
			const fallback = request.nextUrl.clone();
			fallback.pathname = "/share-image.png";
			return NextResponse.rewrite(fallback);
		}
		return NextResponse.next();
	}

	const destination = request.nextUrl.clone();
	destination.pathname = `/en${pathname === "/" ? "" : pathname}`;
	return NextResponse.redirect(destination);
}

export const config = {
	matcher: ["/((?!api|_next|_vercel|.*\\..*).*)"],
};
