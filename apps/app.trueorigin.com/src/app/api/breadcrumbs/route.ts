import {
	findPokemon,
	findReferenceCardByNumber,
	findReferenceSet,
} from "@/features/reference/catalog";
import { catalogLanguage } from "@/features/reference/catalog-language";
import { parentCollectionId } from "@/features/reference/set-relationships";
import type { BreadcrumbDetail } from "@/features/navigation/breadcrumb-trail";

export function GET(request: Request) {
	const params = new URL(request.url).searchParams;
	const path = (params.get("path") ?? "").replace("/explore/catalogue/collections/", "/explore/sets/");
	const match =
		/^\/explore\/(pokemon|catalogue|sets)\/([a-zA-Z0-9-]{1,80})(?:\/([^/]{1,80}))?\/?$/.exec(path);
	if (!match)
		return Response.json({ error: "Invalid catalog path." }, { status: 400 });
	const language = catalogLanguage(params.get("lang"));
	let detail: BreadcrumbDetail = { name: null };
	if (match[1] === "pokemon")
		detail = { name: findPokemon(match[2])?.name ?? null };
	if (match[1] === "sets")
		detail = { name: match[2] === "misc" ? "Misc" : findReferenceSet(match[2], language)?.name ?? null };
	if (match[1] === "catalogue" && match[3]) {
		const card = findReferenceCardByNumber(match[2], decodeURIComponent(match[3]), language);
		const set = card ? findReferenceSet(parentCollectionId(card.setId), language) : undefined;
		detail = {
			name: card ? `${card.name} #${card.number}` : null,
			...(set && { setId: set.id, setName: set.name }),
		};
	}
	return Response.json(detail, {
		headers: { "Cache-Control": "public, max-age=3600" },
	});
}
