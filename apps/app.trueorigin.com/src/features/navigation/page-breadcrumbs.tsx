"use client";

import { catalogLanguage } from "@/features/reference/catalog-language";
import { Suspense, useEffect, useState } from "react";
import Link from "next/link";
import { useSelectedLayoutSegments, useSearchParams } from "next/navigation";
import {
	breadcrumbTrail,
	needsBreadcrumbDetail,
	type BreadcrumbDetail,
} from "./breadcrumb-trail";

const names = new Map<string, BreadcrumbDetail>();
export function PageBreadcrumbs() {
 const segments = useSelectedLayoutSegments();
 const pathname = "/" + segments.filter(segment => !segment.startsWith("(")).join("/");
 return <Suspense fallback={<BreadcrumbContent pathname={pathname} params={new URLSearchParams()} />}>
  <QueryBreadcrumbs pathname={pathname} />
 </Suspense>;
}

function QueryBreadcrumbs({ pathname }: { pathname: string }) {
 const params = useSearchParams();
 return <BreadcrumbContent pathname={pathname} params={params} />;
}

function BreadcrumbContent({ pathname, params }: { pathname: string; params: Pick<URLSearchParams, "get"> }) {
	const language = catalogLanguage(params.get("lang"));
	const key = `${pathname}:${language}:collections`;
	const [resolved, setResolved] = useState<{
		key: string;
		detail: BreadcrumbDetail;
	} | null>(null);
	useEffect(() => {
		if (!needsBreadcrumbDetail(pathname)) return;
		const cached = names.get(key);
		if (cached) {
			setResolved({ key, detail: cached });
			return;
		}
		const controller = new AbortController();
		const query = new URLSearchParams({ path: pathname, lang: language, schema: "collections" });
		void fetch(`/api/breadcrumbs?${query}`, { signal: controller.signal })
			.then(async (response) => {
				if (!response.ok) return;
				const detail = (await response.json()) as BreadcrumbDetail;
				if (controller.signal.aborted) return;
				if (names.size >= 128) names.clear();
				names.set(key, detail);
				setResolved({ key, detail });
			})
			.catch(() => {
				/* Keep the route's breadcrumb links available if names cannot be loaded. */
			});
		return () => controller.abort();
	}, [key, pathname, language]);
	const detail = resolved?.key === key ? resolved.detail : undefined;
	const trail = breadcrumbTrail(pathname, params, detail);
	return (
		<nav
			aria-label="Breadcrumb"
			data-page-breadcrumbs
			className="flex h-7 shrink-0 items-center overflow-hidden border-t border-white/[0.06] pr-4 text-[11px]"
		>
			<div aria-hidden="true" className="h-full w-10 shrink-0 border-r border-white/[0.07]" />
            <ol className="flex h-full min-w-0 flex-1 items-center gap-2 overflow-x-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
				{trail.map((item, index) => (
					<li key={`${item.href}:${item.label}`} className={`flex shrink-0 items-center gap-2 ${index === 0 && item.label === "Explore" ? "pl-2" : ""}`}>
						{(index > 0 || item.label === "Explore") && (
							<span aria-hidden="true" className="text-white/20">
								/
							</span>
						)}
						<Link
							href={item.href}
							aria-current={index === trail.length - 1 ? "page" : undefined}
							className={`whitespace-nowrap transition-colors hover:text-white ${index === trail.length - 1 ? "text-white/75" : "text-white/40"}`}
						>
							{item.label}
						</Link>
					</li>
				))}
			</ol>
		</nav>
	);
}
