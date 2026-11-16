import { type ReactNode } from "react";
import { RevealImage as Image } from "@/components/ui/reveal-image";
import { UniverseTitle } from "@/features/reference/universe-title";
import { PokedexSearchProvider } from "@/features/pokemon/pokedex-search";
import { PokemonCategoryTabs } from "@/features/pokemon/pokemon-category-navigation";

export default function PokemonSectionsLayout({ children }: { children: ReactNode }) {
 return <section aria-labelledby="pokemon-title" className="[&_#pokemon-title]:font-serif">
  <UniverseTitle name="Pokémon" titleId="pokemon-title">
   <Image src="/pika.png" alt="Pikachu" width={120} height={120} className="size-[clamp(48px,9vw,120px)] shrink-0 object-contain" />
  </UniverseTitle>
  <PokedexSearchProvider><div className="mt-9">
   <PokemonCategoryTabs />
   <div className="pt-3">{children}</div>
  </div></PokedexSearchProvider>
 </section>;
}
