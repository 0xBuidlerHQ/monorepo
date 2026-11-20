import {
	itemAttributeDetails,
	itemUniverseLabel,
 itemTypeLabel,
	passportDisplayTitle,
} from "@0xhq/api-client/passport-item";
import type { PublicPassportDetail } from "@0xhq/api-client/types";
import { createActivityId } from "@0xhq/trueorigin-sdk/activity";
import Image from "next/image";
import Link from "next/link";
import { RevealImage } from "@/components/ui/reveal-image";
import { ActivityBadge } from "@/features/activity/activity-badge";
import { CopyValue, RecheckPassport, TransferPassport } from "./controls";

const shorten = (value: string) => `${value.slice(0, 6)}…${value.slice(-4)}`;
function date(value: string) {
	return new Intl.DateTimeFormat("en-GB", {
		day: "numeric",
		month: "short",
		year: "numeric",
		hour: "2-digit",
		minute: "2-digit",
		hour12: false,
		timeZone: "UTC",
	}).format(new Date(value));
}
function Fact({ label, value }: { label: string; value: string }) {
	return (
		<div className="grid min-w-0 gap-2 border-t border-white/[0.07] py-3 sm:grid-cols-[8rem_minmax(0,1fr)] sm:items-center sm:gap-5">
			<dt className="text-[11px] text-white/40">{label}</dt>
			<dd className="flex min-w-0 items-center justify-between gap-3">
				<span className="break-all font-mono text-[11px] leading-5 text-white/60">
					{value}
				</span>
				<CopyValue value={value} label={label.toLowerCase()} />
			</dd>
		</div>
	);
}
export function PassportDetail({
	passport,
}: {
	passport: PublicPassportDetail;
}) {
	const { verification } = passport;
	const verified = verification.status === "verified";
	const owner = verified ? verification.currentOwner : null;
	const title = passportDisplayTitle(passport);
	const attributes = itemAttributeDetails(passport.item);
	const history = [...verification.history].reverse();
	return (
		<article
			aria-labelledby="passport-title"
			className="mx-auto max-w-[1200px] pb-8"
		>
			<div className="flex flex-wrap items-center justify-between gap-3 border-b border-white/[0.07] pb-5">
				<Link
					href="/passports"
					className="group inline-flex items-center gap-2 text-xs text-white/45 transition-colors hover:text-white"
				>
					<span
						aria-hidden="true"
						className="transition-transform group-hover:-translate-x-0.5 motion-reduce:transform-none"
					>
						←
					</span>
					Passports
				</Link>
				<span
					title={passport.itemId}
					className="font-mono text-[10px] text-white/30"
				>
					{shorten(passport.itemId)}
				</span>
			</div>
			<div className="mt-8 grid items-start gap-8 md:mt-12 md:grid-cols-[minmax(0,0.8fr)_minmax(0,1.2fr)] md:gap-12 lg:gap-20">
				<div className="relative grid h-72 place-items-center rounded-2xl bg-[radial-gradient(ellipse_at_center,rgba(255,255,255,0.045),transparent_75%)] sm:h-96 md:sticky md:top-24 md:h-[440px]">
					<RevealImage
						unoptimized
						src={`/api/passports/${passport.itemId}/image`}
						alt={title}
						fill
						preload
						sizes="(min-width: 768px) 40vw, 90vw"
						className="object-contain p-4"
					/>
				</div>
				<div className="min-w-0">
					<div className="flex flex-wrap items-center gap-3 text-[11px]">
						<span className="text-white/45">
							{itemUniverseLabel(passport.item.universe)} · {itemTypeLabel(passport.item)}
						</span>
						<span
							className={`inline-flex items-center gap-1.5 rounded-md px-2 py-1 ${verified ? "bg-emerald-400/[0.05] text-emerald-300/80" : "bg-amber-400/[0.06] text-amber-200/80"}`}
						>
							<span
								aria-hidden="true"
								className="size-1 rounded-full bg-current"
							/>
							{verified
								? "Passport verified"
								: verification.status === "mismatch"
									? "Record mismatch"
									: "Verification unavailable"}
						</span>
					</div>
					<h1
						id="passport-title"
						className="mt-5 font-serif text-[clamp(36px,4vw,60px)] font-medium leading-[1.04] tracking-[-0.055em] text-white"
					>
						{title}
					</h1>
					<div className="mt-6 flex flex-wrap items-center gap-3 border-y border-white/[0.08] py-4">
						{passport.certifier === "PSA" ? (
							<Image
								src="/images/certifiers/psa.png"
								alt="PSA"
								width={42}
								height={14}
								className="h-auto w-10 object-contain"
							/>
						) : (
							<span className="text-sm font-medium text-white/80">
								{passport.certifier}
							</span>
						)}
						<span className="font-mono text-xs text-white/55">
							#{passport.certificationNumber}
						</span>
						<CopyValue
							value={passport.certificationNumber}
							label="certification ID"
						/>
						{passport.grade && (
							<div className="ml-auto flex items-baseline gap-2">
								<span className="text-[11px] text-white/35">Grade</span>
								<span className="font-mono text-2xl tracking-tight text-white/85">
									{passport.grade}
								</span>
							</div>
						)}
					</div>
					{!verified && (
						<p
							role="status"
							className="mt-5 rounded-lg bg-amber-300/[0.04] p-4 text-xs leading-6 text-amber-100/65"
						>
							{verification.message} Verification of the digital record does not
							establish physical authenticity.
						</p>
					)}
					<section aria-labelledby="owner-heading" className="mt-6">
						<h2 id="owner-heading" className="text-[11px] text-white/40">
							Current passport owner
						</h2>
						{owner ? (
							<div className="mt-3 flex min-w-0 items-center justify-between gap-3">
								<p
									title={owner}
									className="truncate font-mono text-sm text-white/85"
								>
									{owner}
								</p>
								<CopyValue value={owner} label="owner address" />
							</div>
						) : (
							<p className="mt-3 text-xs leading-6 text-white/45">
								Ownership is unavailable until the passport can be verified
								on-chain.
							</p>
						)}
						<p className="mt-2 text-[11px] leading-5 text-white/30">
							Digital ownership does not confirm physical possession or
							delivery.
						</p>
						<TransferPassport itemId={passport.itemId} owner={owner} />
					</section>
					<section
						aria-labelledby="inspection-heading"
						className="mt-6 border-t border-white/[0.07] pt-5"
					>
						<h2 id="inspection-heading" className="text-[11px] text-white/40">
							TrueOrigin inspection
						</h2>
						<div className="mt-2 flex flex-wrap items-center justify-between gap-2">
							<p className="text-sm text-white/75">
								{passport.inspection.status === "approved"
									? "Inspection approved"
									: "Approval not recorded"}
							</p>
							{passport.inspection.approvedAt && (
								<time
									dateTime={passport.inspection.approvedAt}
									className="text-[11px] tabular-nums text-white/35"
								>
									{date(passport.inspection.approvedAt)} UTC
								</time>
							)}
						</div>
					</section>
					<div className="mt-5 flex flex-wrap items-center gap-3">
						<RecheckPassport />
						<span className="text-[10px] text-white/30">
							Checked {date(verification.checkedAt)} UTC
						</span>
					</div>
				</div>
			</div>
			<div className="mt-12 grid gap-12 border-t border-white/[0.08] pt-8 lg:grid-cols-[minmax(0,1.2fr)_minmax(0,0.8fr)] lg:gap-16">
				<section aria-labelledby="history-heading" className="min-w-0">
					<div className="flex items-baseline justify-between gap-4">
						<h2
							id="history-heading"
							className="text-xl font-medium tracking-tight"
						>
							Activity
						</h2>
						<span className="text-[11px] text-white/30">
							{history.length}
							{verification.historyTruncated ? "+" : ""} events
						</span>
					</div>
					<p className="mt-2 text-xs text-white/40">
						Registrations and changes of digital ownership.
					</p>
					{history.length ? (
						<ol className="mt-5">
							{history.map((event) => {
								const eventId = createActivityId(
									passport.chainId,
									event.transactionHash,
									event.logIndex,
								);
								const registered = event.kind === "mint";
								return (
									<li
										key={eventId}
										className="group relative border-t border-white/[0.07] py-4 transition-colors hover:bg-white/[0.02]"
									>
										<div className="flex items-center justify-between gap-3">
											<ActivityBadge
												kind={registered ? "issued" : "transfer"}
											/>
											<time
												dateTime={event.timestamp}
												className="text-[10px] tabular-nums text-white/35"
											>
												{date(event.timestamp)} UTC
											</time>
										</div>
										<div className="mt-3 flex items-center justify-between gap-3">
											<p className="min-w-0 truncate font-mono text-[11px] text-white/55">
												{registered ? "TrueOrigin" : shorten(event.from)}
												<span className="mx-2 text-white/20">→</span>
												{shorten(event.to)}
											</p>
											<Link
												href={`/activity/${eventId}`}
												aria-label={`View ${registered ? "registration" : "transfer"} event`}
												className="inline-flex shrink-0 items-center gap-2 rounded text-[11px] text-white/40 after:absolute after:inset-0 after:z-10 transition-colors hover:text-white focus-visible:outline-2 focus-visible:outline-white"
											>
												View event
												<span
													aria-hidden="true"
													className="transition-transform group-hover:translate-x-0.5 motion-reduce:transform-none"
												>
													→
												</span>
											</Link>
										</div>
									</li>
								);
							})}
						</ol>
					) : (
						<p className="mt-5 border-t border-white/[0.07] py-5 text-xs leading-6 text-white/40">
							History will appear when the blockchain record can be verified.
						</p>
					)}
					{verification.historyTruncated && (
						<p className="mt-4 text-[11px] text-white/35">
							Showing the latest 200 events. Older events remain available from
							Activity.
						</p>
					)}
				</section>
				<section aria-labelledby="item-details-heading" className="min-w-0">
					<h2
						id="item-details-heading"
						className="text-xl font-medium tracking-tight"
					>
						Object details
					</h2>
					<dl className="mt-5">
						{attributes.map((field) => (
							<div
								key={field.label}
								className="flex items-baseline justify-between gap-5 border-t border-white/[0.07] py-3"
							>
								<dt className="text-xs text-white/40">{field.label}</dt>
								<dd className="text-right text-xs text-white/75">
									{field.value}
								</dd>
							</div>
						))}
					</dl>
					<dl className="mt-4 grid grid-cols-2 gap-4 border-t border-white/[0.07] pt-4 text-[11px]">
						<div>
							<dt className="text-white/35">Registered</dt>
							<dd className="mt-2 text-white/65">
								{date(passport.issuedAt)} UTC
							</dd>
						</div>
						<div>
							<dt className="text-white/35">Passport</dt>
							<dd className="mt-2 font-mono text-white/65">
								#{passport.tokenId}
							</dd>
						</div>
					</dl>
				</section>
			</div>
			<details className="group/record mt-10 border-y border-white/[0.07]">
				<summary className="flex cursor-pointer list-none items-center justify-between gap-4 py-4 text-xs text-white/50 transition-colors hover:text-white/85 [&::-webkit-details-marker]:hidden">
					Passport &amp; technical details
					<svg
						aria-hidden="true"
						viewBox="0 0 16 16"
						fill="none"
						stroke="currentColor"
						strokeWidth="1.3"
						className="size-3.5 transition-transform group-open/record:rotate-180 motion-reduce:transition-none"
					>
						<path d="m4 6 4 4 4-4" />
					</svg>
				</summary>
				<dl>
					<Fact label="Item ID" value={passport.itemId} />
					<Fact label="Contract" value={passport.contractAddress} />
					<Fact
						label="Registration transaction"
						value={passport.transactionHash}
					/>
					<Fact label="Metadata reference" value={passport.metadataURI} />
					{verification.issuer && (
						<Fact label="Issuing wallet" value={verification.issuer} />
					)}
					<Fact
						label="Network"
						value={`Local development · Chain ${passport.chainId}`}
					/>
				</dl>
				<a
					href={`/api/passports/${passport.itemId}/metadata`}
					target="_blank"
					rel="noreferrer"
					className="my-4 inline-flex text-[11px] text-white/50 hover:text-white"
				>
					Open archived metadata ↗
				</a>
				<p className="pb-4 text-[11px] leading-5 text-white/30">
					The passport records a registered item and digital ownership. It does
					not prove physical possession or delivery. This contract version does
					not track authentication revocations.
				</p>
			</details>
		</article>
	);
}
