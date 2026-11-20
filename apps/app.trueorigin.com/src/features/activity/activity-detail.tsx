import { parseActivityId } from "@0xhq/api-client/activity";
import { passportDisplayTitle } from "@0xhq/api-client/passport-item";
import type { AssetActivity } from "@0xhq/api-client/types";
import Image from "next/image";
import Link from "next/link";
import { CopyValue } from "@/features/passports/controls";
import { PageHeader } from "@/features/shell/page-header";
import { ActivityBadge } from "./activity-badge";

const descriptions = {
	issued: {
		title: "Registration",
		description:
			"A digital passport was issued for this object and assigned to its initial owner.",
		from: "Issuing contract",
		to: "Initial owner",
	},
	transfer: {
		title: "Transfer",
		description: "Ownership of this object's digital passport changed wallets.",
		from: "Previous owner",
		to: "New owner",
	},
	sale: {
		title: "Sale",
		description: "A sale was recorded for this object.",
		from: "Seller",
		to: "Buyer",
	},
	listing: {
		title: "Listing",
		description: "This object was listed for sale.",
		from: "Seller",
		to: "Recipient",
	},
};
function Fact({ label, value }: { label: string; value: string }) {
	return (
		<div className="flex min-w-0 flex-col gap-2 border-t border-white/[0.07] py-4">
			<dt className="text-[11px] text-white/40">{label}</dt>
			<dd className="flex min-w-0 items-center justify-between gap-3">
				<span className="break-all font-mono text-xs leading-6 text-white/75">
					{value}
				</span>
				<CopyValue value={value} label={label.toLowerCase()} />
			</dd>
		</div>
	);
}
export function ActivityDetail({ event }: { event: AssetActivity }) {
	const details = descriptions[event.kind];
	const title = event.passport
		? passportDisplayTitle(event.passport)
		: `Passport #${event.tokenId}`;
	const timestamp = new Date(event.timestamp)
		.toISOString()
		.replace("T", " ")
		.replace(/\.\d{3}Z$/, " UTC");
	return (
		<article aria-labelledby="event-title">
			<PageHeader
				title={details.title}
				titleId="event-title"
				adornment={<ActivityBadge kind={event.kind} />}
			/>
			<p className="mt-5 max-w-xl text-sm leading-6 text-white/45">
				{details.description}
			</p>
			<div className="mt-10 grid gap-10 lg:grid-cols-[minmax(0,1.2fr)_minmax(0,1fr)] lg:gap-16">
				<section aria-labelledby="event-object-title">
					<h2
						id="event-object-title"
						className="mb-4 text-[11px] font-medium uppercase tracking-widest text-white/40"
					>
						Object
					</h2>
					<Link
						href={`/registry/${event.itemId}`}
						className="group flex items-center gap-5 rounded-xl border border-white/10 bg-white/[0.025] p-5 transition-colors hover:bg-white/[0.05]"
					>
						{event.passport?.imageURI && (
							<Image
								unoptimized
								src={`/api/passports/${event.itemId}/image`}
								alt=""
								width={64}
								height={80}
								className="h-20 w-16 shrink-0 object-contain"
							/>
						)}
						<div className="min-w-0">
							<p className="text-lg font-medium tracking-tight text-white/90">
								{title}
							</p>
							<p className="mt-2 text-xs text-white/40">
								{event.category ?? event.passport?.item.category ?? "Object"} ·
								Passport #{event.tokenId}
							</p>
						</div>
						<span
							aria-hidden="true"
							className="ml-auto text-white/40 transition-transform group-hover:translate-x-1 motion-reduce:transform-none"
						>
							→
						</span>
					</Link>
					<dl className="mt-6">
						<Fact label="Item ID" value={event.itemId} />
						<Fact
							label={details.from}
							value={
								event.kind === "issued" ? event.contractAddress : event.from
							}
						/>
						{event.kind !== "listing" && (
							<Fact label={details.to} value={event.to} />
						)}
						{event.kind === "issued" && event.passport && (
							<>
								<Fact label="Certifier" value={event.passport.certifier} />
								<Fact
									label="Certification ID"
									value={event.passport.certificationNumber}
								/>
								{event.passport.grade && (
									<Fact
										label="Grade at registration"
										value={event.passport.grade}
									/>
								)}
							</>
						)}
					</dl>
				</section>
				<section aria-labelledby="event-record-title">
					<h2
						id="event-record-title"
						className="mb-4 text-[11px] font-medium uppercase tracking-widest text-white/40"
					>
						Event record
					</h2>
					<dl>
						<div className="pb-4">
							<dt className="text-[11px] text-white/40">Timestamp</dt>
							<dd className="mt-2 text-sm tabular-nums text-white/80">
								<time dateTime={event.timestamp}>{timestamp}</time>
							</dd>
						</div>
						<Fact label="Transaction hash" value={event.transactionHash} />
						<Fact label="Block" value={event.blockNumber} />
						<Fact label="Log index" value={String(event.logIndex)} />
						<Fact label="Contract" value={event.contractAddress} />
						<Fact label="Event ID" value={event.id} />
						<div className="border-t border-white/[0.07] py-4">
							<dt className="text-[11px] text-white/40">Network</dt>
							<dd className="mt-2 text-xs text-white/65">
								Local development · Chain {parseActivityId(event.id)?.chainId}
							</dd>
						</div>
					</dl>
				</section>
			</div>
		</article>
	);
}
