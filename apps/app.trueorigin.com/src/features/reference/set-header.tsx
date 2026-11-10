import { RevealImage as Image } from "@/components/ui/reveal-image";
import { CatalogCategoryIcon } from "@/components/icons/catalog-category-icon";

export function SetHeader({ name, logo, facts }: { name: string; logo?: string; facts: { label: string; value: string }[] }) {
	return (
		<header className="relative isolate mt-6 overflow-hidden rounded-[28px] bg-[#1c1c1c]">
			<div className="relative grid md:grid-cols-[1.1fr_1fr]">
				<div className="flex flex-col items-start justify-center px-7 py-9 sm:px-10 sm:py-12 lg:px-12">
					<h1 id="set-title" className={`${name.length > 14 ? "text-[clamp(40px,6vw,80px)]" : "text-[clamp(64px,8vw,112px)]"} font-medium leading-[0.95] tracking-[-0.075em]`}>{name}</h1>
					<a href="#checklist" className="mt-7 inline-flex items-center gap-7 rounded-full bg-white px-5 py-3 text-sm font-medium text-black transition-colors hover:bg-white/85 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white">Browse cards <svg aria-hidden="true" viewBox="0 0 20 20" fill="none" className="size-4"><path d="M10 3v14m-5-5 5 5 5-5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" /></svg></a>
				</div>
				<div className="relative mx-7 mb-7 flex min-h-40 items-center justify-center overflow-hidden sm:mx-10 md:m-6 md:min-h-64 lg:m-8">
					<div aria-hidden="true" className="absolute size-64 rounded-full border border-[#d8be80]/[0.06] lg:size-80" />
					<div aria-hidden="true" className="absolute size-48 rounded-full border border-[#d8be80]/[0.06] lg:size-60" />
					{logo ? <Image src={logo} alt={`${name} logo`} fill preload sizes="(min-width: 768px) 42vw, 85vw" className="object-contain p-4 drop-shadow-[0_12px_24px_#00000040] sm:p-6" /> : <span className="text-white/10 [&>svg]:size-32"><CatalogCategoryIcon category="sets" /></span>}
				</div>
			</div>
			<dl className="relative grid grid-cols-1 gap-6 border-t border-white/[0.07] px-7 py-7 sm:grid-cols-3 sm:px-10 lg:px-12">
				{facts.map((fact) => <div key={fact.label}><dt className="text-xs text-white/40">{fact.label}</dt><dd className="mt-2 text-xl font-medium tracking-[-0.035em] text-white sm:text-2xl">{fact.value}</dd></div>)}
			</dl>
		</header>
	);
}
