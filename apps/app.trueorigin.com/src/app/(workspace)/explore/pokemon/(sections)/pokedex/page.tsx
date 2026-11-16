import { Pokedex } from "@/features/pokemon/pokedex";
export const metadata = { title: "Pokédex · Pokémon" };
export default function Page() {
 return <Pokedex embedded queryFromLocation />;
}
