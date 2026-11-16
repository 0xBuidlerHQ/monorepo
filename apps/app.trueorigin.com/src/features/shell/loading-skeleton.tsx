import type { ReactNode } from "react";

type CatalogVariant = "cards" | "sets" | "pokedex" | "sealed" | "checklist";
const twelve = Array.from({ length: 12 }, (_, index) => index);

function Block({ className = "" }: { className?: string }) {
	return <div className={`rounded bg-white/5 ${className}`} />;
}

function Skeleton({ name, children, className = "" }: { name: string; children: ReactNode; className?: string }) {
	return <div role="status" aria-busy="true" aria-label={`Loading ${name}`} data-skeleton={name} className={className}><span className="sr-only">Loading {name}</span><div aria-hidden="true">{children}</div></div>;
}

export function CatalogSkeleton({ variant = "cards" }: { toolbar?: boolean; variant?: CatalogVariant }) {
	if (variant === "sealed") return null;
	const square = variant === "sets" || variant === "pokedex";
	return <Skeleton name={variant} className="w-full">
		
		
		{<div className={`grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-4 ${square ? "lg:grid-cols-6" : "lg:grid-cols-5"}`}>
				{twelve.slice(0, square ? 12 : 10).map((tile) => <div key={tile} className={`bg-[#1c1c1c] ${square ? "rounded-[28px] p-5" : "rounded-2xl p-3"}`}>
					<div className={`relative flex items-center justify-center ${square ? "mt-5 aspect-square" : "aspect-[600/825] rounded-lg bg-white/[0.025]"}`}>{variant === "pokedex" ? <Block className="size-3/5 rounded-full bg-white/[0.025]" /> : variant === "sets" ? <Block className="h-1/3 w-4/5 rounded-xl bg-white/[0.025]" /> : null}</div>
					<div className={`pt-4 ${square ? "" : "px-2 pb-2"}`}>{variant !== "pokedex" && <Block className="h-3 w-16" />}<Block className="mt-2 h-5 w-3/4" />{variant === "pokedex" ? <Block className="ml-auto mt-2 h-3 w-10" /> : <Block className="mt-3 h-3 w-1/2" />}</div>
				</div>)}
			</div>}
	</Skeleton>;
}

// Detail loading states reserve only the artwork, never imitate page headings or controls.
export function PageSkeleton({ variant = "catalog" }: { variant?: "catalog" | "cards" | "sets" | "pokedex" | "card" | "set" | "pokemon" }) {
 if (variant === "card" || variant === "pokemon") return <Skeleton name={variant}><div className="aspect-[600/825] w-full max-w-[360px] rounded-[28px] bg-white/[0.025]" /></Skeleton>;
 if (variant === "set") return <CatalogSkeleton variant="checklist" />;
 return <CatalogSkeleton variant={variant === "catalog" ? "cards" : variant} />;
}
export function PassportSkeleton() {
 return <Skeleton name="item"><div className="aspect-square w-full max-w-md rounded-[28px] bg-white/[0.025]" /></Skeleton>;
}
