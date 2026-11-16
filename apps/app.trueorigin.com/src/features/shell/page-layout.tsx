import type { ReactNode } from "react";
import { PageHeader } from "./page-header";

export function PageLayout({
	title,
	titleId = `${title.toLowerCase().replace(/[^a-z0-9]+/g, "-")}-title`,
	actions,
	children,
	className,
}: {
	title: string;
	titleId?: string;
	actions?: ReactNode;
	children?: ReactNode;
	className?: string;
}) {
	return (
		<section aria-labelledby={titleId} className={className}>
			<PageHeader title={title} titleId={titleId} actions={actions} />
			{children && (
				<div data-page-body className="mt-10">
					{children}
				</div>
			)}
		</section>
	);
}
