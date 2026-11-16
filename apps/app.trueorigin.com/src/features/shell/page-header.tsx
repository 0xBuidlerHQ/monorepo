import type { ReactNode } from "react";
import Link from "next/link";

export const pageTitleClassName =
	"text-[clamp(48px,9vw,120px)] font-medium leading-none tracking-[-0.065em] text-white";

export function PageHeader({
	title,
	titleId,
	actions,
	adornment,
}: {
	title: ReactNode;
	titleId: string;
	actions?: ReactNode;
	adornment?: ReactNode;
}) {
	return (
		<header
			data-page-header
			className="flex flex-wrap items-end justify-between gap-6"
		>
			<div className="flex min-w-0 flex-wrap items-center gap-3 sm:gap-5">
				<h1 id={titleId} className={pageTitleClassName}>
					{title}
				</h1>
				{adornment}
			</div>
			{actions && <div className="shrink-0">{actions}</div>}
		</header>
	);
}

export function PageHeaderLink({
	href,
	children,
}: {
	href: string;
	children: ReactNode;
}) {
	return (
		<Link
			href={href}
			className="inline-flex rounded-full bg-white px-5 py-3 text-sm text-black transition-colors hover:bg-white/85"
		>
			{children}
		</Link>
	);
}
