"use client";

import {
	itemSchemas,
	itemUniverseLabel,
	passportDisplayTitle,
} from "@0xhq/api-client/passport-item";
import { certifiers, type PublicPassport } from "@0xhq/api-client/types";
import Image from "next/image";
import { useSearchParams } from "next/navigation";
import { Suspense, startTransition } from "react";
import { PokedexSearchField } from "@/features/pokemon/pokedex-search";
import {
	CategoryNavigation,
	CategoryTabs,
} from "@/features/pokemon/pokemon-category-navigation";
import { FilterPanel } from "@/components/ui/filter-panel";
import { ExploreCard } from "@/features/reference/explore-card";
import { NavigationIcon } from "@/components/icons/navigation-icon";
import { PassportGridSkeleton } from "@/features/shell/loading-skeleton";
import {
	emptyPassportFilters,
	filterPassports,
	type PassportFilters,
} from "./passport-filters";

export function PassportBrowser({
	passports,
}: {
	passports: PublicPassport[];
}) {
	return (
		<Suspense fallback={<PassportGridSkeleton />}>
			<QueryPassportBrowser passports={passports} />
		</Suspense>
	);
}

function QueryPassportBrowser({ passports }: { passports: PublicPassport[] }) {
	const params = useSearchParams();
	const filters = Object.fromEntries(
		Object.keys(emptyPassportFilters).map((key) => [
			key,
			params.get(key) ?? "",
		]),
	) as PassportFilters;
	const filtered = filterPassports(passports, filters);
	const active = Object.values(filters).some(Boolean);
	function update(key: keyof PassportFilters, value: string) {
		const url = new URL(window.location.href);
		if (value) url.searchParams.set(key, value);
		else url.searchParams.delete(key);
		startTransition(() =>
			window.history.replaceState(
				null,
				"",
				url.pathname + url.search + url.hash,
			),
		);
	}
	function reset() {
		const url = new URL(window.location.href);
		for (const key of Object.keys(emptyPassportFilters))
			url.searchParams.delete(key);
		startTransition(() =>
			window.history.replaceState(
				null,
				"",
				url.pathname + url.search + url.hash,
			),
		);
	}
	const types = [
		...new Set([
			...itemSchemas.map((schema) => schema.type),
			...passports.map((passport) => passport.item.type),
		]),
	].map((type) => ({
		value: type,
		label: itemSchemas.find((schema) => schema.type === type)?.label ?? type,
	}));
	const universeArtwork: Record<string, string> = {
		pokemon: "/pika.png",
		"one-piece": "/onepiece.png",
		yugioh: "/yugioh.png",
	};
	const universes = [
		...new Set(passports.map((passport) => passport.item.universe)),
	]
		.sort((a, b) => itemUniverseLabel(a).localeCompare(itemUniverseLabel(b)))
		.map((universe) => ({
			value: universe,
			label: itemUniverseLabel(universe),
			icon: universeArtwork[universe] ? (
				<Image
					src={universeArtwork[universe]}
					alt=""
					width={36}
					height={36}
					className="size-9 object-contain"
				/>
			) : undefined,
		}));
	return (
		<div>
			<CategoryTabs
				search={
					<PokedexSearchField
						query={filters.q}
						setQuery={(value) => update("q", value)}
						label="Search passports"
					/>
				}
			>
				<CategoryNavigation
					label="Passport types"
					activeCategory={filters.type}
					onSelect={(value) => update("type", value)}
					categories={[{ value: "", label: "All" }, ...types].map((type) => {
						const query = new URLSearchParams(params.toString());
						if (type.value) query.set("type", type.value);
						else query.delete("type");
						return {
							id: type.value,
							name: type.label,
							icon:
								(
									{ card: "cards", box: "sealed", book: "books" } as Record<
										string,
										string
									>
								)[type.value] ?? "sets",
							href: `/passports${query.size ? `?${query}` : ""}`,
						};
					})}
				/>
			</CategoryTabs>
			<div className="pt-3">
				<FilterPanel
					resultCount={filtered.length}
					canReset={active}
					onReset={reset}
					filterLayout="inline"
					filters={[
						{
							label: "Sealed",
							value: filters.sealed,
							options: [
								{ value: "", label: "All" },
								{ value: "true", label: "Yes" },
								{ value: "false", label: "No" },
							],
							onChange: (value) => update("sealed", value),
						},
						{
							label: "Universe",
							variant: "visual",
							value: filters.universe,
							options: [{ value: "", label: "All" }, ...universes],
							onChange: (value) => update("universe", value),
						},
						{
							label: "Certifier",
							variant: "visual",
							value: filters.certifier,
							options: [
								{ value: "", label: "All" },
								...certifiers.map((certifier) => ({
									value: certifier.id,
									label: certifier.name,
									icon: (
										<Image
											src={
												certifier.id === "PSA"
													? "/images/certifiers/psa.png"
													: certifier.id === "CGC"
														? "/images/certifiers/cgc.svg"
														: "/images/certifiers/beckett.jpg"
											}
											alt=""
											width={64}
											height={48}
											className={
												certifier.id === "BGS"
													? "size-12 object-contain grayscale invert mix-blend-screen"
													: certifier.id === "CGC"
														? "h-auto w-14 object-contain invert"
														: "h-auto w-12 object-contain"
											}
										/>
									),
								})),
							],
							onChange: (value) => update("certifier", value),
						},
					]}
				/>
				{filtered.length ? (
					<ul className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-4 lg:grid-cols-6">
						{filtered.map((passport) => (
							<li key={passport.itemId}>
								<ExploreCard
									inlineMetadata
									unoptimized
									name={passportDisplayTitle(passport, "short")}
									nameTitle={passportDisplayTitle(passport)}
									brand={
										<span className="inline-flex items-center gap-2">
											<Image
												src={
													passport.certifier === "PSA"
														? "/images/certifiers/psa.png"
														: passport.certifier === "CGC"
															? "/images/certifiers/cgc.svg"
															: "/images/certifiers/beckett.jpg"
												}
												alt={passport.certifier}
												width={30}
												height={16}
												className={
													passport.certifier === "BGS"
														? "size-5 object-contain grayscale invert mix-blend-screen"
														: passport.certifier === "CGC"
															? "h-auto w-7 object-contain invert"
															: "h-auto w-7 object-contain"
												}
											/>
											{universeArtwork[passport.item.universe] && (
												<Image
													src={universeArtwork[passport.item.universe]}
													alt={itemUniverseLabel(passport.item.universe)}
													title={itemUniverseLabel(passport.item.universe)}
													width={20}
													height={20}
													className="size-5 object-contain"
												/>
											)}
										</span>
									}
									brandMono
									href={`/passports/${passport.itemId}`}
									image={
										passport.imageURI
											? `/api/passports/${passport.itemId}/image`
											: undefined
									}
									alt={passportDisplayTitle(passport)}
									imageLayout="portrait"
									placeholder={
										<NavigationIcon
											name="Passports"
											className="size-12 text-white/20"
										/>
									}
									sizes="(min-width:1024px) 16.67vw, (min-width:640px) 33vw, 50vw"
								/>
							</li>
						))}
					</ul>
				) : (
					<div className="mt-5 rounded-3xl bg-white/[0.025] px-6 py-16 text-center">
						<h2 className="text-xl">
							{passports.length
								? "No matching passports"
								: "No passports created yet"}
						</h2>
						<p className="mt-3 text-sm text-white/45">
							{passports.length
								? "Try changing your search or filters."
								: "Public passports appear here after inspection approval and confirmed creation."}
						</p>
						{active && (
							<button
								type="button"
								onClick={reset}
								className="mt-5 cursor-pointer rounded text-sm text-white/70 hover:text-white focus-visible:outline-2 focus-visible:outline-white"
							>
								Reset filters
							</button>
						)}
					</div>
				)}
			</div>
		</div>
	);
}
