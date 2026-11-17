"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import type {
	ActivityKind,
	ActivityPage,
	AssetActivity,
} from "@0xhq/api-client/types";
import { RevealImage } from "@/components/ui/reveal-image";
import { NavigationIcon } from "@/components/icons/navigation-icon";
import { CopyValue } from "@/features/passports/controls";
import { ActivityFilters } from "./activity-filters";
import { FeedSkeleton } from "./feed-skeleton";

const shorten = (value: string) => `${value.slice(0, 6)}…${value.slice(-4)}`;
function ActivityRow({ event }: { event: AssetActivity }) {
	const issued = event.kind === "issued";
	const title = event.passport?.title ?? `Passport #${event.tokenId}`;
	const date = new Intl.DateTimeFormat("en-GB", {
		day: "2-digit",
		month: "short",
		hour: "2-digit",
		minute: "2-digit",
		timeZone: "UTC",
	}).format(new Date(event.timestamp));
	return (
		<li className="group grid grid-cols-[56px_minmax(0,1fr)] items-center gap-x-4 gap-y-3 border-b border-white/[0.07] py-5 sm:grid-cols-[56px_minmax(0,1fr)_auto] sm:gap-x-5 sm:py-6">
			<Link
				href={`/items/${event.itemId}`}
				aria-label={`View ${title}`}
				className="relative grid h-[72px] w-14 place-items-center overflow-hidden rounded-xl bg-white/[0.035] text-white/25"
			>
				{event.passport?.imageURI ? (
					<RevealImage
						unoptimized
						src={`/api/passports/${event.itemId}/image`}
						alt={title}
						fill
						sizes="56px"
						className="object-contain p-1"
					/>
				) : (
					<NavigationIcon name="Registry" className="size-6" />
				)}
			</Link>
			<div className="min-w-0">
				<p
					className={`flex items-center gap-1.5 text-[10px] ${issued ? "text-[#ff8540]" : "text-[#9cbcd4]"}`}
				>
					<NavigationIcon
						name={issued ? "Registry" : "Transfers"}
						className="size-3"
					/>
					{issued
						? "Passport issued"
						: event.kind === "transfer"
							? "Ownership transferred"
							: event.kind === "sale"
								? "Sold"
								: "Listed"}
				</p>
				<Link
					href={`/items/${event.itemId}`}
					className="mt-2 block truncate text-[15px] font-medium tracking-[-0.025em] text-white/90 transition-colors hover:text-white"
				>
					{title}
				</Link>
				{event.passport && (
					<p className="mt-1.5 truncate text-[10px] text-white/35">
						{event.passport.certifier} · {event.passport.certificationNumber}
						{event.passport.grade ? ` · ${event.passport.grade}` : ""}
					</p>
				)}
				<div className="mt-3 flex flex-wrap items-center gap-2 text-[10px] text-white/35">
					<span
						title={issued ? undefined : event.from}
						className={issued ? "" : "font-mono"}
					>
						{issued ? "TrueOrigin" : shorten(event.from)}
					</span>
					<span aria-hidden="true">→</span>
					<span title={event.to} className="font-mono text-white/55">
						{shorten(event.to)}
					</span>
				</div>
			</div>
			<div className="col-start-2 flex items-center justify-between gap-3 sm:col-start-auto sm:flex-col sm:items-end">
				<time
					dateTime={event.timestamp}
					className="text-[10px] tabular-nums text-white/35"
				>
					{date} UTC
				</time>
				<div className="flex items-center gap-2">
					<span
						title={event.transactionHash}
						className="font-mono text-[9px] text-white/25"
					>
						{shorten(event.transactionHash)}
					</span>
					<CopyValue value={event.transactionHash} label="transaction hash" />
				</div>
			</div>
		</li>
	);
}

