import {
	itemUniverseLabel,
	itemTypeLabel,
	itemAttributeDetails,
	passportDisplayTitle,
} from "@0xhq/api-client/passport-item";
import type { AssetActivity } from "@0xhq/api-client/types";
import Image from "next/image";
import Link from "next/link";
import { NavigationIcon } from "@/components/icons/navigation-icon";
import {
	cardDetailGrid,
	cardArtworkFrame,
} from "@/features/shell/detail-layout";
import { ActivityBadge } from "./activity-badge";
import { EventSection, EventSections } from "./event-sections";
import { IdentifierCopy } from "./identifier-copy";

const eventTypes = {
	issued: {
		title: "Created",
		heading: "Initial ownership",
		from: "Created by",
		to: "Initial owner",
	},
	transfer: {
		title: "Transfer",
		heading: "Ownership change",
		from: "Previous owner",
		to: "New owner",
	},
	sale: {
		title: "Sale",
		heading: "Sale details",
		from: "Seller",
		to: "Buyer",
	},
	listing: {
		title: "Listing",
		heading: "Listing details",
		from: "Seller",
		to: "Recipient",
	},
};
function Fact({
	label,
	value,
	full = false,
}: {
	label: string;
	value: string;
	full?: boolean;
}) {
	return (
		<tr className="border-b border-white/[0.045] transition-colors duration-150 even:bg-white/[0.012] hover:bg-white/[0.035] focus-within:bg-white/[0.025] motion-reduce:transition-none">
			<th
				scope="row"
				className="w-32 px-4 py-2 text-left text-[11px] font-normal text-white/65"
			>
				{label}
			</th>
			<td className="px-3 py-2">
				<IdentifierCopy
					value={value}
					label={label.toLowerCase()}
					display={
						full || label === "Network" || label === "Universe"
							? value
							: undefined
					}
				/>
			</td>
		</tr>
	);
}
function Participant({
	label,
	address,
	issuer = false,
	receiving = false,
}: {
	label: string;
	address: string;
	issuer?: boolean;
	receiving?: boolean;
}) {
	return (
		<div className="relative grid min-w-0 grid-cols-[6.5rem_minmax(0,1fr)] items-start gap-x-3 py-4 pl-7 after:absolute after:left-[3.5px] after:top-7 after:bottom-[-28px] after:w-px after:bg-linear-to-b after:from-white/30 after:to-white last:after:hidden sm:grid-cols-[7.5rem_minmax(0,1fr)]">
			<dt
				className={`text-xs leading-6 ${receiving ? "text-white" : "text-white/40"}`}
			>
				<span
					aria-hidden="true"
					className={`absolute left-0 top-6 z-10 size-2 rounded-full ${receiving ? "bg-white" : "border border-white/35 bg-[var(--background)]"}`}
				/>
				{label}
			</dt>
			<dd
				className={`flex min-w-0 flex-wrap items-center gap-x-3 gap-y-1 [&>button]:-ml-1 [&>button]:min-h-6 ${receiving ? "[&>button]:text-white [&>button>svg]:text-white" : ""}`}
			>
				{issuer && (
					<span className="text-xs leading-6 text-white/45">TrueOrigin</span>
				)}
				<IdentifierCopy
					value={address}
					label={`${label.toLowerCase()} address`}
					display={
						address.length > 20
							? `${address.slice(0, 8)}…${address.slice(-6)}`
							: address
					}
				/>
			</dd>
		</div>
	);
}
export function ActivityDetail({ event }: { event: AssetActivity }) {
	const details = eventTypes[event.kind];
	const title = event.passport
		? passportDisplayTitle(event.passport)
		: `Passport #${event.tokenId}`;
	const universe =
		event.universe ??
		(event.passport
			? itemUniverseLabel(event.passport.item.universe)
			: "Object");
	const timestamp = new Date(event.timestamp);
	const day = new Intl.DateTimeFormat("en-GB", {
		day: "numeric",
		month: "long",
		year: "numeric",
		timeZone: "UTC",
	}).format(timestamp);
	const time = new Intl.DateTimeFormat("en-GB", {
		hour: "2-digit",
		minute: "2-digit",
		second: "2-digit",
		hour12: false,
		timeZone: "UTC",
	}).format(timestamp);
	return (
		<article aria-labelledby="event-title" className="pb-8">
			<div className={cardDetailGrid}>
				<figure
					aria-label={title}
					className="min-w-0 lg:sticky lg:top-[calc(var(--app-header-height)+1.5rem)]"
				>
					<Link
						href={`/passports/${event.itemId}`}
						aria-label={`View ${title} passport`}
						className={`${cardArtworkFrame} focus-visible:outline-2 focus-visible:outline-white`}
					>
						{event.passport?.imageURI ? (
							<Image
								unoptimized
								src={`/api/passports/${event.itemId}/image`}
								alt={title}
								fill
								sizes="(min-width:1024px) 40vw, 90vw"
								className="object-contain"
							/>
						) : (
							<NavigationIcon
								name="Passports"
								className="size-16 text-white/20"
							/>
						)}
					</Link>
				</figure>
				<div className="min-w-0">
					<header>
						<div className="flex items-start justify-between gap-4">
							<h1
								id="event-title"
								className="min-w-0 break-words font-serif text-[clamp(56px,7vw,112px)] font-normal leading-[0.95] tracking-[-0.055em] text-white"
							>
								{details.title}
							</h1>
							{universe === "Pokémon" && (
								<Image
									src="/pika.png"
									alt="Pokémon"
									width={96}
									height={96}
									className="size-16 shrink-0 object-contain sm:size-24"
								/>
							)}
						</div>

						<div className="mt-6 flex flex-wrap items-center gap-x-5 gap-y-3 border-b border-white/[0.08] pb-6">
							<div className="flex items-center gap-3">
								<ActivityBadge kind={event.kind} />
							</div>
							<time
								dateTime={event.timestamp}
								className="text-xs tabular-nums text-white/55"
							>
								{day}
								<span className="mx-2 text-white/15">·</span>
								<span className="text-white/35">{time} UTC</span>
							</time>
							<div className="flex items-center gap-3">
								<IdentifierCopy value={event.id} label="event ID" />
								<Link
									href={`/passports/${event.itemId}`}
									className="inline-flex h-[26px] shrink-0 items-center gap-2 rounded-md bg-zinc-400/[0.03] bg-linear-to-b from-white/[0.008] to-transparent px-3 text-xs text-white/80 transition-colors hover:bg-white/[0.18] hover:text-white focus-visible:outline-2 focus-visible:outline-white"
								>
									View passport
									<svg
										aria-hidden="true"
										viewBox="0 0 16 16"
										fill="none"
										stroke="currentColor"
										strokeWidth="1.3"
										strokeLinecap="round"
										strokeLinejoin="round"
										className="size-3"
									>
										<path d="m4 12 8-8M4 4h8v8" />
									</svg>
								</Link>
							</div>
						</div>
					</header>
					<EventSections>
						<EventSection title="Object" value="object">
							<table className="w-full border-collapse border-t border-white/[0.08]">
								<caption className="sr-only">Object details</caption>
								<tbody>
									<tr className="border-b border-white/[0.045] transition-colors duration-150 even:bg-white/[0.012] hover:bg-white/[0.035] motion-reduce:transition-none">
										<th
											scope="row"
											className="w-32 px-4 py-2 text-left text-[11px] font-normal text-white/65"
										>
											Name
										</th>
										<td className="px-4 py-3 text-xs leading-5 text-white/85">
											{event.passport
												? passportDisplayTitle(event.passport, "short")
												: title}
										</td>
									</tr>
									<tr className="border-b border-white/[0.045] transition-colors duration-150 even:bg-white/[0.012] hover:bg-white/[0.035] motion-reduce:transition-none">
										<th
											scope="row"
											className="w-32 px-4 py-2 text-left text-[11px] font-normal text-white/65"
										>
											Universe
										</th>
										<td className="px-4 py-2">
											<span className="flex items-center gap-2 text-[11px] text-white/65">
												{universe === "Pokémon" && (
													<Image
														src="/pika.png"
														alt=""
														width={20}
														height={20}
														className="size-5 object-contain"
													/>
												)}
												{universe}
											</span>
										</td>
									</tr>
									{event.passport && (
										<>
											<Fact
												label="Type"
												value={itemTypeLabel(event.passport.item)}
												full
											/>
											{itemAttributeDetails(event.passport.item)
												.filter(
													(field) =>
														!["Subject", "Title", "Name"].includes(field.label),
												)
												.map((field) => (
													<Fact
														key={field.label}
														label={field.label}
														value={field.value}
														full
													/>
												))}
											<tr className="border-b border-white/[0.045] transition-colors duration-150 even:bg-white/[0.012] hover:bg-white/[0.035] motion-reduce:transition-none">
												<th
													scope="row"
													className="w-32 px-4 py-2 text-left text-[11px] font-normal text-white/65"
												>
													Certifier
												</th>
												<td className="px-4 py-3">
													{event.passport.certifier === "PSA" ? (
														<Image
															src="/images/certifiers/psa.png"
															alt="PSA"
															width={33}
															height={11}
															className="h-auto w-8 object-contain"
														/>
													) : (
														<span className="text-[11px] text-white/65">
															{event.passport.certifier}
														</span>
													)}
												</td>
											</tr>
											<Fact
												label="Certification ID"
												value={event.passport.certificationNumber}
											/>
											{event.passport.grade && (
												<Fact
													label="Grade"
													value={String(event.passport.grade)}
												/>
											)}
										</>
									)}
								</tbody>
							</table>
						</EventSection>
						<EventSection title="Event" value="event">
							<div>
								<h3 className="sr-only">{details.heading}</h3>
								<dl>
									<Participant
										label={details.from}
										address={
											event.kind === "issued"
												? event.contractAddress
												: event.from
										}
										issuer={event.kind === "issued"}
									/>
									{event.kind !== "listing" && (
										<Participant
											label={details.to}
											address={event.to}
											receiving
										/>
									)}
								</dl>
							</div>
						</EventSection>
						<EventSection title="Details" value="details">
							<table className="w-full border-collapse">
								<caption className="sr-only">Technical details</caption>
								<tbody>
									<Fact
										label="Network"
										value={`Local development · ${event.chainId}`}
									/>
									<Fact label="Passport" value={`#${event.tokenId}`} />
									<Fact label="Transaction" value={event.transactionHash} />
									<Fact label="Passport ID" value={event.itemId} />
									<Fact label="Contract" value={event.contractAddress} />
									<Fact label="Block" value={event.blockNumber} />
									<Fact label="Log index" value={String(event.logIndex)} />
								</tbody>
							</table>
						</EventSection>
					</EventSections>
				</div>
			</div>
		</article>
	);
}
