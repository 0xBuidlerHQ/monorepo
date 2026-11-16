"use client";

import { EditorialFilter } from "@/components/ui/editorial-filter";
import { generations } from "./pokedex.json";

const options = [
 { value: "all", label: "All" },
 ...generations.map(generation => ({ value: String(generation.id), label: generation.name.replace("Generation", "Gen") })),
];

export function GenerationSelector({ value, onChange }: { value: string; onChange: (value: string) => void }) {
 return <EditorialFilter label="Generation" options={options} value={value} onChange={onChange} />;
}
