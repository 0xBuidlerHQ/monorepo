import { type ReactNode, ViewTransition } from "react";

export function PageTransition({ children }: { children: ReactNode }) {
	return (
		<ViewTransition name="page-content" default={{ "catalog-search": "none", "catalog-filter": "none", default: "page-crossfade" }}>
			<div data-page-transition>{children}</div>
		</ViewTransition>
	);
}
