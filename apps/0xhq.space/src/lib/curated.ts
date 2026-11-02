import products from "../../content/curated/products.json";
import type { ContentLocale } from "./locales";

export type CuratedProduct = {
	id: string;
	name: string;
	brand: string;
	url: string;
	availability: "preorder" | "available" | "discontinued";
	price?: {
		amount: number;
		currency: string;
		checkedAt: string;
		source: string;
	};
	image: {
		src: string;
		width: number;
		height: number;
		source: string;
		blendWithBackground?: boolean;
	};
	translations: Record<
		ContentLocale,
		{ description: string; imageAlt: string }
	>;
};

// JSON imports widen string literals; check the remaining fields statically.
const catalog: (Omit<CuratedProduct, "availability"> & {
	availability: string;
})[] = products;

export function getCuratedProducts(): CuratedProduct[] {
	return catalog.map((product) => {
		if (
			product.availability !== "preorder" &&
			product.availability !== "available" &&
			product.availability !== "discontinued"
		)
			throw new Error(
				`Unknown availability for curated product ${product.id}.`,
			);
		if (new URL(product.url).protocol !== "https:")
			throw new Error(
				`Curated product ${product.id} needs an HTTPS purchase URL.`,
			);
		return { ...product, availability: product.availability };
	});
}
