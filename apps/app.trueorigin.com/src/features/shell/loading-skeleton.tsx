import type { ReactNode } from "react";
import {
	cardArtworkFrame,
	cardDetailGrid,
	passportDetailGrid,
	pokemonProfileGrid,
} from "./detail-layout";

type CatalogVariant = "cards" | "sets" | "pokedex" | "sealed" | "checklist";
export function SkeletonBlock({ className = "" }: { className?: string }) {
	return <div className={`rounded bg-white/[0.05] ${className}`} />;
}
function Skeleton({
	name,
	children,
	className = "",
}: {
	name: string;
	children: ReactNode;
	className?: string;
}) {
	return (
		<div
			role="status"
			aria-busy="true"
			aria-label={`Loading ${name}`}
			data-skeleton={name}
			className={className}
		>
			<span className="sr-only">Loading {name}</span>
			<div aria-hidden="true">{children}</div>
		</div>
	);
}
export function CatalogSkeleton({
	variant = "cards",
	count,
}: {
	toolbar?: boolean;
	variant?: CatalogVariant;
	count?: number;
}) {
	if (variant === "sealed") return null;
	const square = variant === "sets" || variant === "pokedex";
	const compact = variant === "checklist";
	return (
		<Skeleton name={variant} className="w-full">
			<div
				className={`grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-4 ${square ? "lg:grid-cols-6" : "lg:grid-cols-5"}`}
			>
				{Array.from(
					{ length: count ?? (square ? 12 : 10) },
					(_, index) => `tile-${index}`,
				).map((key) => (
					<div
						key={key}
						className={`bg-[var(--surface)] ${square ? "rounded-[28px] p-5" : compact ? "rounded-[14px] p-1.5" : "rounded-2xl p-3"}`}
					>
						<div
							className={
								square
									? "mt-5 aspect-square"
									: "aspect-[600/825] rounded-[9px] bg-white/[0.025]"
							}
						/>
						{compact ? (
							<div className="mt-1.5 flex min-h-9 items-center gap-1.5 px-1.5">
								<SkeletonBlock className="h-3.5 w-1/2" />
								<SkeletonBlock className="size-[18px] rounded-full" />
								<SkeletonBlock className="size-3" />
								<SkeletonBlock className="ml-auto h-2.5 w-8" />
							</div>
						) : (
							<div
								className={`flex items-end justify-between gap-3 pt-4 ${square ? "" : "px-2 pb-2"}`}
							>
								<div className="flex-1">
									{variant !== "pokedex" && (
										<SkeletonBlock className="h-3 w-16" />
									)}
									<SkeletonBlock className="mt-1 h-6 w-3/4" />
									{variant !== "pokedex" && (
										<SkeletonBlock className="mt-2 h-5 w-1/2" />
									)}
								</div>
								{variant === "pokedex" && (
									<SkeletonBlock className="h-3 w-10" />
								)}
							</div>
						)}
					</div>
				))}
			</div>
		</Skeleton>
	);
}
function DetailFacts({ count = 4 }: { count?: number }) {
	return (
		<div className="flex flex-wrap gap-3">
			{Array.from({ length: count }, (_, index) => `fact-${index}`).map(
				(key) => (
					<SkeletonBlock key={key} className="h-4 w-20" />
				),
			)}
		</div>
	);
}
export function PageSkeleton({
	variant = "catalog",
}: {
	variant?:
		| "catalog"
		| "cards"
		| "sets"
		| "pokedex"
		| "card"
		| "set"
		| "pokemon";
}) {
	if (variant === "card")
		return (
			<Skeleton name="card">
				<div className={cardDetailGrid}>
					<div className={`${cardArtworkFrame} rounded-xl bg-white/[0.025]`} />
					<div className="min-w-0 lg:py-3">
						<SkeletonBlock className="h-[clamp(56px,7vw,112px)] w-3/4" />
						<div className="mt-6 flex gap-5">
							<SkeletonBlock className="h-8 w-20" />
							<SkeletonBlock className="h-8 w-24" />
						</div>
						<div className="mt-8">
							<DetailFacts />
						</div>
						<div className="mt-7 border-t border-white/[0.08] pt-6">
							<SkeletonBlock className="mb-5 h-4 w-20" />
							<div className="grid grid-cols-3 gap-2">
								{[0, 1, 2].map((index) => (
									<SkeletonBlock
										key={index}
										className="aspect-[600/825] rounded-xl"
									/>
								))}
							</div>
						</div>
					</div>
				</div>
			</Skeleton>
		);
	if (variant === "pokemon")
		return (
			<Skeleton name="pokemon">
				<div className={pokemonProfileGrid}>
					<div className="flex flex-col justify-center p-7 sm:p-10 lg:p-12">
						<SkeletonBlock className="h-4 w-36" />
						<SkeletonBlock className="mt-6 h-[clamp(40px,6vw,88px)] w-3/4" />
						<SkeletonBlock className="mt-3 h-5 w-32" />
						<div className="mt-5">
							<DetailFacts count={2} />
						</div>
						<SkeletonBlock className="mt-6 h-20 w-full" />
						<div className="mt-8">
							<DetailFacts count={2} />
						</div>
					</div>
					<div className="relative mx-6 mb-6 aspect-square md:m-6 lg:m-8" />
				</div>
			</Skeleton>
		);
	if (variant === "set")
		return (
			<Skeleton name="set">
				<SkeletonBlock className="h-[clamp(48px,9vw,120px)] w-1/2" />
				<div className="mt-9 flex h-10 items-center justify-between">
					<DetailFacts />
					<SkeletonBlock className="h-10 w-80 rounded-2xl" />
				</div>
				<div className="mt-6">
					<SkeletonBlock className="mb-5 h-40 w-full rounded-2xl" />
					<CatalogSkeleton variant="checklist" />
				</div>
			</Skeleton>
		);
	return (
		<CatalogSkeleton variant={variant === "catalog" ? "cards" : variant} />
	);
}
export function PassportSkeleton() {
	return (
		<Skeleton name="passport">
			<div className="pb-4 pt-3">
				<div className={passportDetailGrid}>
					<div className="mx-auto aspect-[4/5] w-full max-w-lg rounded-[28px] bg-[var(--surface)]" />
					<div className="py-1">
						<SkeletonBlock className="mb-5 h-7 w-48 rounded-full" />
						<SkeletonBlock className="h-[clamp(36px,5vw,68px)] w-3/4" />
						<SkeletonBlock className="mt-4 h-5 w-48" />
						<div className="mt-7 border-t border-white/10 pt-6">
							<DetailFacts count={3} />
						</div>
					</div>
				</div>
			</div>
		</Skeleton>
	);
}
export function PassportGridSkeleton({
	collection = false,
}: {
	collection?: boolean;
}) {
	return (
		<Skeleton name={collection ? "your collection" : "passports"}>
			<div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
				{[0, 1, 2, 3].map((index) => (
					<div key={index} className="rounded-[28px] bg-[var(--surface)] p-4">
						<div className="aspect-[4/5] rounded-2xl bg-white/[0.025]" />
						<div className="px-1 pb-2 pt-5">
							<SkeletonBlock className="h-3 w-28" />
							<SkeletonBlock className="mt-2 h-7 w-3/4" />
							<SkeletonBlock className="mt-2 h-4 w-4/5" />
							{collection && <SkeletonBlock className="mt-3 h-3 w-full" />}
							<SkeletonBlock className="mt-4 h-4 w-24" />
						</div>
					</div>
				))}
			</div>
		</Skeleton>
	);
}
export function LoadingStatus({ children }: { children: ReactNode }) {
	return (
		<p role="status" aria-live="polite" className="text-sm text-white/40">
			{children}
		</p>
	);
}
