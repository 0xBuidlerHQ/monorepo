"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { catalogLanguage, type CatalogLanguage } from "./catalog-language";

const languages = [
	{ value: "en", label: "EN", name: "English" },
	{ value: "fr", label: "FR", name: "Français" },
	{ value: "ja", label: "JP", name: "Japanese", disabled: true },
] as const;

export function CatalogLanguageSelector() {
	const router = useRouter();
	const params = useSearchParams();
	const active = catalogLanguage(params.get("lang"));

	function selectLanguage(language: CatalogLanguage) {
		if (language === active) return;
		const url = new URL(window.location.href);
		if (language === "fr") url.searchParams.set("lang", "fr");
		else url.searchParams.delete("lang");
		for (const key of ["q", "page", "type", "rarity", "artist"]) url.searchParams.delete(key);
		router.replace(url.pathname + url.search + url.hash, { scroll: false });
	}

	return <fieldset aria-label="Card language" className="inline-flex shrink-0 items-center gap-0.5">
		<span aria-hidden="true" className="font-mono text-sm text-white/40">[</span>
		{languages.map((language, index) => <span key={language.value} className="inline-flex items-center gap-0.5">
			{index > 0 && <span aria-hidden="true" className="text-xs text-white/20">/</span>}
			<button type="button" disabled={"disabled" in language && language.disabled} aria-label={language.name} aria-pressed={active === language.value} title={"disabled" in language ? "Japanese catalog coming soon" : language.name} onClick={() => { if (language.value !== "ja") selectLanguage(language.value); }} className={`cursor-pointer rounded-md px-1 py-2 text-xs font-medium transition-colors focus-visible:outline-2 focus-visible:outline-white disabled:cursor-default disabled:text-white/20 ${active === language.value ? "text-white" : "text-white/45 hover:text-white/80"}`}>
				{language.label}
			</button>
		</span>)}
		<span aria-hidden="true" className="font-mono text-sm text-white/40">]</span>
	</fieldset>;
}
