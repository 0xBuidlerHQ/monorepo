import { Suspense, type ReactNode } from "react";

export function LoadingBoundary({ children, fallback }: { children: ReactNode; fallback: ReactNode }) {
	return <Suspense fallback={fallback}><div className="content-ready">{children}</div></Suspense>;
}
