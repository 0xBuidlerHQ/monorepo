"use client";

import { useRouter } from "next/navigation";
import { addTransitionType, useEffect, useRef, useState, useTransition } from "react";

export function LiveCatalogSearch({ query, placeholder = "Search cards or sets…" }: { query: string; placeholder?: string }) {
	const router = useRouter();
	const [value, setValue] = useState(query);
	const [pending, startTransition] = useTransition();
	const requestedQuery = useRef(query);
	const timer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);

	useEffect(() => {
		// A response to our own search must not overwrite newer keystrokes.
		if (query !== requestedQuery.current) {
			clearTimeout(timer.current);
			setValue(query);
			requestedQuery.current = query;
		}
	}, [query]);

	useEffect(() => () => clearTimeout(timer.current), []);

	function search(next: string) {
		clearTimeout(timer.current);
		const url = new URL(window.location.href);
		if ((url.searchParams.get("q") ?? "") === next) return;
		if (next) url.searchParams.set("q", next);
		else url.searchParams.delete("q");
		url.searchParams.delete("page");
		requestedQuery.current = next;
		startTransition(() => {
			addTransitionType("catalog-search");
			router.replace(url.pathname + url.search + url.hash, { scroll: false });
		});
	}

	return <search aria-busy={pending} className="w-full sm:w-80"><form onSubmit={(event) => { event.preventDefault(); search(value); }} className="flex w-full items-center gap-3 rounded-2xl bg-black/20 px-4 ring-1 ring-white/[0.06] transition-[background-color,box-shadow] focus-within:bg-black/30 focus-within:ring-white/25 sm:w-80">
		<svg aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="size-4 shrink-0 text-white/40"><circle cx="10.5" cy="10.5" r="6.5" /><path d="m16 16 5 5" /></svg>
		<input type="search" name="q" value={value} onChange={(event) => {
			const next = event.target.value;
			setValue(next);
			clearTimeout(timer.current);
			timer.current = setTimeout(() => search(next), 200);
		}} aria-label={placeholder} placeholder={placeholder} className="h-11 w-full min-w-0 bg-transparent text-sm outline-none placeholder:text-white/30" />
	</form></search>;
}
