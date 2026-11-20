import {
	itemDisplayTitle,
	itemTypeLabel,
	itemUniverseLabel,
} from "@0xhq/api-client/passport-item";
import type { PublicPassport } from "@0xhq/api-client/types";

export type PassportFilters = {
	q: string;
	sealed: string;
	type: string;
	universe: string;
	certifier: string;
};
export const emptyPassportFilters: PassportFilters = {
	q: "",
	sealed: "",
	type: "",
	universe: "",
	certifier: "",
};
const normalize = (value: string) =>
	value.normalize("NFD").replace(/\p{M}/gu, "").toLowerCase();

export function filterPassports(
	passports: PublicPassport[],
	filters: PassportFilters,
) {
	const terms = normalize(filters.q).trim().split(/\s+/).filter(Boolean);
	return passports.filter((passport) => {
		if (
			filters.sealed &&
			passport.item.attributes.sealed !== (filters.sealed === "true")
		)
			return false;
		if (filters.type && passport.item.type !== filters.type) return false;
		if (filters.universe && passport.item.universe !== filters.universe)
			return false;
		if (filters.certifier && passport.certifier !== filters.certifier)
			return false;
		const searchable = normalize(
			[
				itemDisplayTitle(passport.item),
				passport.title,
				itemTypeLabel(passport.item),
				itemUniverseLabel(passport.item.universe),
				passport.certifier,
				passport.certificationNumber,
				passport.itemId,
				passport.tokenId,
			].join(" "),
		);
		return terms.every((term) => searchable.includes(term));
	});
}
