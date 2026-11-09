import type { ReactNode } from "react";

type CatalogVariant = "cards" | "sets" | "pokedex" | "sealed" | "checklist";
const twelve = Array.from({ length: 12 }, (_, index) => index);

function Block({ className = "" }: { className?: string }) {
	return <div className={`rounded bg-white/5 ${className}`} />;
}

function Skeleton({ name, children, className = "" }: { name: string; children: ReactNode; className?: string }) {
	return <div role="status" aria-busy="true" aria-label={`Loading ${name}`} data-skeleton={name} className={className}><span className="sr-only">Loading {name}</span><div aria-hidden="true">{children}</div></div>;
}

function SearchShape() {
	return <div className="h-11 w-full rounded-2xl bg-black/20 sm:w-80" />;
}

function Toolbar({ variant }: { variant: CatalogVariant }) {
	return <div className="mb-6 rounded-[28px] bg-gradient-to-br from-[#202020] to-[#191919] p-5 sm:p-6">
		<div className="flex flex-wrap items-center justify-between gap-5"><div className="flex items-center gap-3">{variant !== "checklist" && <Block className="size-10 rounded-2xl" />}<Block className="h-7 w-28" /><Block className="h-5 w-9" /></div>{variant === "checklist" ? <Block className="h-4 w-24" /> : <SearchShape />}</div>
		{variant === "checklist" ? <><div className="mt-5 h-11 rounded-xl bg-black/20" /><div className="mt-4 flex flex-wrap items-center justify-between gap-5"><div><Block className="mb-2 h-3 w-14" /><div className="flex gap-2">{[0, 1, 2, 3].map((key) => <Block key={key} className="size-11 rounded-xl" />)}</div></div><div><Block className="mb-2 ml-auto h-3 w-10" /><div className="flex flex-wrap justify-end gap-2">{[0, 1, 2, 3].map((key) => <Block key={key} className="h-11 w-20 rounded-full" />)}</div></div></div></>
			: (variant === "cards" || variant === "pokedex" || variant === "sealed") && <div className="mt-5 flex gap-2 overflow-hidden rounded-2xl bg-black/15 p-1.5">{twelve.slice(0, variant === "pokedex" ? 10 : 5).map((key) => <Block key={key} className={`h-10 shrink-0 rounded-xl ${key === 0 ? "w-28" : "w-20"}`} />)}</div>}
	</div>;
}

export function CatalogSkeleton({ toolbar = true, variant = "cards" }: { toolbar?: boolean; variant?: CatalogVariant }) {
	const square = variant === "sets" || variant === "pokedex";
	return <Skeleton name={variant} className="w-full">
		{toolbar && <Toolbar variant={variant} />}
		{variant === "pokedex" ? <div className="mb-4 mt-8 flex items-center gap-4"><Block className="h-4 w-28" /><div className="h-px flex-1 bg-white/10" /><Block className="h-3 w-20" /></div> : <Block className="mb-6 h-4 w-64 max-w-full" />}
		{variant === "sealed" ? <div className="flex min-h-72 flex-col items-center justify-center gap-4 rounded-[28px] bg-[#1c1c1c] p-8"><Block className="size-14 rounded-2xl" /><Block className="h-6 w-56 max-w-full" /><Block className="h-4 w-72 max-w-full" /><Block className="h-4 w-48" /></div>
			: <div className={`grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-4 ${square ? "lg:grid-cols-6" : "lg:grid-cols-5"}`}>
				{twelve.slice(0, square ? 12 : 10).map((tile) => <div key={tile} className={`bg-[#1c1c1c] ${square ? "rounded-[28px] p-5" : "rounded-2xl p-3"}`}>
					<div className={`relative flex items-center justify-center ${square ? "mt-5 aspect-square" : "aspect-[600/825] rounded-lg bg-white/[0.025]"}`}>{variant === "pokedex" ? <Block className="size-3/5 rounded-full bg-white/[0.025]" /> : variant === "sets" ? <Block className="h-1/3 w-4/5 rounded-xl bg-white/[0.025]" /> : null}</div>
					<div className={`pt-4 ${square ? "" : "px-2 pb-2"}`}>{variant !== "pokedex" && <Block className="h-3 w-16" />}<Block className="mt-2 h-5 w-3/4" />{variant === "pokedex" ? <Block className="ml-auto mt-2 h-3 w-10" /> : <Block className="mt-3 h-3 w-1/2" />}</div>
				</div>)}
			</div>}
	</Skeleton>;
}

