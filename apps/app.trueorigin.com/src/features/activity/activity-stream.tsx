"use client";

import { passportDisplayTitle } from "@0xhq/api-client/passport-item";
import type {
	ActivityKind,
	ActivityPage,
	AssetActivity,
} from "@0xhq/api-client/types";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { NavigationIcon } from "@/components/icons/navigation-icon";
import { PageHeader } from "@/features/shell/page-header";
import { ActivityBadge } from "./activity-badge";
import { ActivityFilters } from "./activity-filters";
import { ActivitySkeleton } from "./activity-skeleton";
import { relativeActivityTime } from "./relative-time";

const shorten = (value: string) => `${value.slice(0, 6)}…${value.slice(-4)}`;
function IdentifierCopy({
	value,
	label,
	display,
}: {
	value: string;
	label: string;
	display?: string;
}) {
	const [status, setStatus] = useState<"idle" | "copied" | "error">("idle");
	useEffect(() => {
		if (status === "idle") return;
		const timer = setTimeout(() => setStatus("idle"), 1800);
		return () => clearTimeout(timer);
	}, [status]);
	return (
		<button
			type="button"
			title={value}
			aria-label={`Copy ${label}`}
			onClick={async () => {
				try {
					await navigator.clipboard.writeText(value);
					setStatus("copied");
				} catch {
					setStatus("error");
				}
			}}
			className="relative z-20 flex cursor-pointer items-center gap-2 justify-self-start whitespace-nowrap rounded px-1 py-1 font-mono text-[11px] text-white/60 transition-colors hover:bg-white/5 hover:text-white"
		>
			<span role="status">
				{status === "copied"
					? "Copied ✓"
					: status === "error"
						? "Copy failed"
						: (display ?? (value.length > 10 ? shorten(value) : value))}
			</span>
			{status === "idle" && (
				<svg
					aria-hidden="true"
					viewBox="0 0 16 16"
					fill="none"
					stroke="currentColor"
					className="size-3 text-white/25"
				>
					<rect x="6" y="6" width="7" height="7" rx="1" />
					<path d="M10 6V3H3v7h3" />
				</svg>
			)}
		</button>
	);
}
function ActivityRow({
	event,
	now,
}: {
	event: AssetActivity;
	now: number | null;
}) {
	const issued = event.kind === "issued";
	const title = event.passport
		? passportDisplayTitle(event.passport, "short")
		: `Passport #${event.tokenId}`;
	const exactTime = new Date(event.timestamp)
		.toISOString()
		.replace("T", " ")
		.replace(/\.\d{3}Z$/, " UTC");
	return (
		<li className="group relative grid min-w-[1260px] grid-cols-[6rem_8.5rem_5rem_6.5rem_3rem_6.5rem_6.5rem_6.5rem_6.5rem_5rem_2rem] items-center justify-between gap-x-4 border-b border-white/[0.06] px-4 py-2 transition-colors hover:bg-white/[0.035]">
			<ActivityBadge kind={event.kind} />
			<Link
				href={`/registry/${event.itemId}`}
				title={title}
				className="relative z-20 flex w-fit min-w-0 max-w-full items-center gap-2 rounded-sm focus-visible:outline-2 focus-visible:outline-white"
			>
				<span className="grid size-7 shrink-0 place-items-center">
					{event.passport?.imageURI ? (
						<Image
							unoptimized
							src={`/api/passports/${event.itemId}/image`}
							alt=""
							width={28}
							height={28}
							className="size-7 object-contain"
						/>
					) : (
						<NavigationIcon
							name="Registry"
							className="size-3.5 text-white/25"
						/>
					)}
				</span>
				<span className="truncate text-sm font-medium tracking-tight text-white/95 transition-colors group-hover:text-white">
					{title}
				</span>
				<svg
					aria-hidden="true"
					viewBox="0 0 20 20"
					fill="none"
					stroke="currentColor"
					strokeWidth="1.5"
					strokeLinecap="round"
					strokeLinejoin="round"
					className="ml-auto size-3.5 shrink-0 -translate-x-1.5 translate-y-1.5 text-white/60 opacity-0 transition-[opacity,translate] duration-300 ease-out group-hover:translate-x-0 group-hover:translate-y-0 group-hover:opacity-100 group-focus-within:translate-x-0 group-focus-within:translate-y-0 group-focus-within:opacity-100 motion-reduce:translate-x-0 motion-reduce:translate-y-0 motion-reduce:transition-none"
				>
					<path d="m5 15 10-10M5 5h10v10" />
				</svg>
			</Link>
			<span className="flex min-w-0 items-center gap-1.5 text-[11px] text-white/65">
				<span className="truncate">{event.category ?? "—"}</span>
				{event.category === "Pokémon" && (
					<Image
						src="/pika.png"
						alt=""
						width={20}
						height={20}
						className="size-5 shrink-0 object-contain"
					/>
				)}
			</span>
			<IdentifierCopy value={event.itemId} label="item ID" />
			{event.passport?.certifier === "PSA" ? (
				// Official white logo: https://store.psacard.com/cdn/shop/files/logo_white.png
				<Image
					src="/images/certifiers/psa.png"
					alt="PSA"
					width={36}
					height={12}
					className="h-3 w-9 justify-self-start object-contain"
				/>
			) : (
				<span className="justify-self-start rounded border border-white/10 bg-white/[0.04] px-1.5 py-0.5 text-[10px] font-semibold text-white/80">
					{event.passport?.certifier ?? "—"}
				</span>
			)}
			{event.passport?.certificationNumber ? (
				<IdentifierCopy
					value={event.passport.certificationNumber}
					label="certification ID"
				/>
			) : (
				<span className="text-[11px] text-white/35">—</span>
			)}
			<IdentifierCopy
				value={event.from}
				label="sender address"
				display={issued ? "TrueOrigin" : undefined}
			/>
			<IdentifierCopy value={event.to} label="recipient address" />
			<IdentifierCopy value={event.transactionHash} label="transaction hash" />
			<Link
				href={`/activity/${encodeURIComponent(event.id)}`}
				tabIndex={-1}
				className="relative z-20 justify-self-start"
			>
				<time
					dateTime={event.timestamp}
					title={exactTime}
					className="justify-self-start whitespace-nowrap text-[11px] tabular-nums text-white/55"
				>
					{now === null
						? exactTime
						: relativeActivityTime(event.timestamp, now)}
				</time>
			</Link>
			<Link
				href={`/activity/${encodeURIComponent(event.id)}`}
				aria-label={`Inspect event for ${title}`}
				title="Inspect event"
				className="grid size-7 items-center justify-items-center justify-self-end rounded-md text-white/50 after:absolute after:inset-0 after:z-10 after:cursor-pointer transition-colors hover:text-white/90 focus-visible:text-white/90 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white motion-reduce:transition-none"
			>
				<svg
					aria-hidden="true"
					viewBox="0 0 20 20"
					fill="none"
					stroke="currentColor"
					strokeWidth="1.5"
					strokeLinecap="round"
					strokeLinejoin="round"
					className="size-4 -translate-x-3 opacity-0 transition-[opacity,translate] duration-300 ease-out group-hover:translate-x-0 group-hover:opacity-100 group-focus-within:translate-x-0 group-focus-within:opacity-100 motion-reduce:translate-x-0 motion-reduce:transition-none [@media(hover:none)]:translate-x-0 [@media(hover:none)]:opacity-60"
				>
					<path d="M4 10h12m-5-5 5 5-5 5" />
				</svg>
			</Link>
		</li>
	);
}

