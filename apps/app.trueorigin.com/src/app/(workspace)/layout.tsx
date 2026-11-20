import { initialAccountSession } from "@/server/auth/account-session";
import type { Metadata } from "next";
import { Suspense, type ReactNode } from "react";
import { AccountProvider } from "@/features/account/account-provider";
import { NavigationScroll } from "@/features/shell/navigation-scroll";
import { BottomUtilityBar } from "@/features/shell/bottom-utility-bar";
import { UtilityBar } from "@/features/shell/utility-bar";
import { PageTransition } from "@/features/shell/page-transition";

export const metadata: Metadata = {
	title: { default: "TrueOrigin", template: "%s | TrueOrigin" },
	robots: { index: false, follow: false },
};

export default function AppLayout({ children }: { children: ReactNode }) {
	return <AccountProvider initialSession={initialAccountSession()}><div className="min-h-dvh flex-1 bg-[#141414] text-white"><Suspense fallback={null}><NavigationScroll /></Suspense><UtilityBar /><main id="main-content" aria-label="TrueOrigin app" className="min-h-dvh px-[var(--app-gutter)] pb-[calc(2.5rem+env(safe-area-inset-bottom))] pt-[calc(var(--app-header-height)+1.5rem)] sm:pt-[calc(var(--app-header-height)+2rem)]"><PageTransition>{children}</PageTransition></main><BottomUtilityBar /></div></AccountProvider>;
}