function Facts({ count }: { count: number }) {
	return <div className={`grid gap-6 py-7 ${count === 3 ? "sm:grid-cols-3" : "grid-cols-2 sm:grid-cols-4"}`}>{twelve.slice(0, count).map((key) => <div key={key}><Block className="h-3 w-16" /><Block className="mt-3 h-6 w-28 max-w-full" /></div>)}</div>;
}

export function PageSkeleton({ variant = "catalog" }: { variant?: "catalog" | "cards" | "sets" | "pokedex" | "card" | "set" | "pokemon" }) {
	return <Skeleton name={variant} >
		<Block className="mb-6 h-4 w-56 max-w-full" />
		{variant === "card" ? <><div className="mt-8 grid items-start gap-8 lg:grid-cols-[minmax(0,0.85fr)_minmax(0,1fr)] lg:gap-14 xl:gap-20"><div className="rounded-[28px] bg-[#1c1c1c] p-10"><div className="mx-auto aspect-[600/825] w-full max-w-[360px] rounded-xl bg-white/[0.025]" /></div><div className="py-2"><Block className="h-4 w-24" /><Block className="mt-6 h-3 w-40" /><Block className="mt-5 h-20 w-3/4 rounded-xl" /><div className="mt-5 flex gap-2">{[0, 1, 2].map((key) => <Block key={key} className="h-7 w-20 rounded-full" />)}</div><Block className="my-8 h-22 rounded-2xl" /><div className="grid grid-cols-2 gap-x-6">{twelve.map((key) => <div key={key} className="border-b border-white/5 py-3.5"><Block className="h-3 w-16" /><Block className="mt-2 h-4 w-24" /></div>)}</div></div></div><Block className="mt-12 h-60 w-full rounded-[28px]" /></>
			: variant === "set" ? <><div className="mt-6 overflow-hidden rounded-[28px] bg-[#1c1c1c]"><div className="grid md:grid-cols-[1.1fr_1fr]"><div className="px-7 py-9 sm:px-10 sm:py-12 lg:px-12"><Block className="h-24 w-4/5 rounded-xl" /><Block className="mt-7 h-11 w-40 rounded-full" /></div><div className="mx-7 mb-7 flex min-h-40 items-center justify-center md:m-6 md:min-h-64"><Block className="h-28 w-3/4 rounded-2xl bg-white/[0.025]" /></div></div><div className="border-t border-white/[0.07] px-7 sm:px-10 lg:px-12"><Facts count={3} /></div></div><div className="mt-8"><CatalogSkeleton variant="checklist" /></div></>
			: variant === "pokemon" ? <><div className="mt-6 grid overflow-hidden rounded-[32px] bg-[#1c1c1c] md:grid-cols-2"><div className="p-7 sm:p-10 lg:p-12"><Block className="h-3 w-40" /><Block className="mt-6 h-20 w-4/5 rounded-xl" /><Block className="mt-3 h-4 w-32" /><div className="mt-5 flex gap-2"><Block className="h-7 w-20 rounded-full" /><Block className="h-7 w-20 rounded-full" /></div><Block className="mt-6 h-20 w-full" /><Block className="mt-8 h-11 w-40 rounded-full" /></div><div className="m-6 flex aspect-square items-center justify-center lg:m-8"><Block className="size-3/5 rounded-full bg-white/[0.025]" /></div></div><div className="my-8 rounded-3xl bg-white/[0.025] px-6"><Facts count={4} /></div><Block className="mb-10 h-48 rounded-3xl" /><CatalogSkeleton toolbar={false} /></>
			: <><Block className="mb-8 h-16 w-2/5 rounded-xl" /><CatalogSkeleton variant={variant === "catalog" ? "cards" : variant} /></>}
	</Skeleton>;
}

export function PassportSkeleton() {
	return <Skeleton name="digital passport" className="bg-[#080808]"><div className="border-b border-white/10 px-5 py-7 sm:px-9"><Block className="mb-5 h-3 w-64" /><Block className="mb-5 h-12" /><div className="flex items-center justify-between gap-4"><div className="flex-1"><Block className="h-12 w-3/4" /><Block className="mt-3 h-4 w-1/2" /></div><Block className="size-24" /></div></div><div className="space-y-6 p-5 sm:p-9"><div className="grid gap-6 lg:grid-cols-2"><Block className="min-h-72 rounded-none bg-white/[0.025]" /><div className="border border-white/10 p-5"><Block className="h-3 w-32" /><Block className="mt-5 h-9 w-48" /><Block className="mt-3 h-12" /><Facts count={4} /></div></div>{[0, 1, 2].map((key) => <div key={key} className="border border-white/10 p-5"><Block className="h-3 w-40" /><Block className="mt-7 h-4 w-56" /><Block className="mt-3 h-3 w-3/4" /></div>)}</div></Skeleton>;
}
