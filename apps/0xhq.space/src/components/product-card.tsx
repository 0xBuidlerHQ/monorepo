import { ProductImage } from "@/components/product-image";
import type { CuratedProduct } from "@/lib/curated";
import type { ContentLocale } from "@/lib/locales";
import { messages } from "@/lib/messages";

export function ProductCard({
	product,
	locale,
}: {
	product: CuratedProduct;
	locale: ContentLocale;
}) {
	const t = messages[locale];
	const { imageAlt } = product.translations[locale];
	const action =
		product.availability === "preorder"
			? t.preorderProduct
			: product.availability === "discontinued"
				? t.findSecondHand
				: t.viewProduct;
	return (
		<li className="min-w-0">
			<a
				href={product.url}
				target="_blank"
				rel="noopener noreferrer"
				aria-label={`${product.brand} ${product.name} — ${action} (${t.opensNewTab})`}
				className="group relative block aspect-square overflow-hidden rounded-2xl bg-zinc-300 text-zinc-900 shadow-md shadow-black/15 transition-[translate,box-shadow,background-color] duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] motion-safe:hover:-translate-y-0.5 hover:bg-zinc-200 hover:shadow-lg hover:shadow-black/25 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-red-600 motion-reduce:translate-y-0 motion-reduce:transition-none"
			>
				<ProductImage
					key={product.image.src}
					image={product.image}
					alt={imageAlt}
				/>
				<div className="absolute inset-x-0 bottom-0 flex items-baseline justify-between gap-3 px-4 pb-4 pt-3">
					<h3
						className="min-w-0 truncate text-sm font-normal tracking-tight"
						title={product.name}
					>
						{product.name}
					</h3>
					<p
						className="max-w-[45%] shrink-0 truncate text-right text-xs text-zinc-500"
						title={product.brand}
					>
						{product.brand}
					</p>
				</div>
			</a>
		</li>
	);
}
