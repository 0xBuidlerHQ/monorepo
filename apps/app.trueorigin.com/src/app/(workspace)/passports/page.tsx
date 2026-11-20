import { PassportGridSkeleton } from "@/features/shell/loading-skeleton";
import { PageHeader } from "@/features/shell/page-header";
import { PassportMark } from "@/components/icons/passport-mark";
import { Suspense } from "react";
import { PassportBrowser } from "@/features/passports/passport-browser";
import { publicPassports } from "@/server/passports/client";

export const metadata = { title: "Passports" };
async function PassportsContents() {
	let passports: Awaited<ReturnType<typeof publicPassports>>;
	try {
		passports = await publicPassports();
	} catch {
		return (
			<p
				role="status"
				className="rounded-2xl bg-white/5 p-6 text-sm text-white/50"
			>
				Passports are temporarily unavailable. Please try again shortly.
			</p>
		);
	}
	return <PassportBrowser passports={passports} />;
}
export default function PassportsPage() {
	return (
		<section aria-labelledby="passports-title">
			<PageHeader
				title="Passports"
				titleId="passports-title"
				actions={
					<PassportMark className="size-[clamp(48px,9vw,120px)] shrink-0 text-white/80" />
				}
			/>
			<div className="mt-9">
				<Suspense fallback={<PassportGridSkeleton />}>
					<PassportsContents />
				</Suspense>
			</div>
		</section>
	);
}
