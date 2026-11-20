import { Suspense } from "react";
import { ActivitySkeleton } from "@/features/activity/activity-skeleton";
import { ActivityStream } from "@/features/activity/activity-stream";
import { PageHeader } from "@/features/shell/page-header";
import { publicActivity } from "@/server/activity/client";

export const metadata = { title: "Activity" };
async function ActivityContent() {
	let initial: Awaited<ReturnType<typeof publicActivity>> | null = null;
	try {
		initial = await publicActivity();
	} catch {
		/* Activity can retry without replacing the page shell. */
	}
	return <ActivityStream initial={initial} />;
}
export default function ActivityPage() {
	return (
		<section aria-labelledby="activity-title">
			<Suspense
				fallback={
					<>
						<PageHeader title="Activity" titleId="activity-title" />
						<div className="mt-10">
							<ActivitySkeleton toolbar />
						</div>
					</>
				}
			>
				<ActivityContent />
			</Suspense>
		</section>
	);
}
