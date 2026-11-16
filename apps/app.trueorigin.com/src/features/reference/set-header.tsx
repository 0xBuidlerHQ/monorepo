import { FloatingTypeSymbols } from "@/features/pokemon/floating-type-symbols";
import { SetCardSearch } from "@/features/pokemon/set-card-search";
import { RevealImage as Image } from "@/components/ui/reveal-image";
import { PageHeader } from "@/features/shell/page-header";

export function SetHeader({ name, logo, releaseDate, series, language, cardCount }: { name: string; logo?: string; releaseDate?: string | null; series?: string; language?: string; cardCount?: number }) {
 const date = releaseDate ? new Date(`${releaseDate.replaceAll("/", "-")}T00:00:00Z`) : null;
 const formattedDate = date && !Number.isNaN(date.getTime()) ? new Intl.DateTimeFormat("en-US", { month: "long", day: "numeric", year: "numeric", timeZone: "UTC" }).format(date) : releaseDate;
 const details = [formattedDate, series, cardCount !== undefined ? `${cardCount} cards` : null, language].filter((value): value is string => Boolean(value));
 return <div>
  <div className="relative isolate [&_#set-title]:font-serif">
   <PageHeader title={name} titleId="set-title" adornment={<FloatingTypeSymbols />} actions={logo ? <div className="relative h-10 w-20 sm:h-14 sm:w-28"><Image src={logo} alt={`${name} logo`} fill preload sizes="112px" className="object-contain" /></div> : undefined} />
  </div>
  <div className="mt-9 flex flex-wrap items-center justify-between gap-4 pb-3">
   {details.length > 0 && <p className="flex flex-wrap items-center gap-x-3 gap-y-2 text-sm text-white/45">{details.map((detail, index) => <span key={detail} className="inline-flex items-center gap-3">{index > 0 && <span aria-hidden="true" className="text-white/20">·</span>}{detail}</span>)}</p>}
   <div className="ml-auto"><SetCardSearch /></div>
  </div>
 </div>;
}
