"use client";

import { useEffect, useId, useState } from "react";
import { newsletterMessages } from "@/lib/newsletter-messages";
import { useLocale } from "./locale-provider";

export function NewsletterForm({
	signupUrl,
	fillSpace = false,
}: {
	signupUrl?: string;
	fillSpace?: boolean;
}) {
	const locale = useLocale();
	const t = newsletterMessages[locale];
	const id = useId();
	const [pending, setPending] = useState(false);
	useEffect(() => {
		const reset = () => setPending(false);
		window.addEventListener("pageshow", reset);
		return () => window.removeEventListener("pageshow", reset);
	}, []);
	return (
		<form
			action={signupUrl}
			method="post"
			className={fillSpace ? "mt-5 flex flex-1 flex-col gap-6" : "mt-5"}
			onSubmit={(event) => {
				if (!signupUrl || pending) {
					event.preventDefault();
					return;
				}
				setPending(true);
			}}
		>
			<input type="hidden" name="embed" value="1" />
			<input type="hidden" name="metadata__language" value={locale} />
			<input type="hidden" name="metadata__source" value="0xhq" />
			<label htmlFor={`${id}-email`} className="sr-only">
				{t.email}
			</label>
			<div className="flex flex-col gap-3">
				<input
					id={`${id}-email`}
					name="email"
					type="email"
					required
					maxLength={254}
					autoComplete="email"
					inputMode="email"
					spellCheck={false}
					placeholder={t.email}
					className="min-w-0 flex-1 rounded-xl border border-foreground/20 bg-background px-4 py-3.5 text-sm outline-none focus:border-foreground/60 focus-visible:ring-1 focus-visible:ring-foreground/40"
				/>
			</div>
			<button
				type="submit"
				disabled={pending}
				aria-busy={pending}
				className={`group ${fillSpace ? "mt-auto" : "mt-6"} flex min-h-16 w-full cursor-pointer items-center justify-between gap-4 rounded-full border border-black/15 bg-white px-6 py-5 text-base font-medium text-black transition-colors hover:bg-zinc-100 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-foreground disabled:cursor-default disabled:opacity-50`}
			>
				<span>{pending ? t.pending : t.subscribe}</span>
				<svg
					aria-hidden="true"
					viewBox="0 0 24 24"
					fill="none"
					stroke="currentColor"
					strokeWidth="1.5"
					strokeLinecap="round"
					strokeLinejoin="round"
					className="size-6 shrink-0 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5 motion-reduce:transform-none motion-reduce:transition-none"
				>
					<path d="M7 17 17 7M7 7h10v10" />
				</svg>
			</button>
		</form>
	);
}
