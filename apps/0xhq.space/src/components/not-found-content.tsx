"use client";
import Link from "next/link";
import { useLocale } from "./locale-provider";
import { messages } from "@/lib/messages";
export function NotFoundContent() {
	const locale = useLocale();
	const t = messages[locale];
	return (
		<section className="w-full min-w-0 py-12">
			<h1 className="thought-title text-4xl sm:text-5xl">{t.notFound}</h1>
			<p className="mt-4 text-sm text-foreground/60">{t.notFoundDescription}</p>
			<Link
				href={`/${locale}`}
				className="mt-6 inline-block underline underline-offset-4"
			>
				{t.backHome}
			</Link>
		</section>
	);
}
