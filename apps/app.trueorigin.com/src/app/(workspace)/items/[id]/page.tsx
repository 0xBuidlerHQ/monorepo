import { Suspense } from "react";
import { PassportSkeleton } from "@/features/shell/loading-skeleton";
import { notFound } from "next/navigation";
import { getPublicPassport } from "@/server/passports/client";
import { PassportDetail } from "@/features/passports/passport-detail";
import { RecheckPassport } from "@/features/passports/controls";

type Props = { params: Promise<{ id: string }> };
export async function generateMetadata({ params }: Props) {
	const passport = await getPublicPassport((await params).id).catch(() => null);
	return { title: passport ? `${passport.title} · Passport` : "Passport" };
}
async function ItemContent({ params }: Props) {
	const { id } = await params;
	let passport: Awaited<ReturnType<typeof getPublicPassport>>;
	try { passport = await getPublicPassport(id); }
	catch { return <section className="py-12"><h1 className="text-4xl font-medium tracking-tight">Passport temporarily unavailable</h1><p className="my-5 max-w-md text-sm leading-6 text-white/45">The registry could not be reached. This is not a verification result; try again shortly.</p><RecheckPassport /></section>; }
	if (!passport) notFound();
	return <PassportDetail passport={passport} />;
}

export default function ItemPage(props: Props) {
 return <Suspense fallback={<PassportSkeleton />}><ItemContent {...props} /></Suspense>;
}