export function ActivityFeed({ initial }: { initial: ActivityPage | null }) {
	const [kind, setKind] = useState<ActivityKind>("all");
	const [cursor, setCursor] = useState("");
	const [reload, setReload] = useState(0);
	const [state, setState] = useState({
		key: "all:",
		page: initial,
		error: initial === null,
		loading: false,
	});
	const first = useRef(true);
	const key = `${kind}:${cursor}`;
	useEffect(() => {
		let disposed = false;
		let controller: AbortController | undefined;
		async function update() {
			controller?.abort();
			controller = new AbortController();
			const signal = controller.signal;
			setState((previous) => ({ ...previous, loading: true }));
			try {
				const params = new URLSearchParams({ kind });
				if (cursor) params.set("cursor", cursor);
				const response = await fetch(`/api/feed?${params}`, {
					cache: "no-store",
					signal,
				});
				if (!response.ok) throw new Error("Unavailable");
				const page = (await response.json()) as ActivityPage;
				if (!disposed && !signal.aborted)
					setState({ key, page, error: false, loading: false });
			} catch {
				if (!disposed && !signal.aborted)
					setState((previous) => ({
						key,
						page: previous.key === key ? previous.page : null,
						error: true,
						loading: false,
					}));
			}
		}
		if (!first.current || reload > 0) void update();
		first.current = false;
		const timer = !cursor
			? setInterval(() => {
					void update();
				}, 15_000)
			: undefined;
		return () => {
			disposed = true;
			controller?.abort();
			clearInterval(timer);
		};
	}, [kind, cursor, key, reload]);
	const current = state.key === key;
	const page = current ? state.page : null;
	const loading = !current || (!page && !state.error);
	const market = kind === "sale" || kind === "listing";
	return (
		<div>
			<div className="mb-6 flex flex-wrap items-center justify-between gap-4">
				<ActivityFilters value={kind} onChange={value => { setKind(value); setCursor(""); }} />
				<div className="flex items-center gap-3 text-[10px] text-white/35">
					<span className="flex items-center gap-1.5">
						<span
							aria-hidden="true"
							className={`size-1 rounded-full ${state.error && current ? "bg-amber-400/70" : "bg-white/35"}`}
						/>
						{state.error && current
							? "Updates unavailable"
							: cursor
								? "Older activity"
								: "Auto-refresh · 15s"}
					</span>
					<button
						type="button"
						aria-label="Refresh activity"
						disabled={state.loading}
						onClick={() => setReload((value) => value + 1)}
						className="grid size-7 cursor-pointer place-items-center rounded-full text-white/50 transition-colors hover:bg-white/5 hover:text-white disabled:opacity-30"
					>
						<svg
							aria-hidden="true"
							viewBox="0 0 20 20"
							fill="none"
							stroke="currentColor"
							strokeWidth="1.3"
							strokeLinecap="round"
							className="size-3.5"
						>
							<path d="M16 9a6 6 0 1 0-1 4M16 4v5h-5" />
						</svg>
					</button>
				</div>
			</div>
			{current && state.error && (
				<div
					role="alert"
					className="mb-5 flex flex-wrap items-center justify-between gap-3 rounded-2xl bg-white/[0.035] px-5 py-4 text-xs leading-5 text-white/50"
				>
					<span>
						{page
							? "Updates are temporarily unavailable. Showing the last loaded activity."
							: "Activity is temporarily unavailable. Try again shortly."}
					</span>
					<button
						type="button"
						onClick={() => setReload((value) => value + 1)}
						className="cursor-pointer text-white/80 hover:text-white"
					>
						Try again ↗
					</button>
				</div>
			)}
			{loading ? (
				<FeedSkeleton />
			) : page && page.events.length > 0 ? (
				<ul className="border-t border-white/[0.07]">
					{page.events.map((event) => (
						<ActivityRow key={event.id} event={event} />
					))}
				</ul>
			) : (
				page && (
					<div className="flex min-h-72 flex-col items-center justify-center border-y border-white/[0.07] px-6 py-14 text-center">
						<NavigationIcon name="Feed" className="mb-5 size-8 text-white/20" />
						<h2 className="text-xl font-medium tracking-tight">
							{market
								? kind === "sale"
									? "No sales yet."
									: "No listings yet."
								: "The next chapter starts here."}
						</h2>
						<p className="mt-3 max-w-sm text-xs leading-6 text-white/40">
							{market
								? "Marketplace is coming soon. Marketplace activity will appear here once buying and selling are available."
								: kind === "issued"
									? "New passports will appear here as they’re issued."
									: kind === "transfer"
										? "Ownership transfers will appear here as they’re recorded."
										: "New passports and ownership changes will appear here as they happen."}
						</p>
						<Link
							href="/explore"
							className="mt-6 text-xs text-white/70 transition-colors hover:text-white"
						>
							Explore objects ↗
						</Link>
					</div>
				)
			)}
			{page && (page.nextCursor || cursor) && (
				<div className="mt-6 flex items-center justify-between gap-4">
					{cursor ? (
						<button
							type="button"
							onClick={() => setCursor("")}
							className="cursor-pointer text-xs text-white/60 hover:text-white"
						>
							↑ Latest activity
						</button>
					) : (
						<span />
					)}
					{page.nextCursor && (
						<button
							type="button"
							onClick={() => setCursor(page.nextCursor ?? "")}
							className="cursor-pointer rounded-full bg-white/5 px-5 py-3 text-xs text-white/70 transition-colors hover:bg-white/10 hover:text-white"
						>
							Older activity ↓
						</button>
					)}
				</div>
			)}
			<p className="mt-6 text-[10px] leading-5 text-white/25">
				A transfer records NFT ownership. It doesn’t confirm a sale or physical
				delivery.
			</p>
		</div>
	);
}
