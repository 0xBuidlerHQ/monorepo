import { PageLayout } from "@/features/shell/page-layout";
import { Suspense } from "react";
import { ActivityFeed } from "@/features/feed/activity-feed";
import { FeedSkeleton } from "@/features/feed/feed-skeleton";
import { publicActivity } from "@/server/activity/client";

export const metadata = { title: "Feed" };
async function FeedContent() {
	let initial: Awaited<ReturnType<typeof publicActivity>> | null = null;
	try {
		initial = await publicActivity();
	} catch {
		/* The feed can retry without replacing the page shell. */
	}
	return <ActivityFeed initial={initial} />;
}
export default function FeedPage() {
	return (
		<PageLayout title="Feed">
			<Suspense fallback={<FeedSkeleton toolbar />}>
				<FeedContent />
			</Suspense>
		</PageLayout>
	);
}
