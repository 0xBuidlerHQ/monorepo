"use client";

import { useId } from "react";
import { newsletterMessages } from "@/lib/newsletter-messages";
import { useLocale } from "./locale-provider";
import { NewsletterForm } from "./newsletter-form";
import { PageContainer } from "./page-container";

export function NewsletterSignup({ signupUrl }: { signupUrl: string }) {
	const locale = useLocale();
	const t = newsletterMessages[locale];
	const id = useId();

	return (
		<section
			aria-labelledby={`${id}-title`}
			className="border-t border-foreground/10"
		>
			<PageContainer className="py-10 sm:py-12">
				<div className="max-w-xl">
					<h2
						id={`${id}-title`}
						className="text-2xl font-semibold tracking-tight"
					>
						{t.title}
					</h2>
					<p className="mt-3 text-sm leading-relaxed text-foreground/65">
						{t.description}
					</p>
					<NewsletterForm signupUrl={signupUrl} />
				</div>
			</PageContainer>
		</section>
	);
}
