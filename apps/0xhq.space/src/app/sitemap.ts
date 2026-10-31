import type { MetadataRoute } from "next";
import { absoluteUrl } from "@/lib/site";
import { contentLanguageRoutes } from "@/lib/translations";

export default function sitemap(): MetadataRoute.Sitemap {
	return Object.entries(contentLanguageRoutes()).flatMap(([path, locales]) => {
		const languages = Object.fromEntries(
			locales.map((locale) => [
				locale,
				absoluteUrl(`/${locale}${path === "/" ? "" : path}`),
			]),
		);
		return locales.map((locale) => ({
			url: languages[locale],
			alternates: { languages },
		}));
	});
}
