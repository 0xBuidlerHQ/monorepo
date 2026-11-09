import { ContentSurface } from "@/features/shell/content-surface";
import { NavigationIcon } from "@/components/icons/navigation-icon";

export const metadata = { title: "Registry" };

export default function RegistryPage() {
	return (
		<section aria-labelledby="registry-title">
			<ContentSurface><h1 id="registry-title" className="text-[clamp(48px,9vw,120px)] font-medium leading-none tracking-[-0.065em] text-white">Registry</h1></ContentSurface>
			<p className="mt-5 max-w-lg text-sm leading-6 text-white/50">Individual items, their authentication records, and ownership history. Registered items appear here whether or not they’re for sale.</p>
			<ContentSurface className="mt-10 flex min-h-64 flex-col items-center justify-center rounded-[28px] bg-[#1c1c1c] px-6 py-12 text-center">
				<span className="mb-5 flex size-12 items-center justify-center rounded-2xl bg-white/5 text-white/40"><NavigationIcon name="Registry" className="size-6" /></span>
				<h2 className="text-xl font-medium tracking-tight">No registered items to display yet</h2>
				<p className="mt-3 max-w-sm text-sm leading-6 text-white/45">Public item records will appear here as the registry grows.</p>
			</ContentSurface>
		</section>
	);
}
