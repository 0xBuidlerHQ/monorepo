import Link from "next/link";
export default function EventNotFound() {
	return (
		<section className="py-10">
			<h1 className="font-serif text-4xl">Event not found</h1>
			<p className="mt-4 text-sm text-white/45">
				This event is not available in the current activity index.
			</p>
			<Link
				href="/activity"
				className="mt-6 inline-block text-sm text-white/80 hover:text-white"
			>
				← Back to activity
			</Link>
		</section>
	);
}