export function ActivityStream({ initial }: { initial: ActivityPage | null }) {
	const [now, setNow] = useState<number | null>(null);
	useEffect(() => {
		const update = () => setNow(Date.now());
		update();
		const timer = setInterval(update, 30_000);
		return () => clearInterval(timer);
	}, []);
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
				const response = await fetch(`/api/activity?${params}`, {
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
			<PageHeader title="Activity" titleId="activity-title" />
			<div className="mt-10">
				<div className="mb-4 flex flex-wrap items-center justify-between gap-4">
					<ActivityFilters
						value={kind}
						onChange={(value) => {
							setKind(value);
							setCursor("");
						}}
					/>
					<div className="flex items-center gap-3 text-[10px] text-white/35">
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
					<ActivitySkeleton />
				) : page && page.events.length > 0 ? (
					<div className="overflow-x-auto">
						<div
							aria-hidden="true"
							className="grid min-w-[1260px] grid-cols-[6rem_8.5rem_5rem_6.5rem_3rem_6.5rem_6.5rem_6.5rem_6.5rem_5rem_2rem] items-center justify-between gap-x-4 border-y border-white/[0.08] px-4 py-3 text-[10px] font-medium uppercase tracking-[0.07em] text-white/50"
						>
							<span>Event</span>
							<span>Object</span>
							<span>Category</span>
							<span>Item ID</span>

							<span>Certifier</span>
							<span>Certification ID</span>
							<span>From</span>
							<span>To</span>
							<span>Transaction</span>
							<span>Time</span>
							<span>
								<span className="sr-only">Event details</span>
							</span>
						</div>
						<ul>
							{page.events.map((event) => (
								<ActivityRow key={event.id} event={event} now={now} />
							))}
						</ul>
					</div>
				) : (
					page && (
						<div className="flex min-h-72 flex-col items-center justify-center border-y border-white/[0.07] px-6 py-14 text-center">
							<NavigationIcon
								name="Activity"
								className="mb-5 size-8 text-white/20"
							/>
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
			</div>
		</div>
	);
}
