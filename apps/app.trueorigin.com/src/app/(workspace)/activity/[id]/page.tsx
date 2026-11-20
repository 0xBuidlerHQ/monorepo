import { notFound } from "next/navigation";
import { Suspense } from "react";
import { ActivityDetail } from "@/features/activity/activity-detail";
import { RecheckPassport } from "@/features/passports/controls";
import { PageHeader } from "@/features/shell/page-header";
import { getActivityEvent } from "@/server/activity/client";

type Props = { params: Promise<{ id: string }> };
export async function generateMetadata({ params }: Props) {
	const event = await getActivityEvent((await params).id).catch(() => null);
	return {
		title: event
			? `${event.kind === "issued" ? "Registration" : event.kind.charAt(0).toUpperCase() + event.kind.slice(1)} · Activity`
			: "Event · Activity",
	};
}
async function EventContent({ params }: Props) {
	const id = (await params).id;
	let event: Awaited<ReturnType<typeof getActivityEvent>>;
	try {
		event = await getActivityEvent(id);
	} catch {
		return (
			<section>
				<PageHeader title="Event unavailable" titleId="event-unavailable" />
				<p className="my-5 text-sm text-white/45">
					Activity could not be loaded. Try again shortly.
				</p>
				<RecheckPassport />
			</section>
		);
	}
	if (!event) notFound();
	return <ActivityDetail event={event} />;
}
export default function EventPage(props: Props) {
	return (
		<Suspense
			fallback={
				<div role="status" aria-label="Loading event" className="space-y-8">
					<div className="h-24 w-64 animate-pulse rounded bg-white/5 motion-reduce:animate-none" />
					<div className="h-80 animate-pulse rounded-xl bg-white/[0.025] motion-reduce:animate-none" />
				</div>
			}
		>
			<EventContent {...props} />
		</Suspense>
	);
}
