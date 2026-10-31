import { type NextRequest, NextResponse } from "next/server";
import { isContentLocale } from "@/lib/locales";

export function proxy(request: NextRequest) {
	const { pathname } = request.nextUrl;
	if (isContentLocale(pathname.split("/")[1])) return NextResponse.next();

	const destination = request.nextUrl.clone();
	destination.pathname = `/en${pathname === "/" ? "" : pathname}`;
	return NextResponse.redirect(destination);
}

export const config = {
	matcher: ["/((?!api|_next|_vercel|.*\\..*).*)"],
};
