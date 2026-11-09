import type { Metadata } from "next";
import type { ReactNode } from "react";
import { AccountProvider } from "@/features/account/account-provider";
import { AppHeader } from "@/features/shell/app-header";
import { BottomNavigation } from "@/features/navigation/bottom-navigation";
import { NavigationScroll } from "@/features/shell/navigation-scroll";
import { PageTransition } from "@/features/shell/page-transition";

export const metadata: Metadata = {
	title: { default: "TrueOrigin", template: "%s | TrueOrigin" },
	robots: { index: false, follow: false },
};

export default function AppLayout({ children }: { children: ReactNode }) {
	return <AccountProvider><div className="min-h-dvh flex-1 bg-[#141414] text-white"><NavigationScroll /><AppHeader /><main id="main-content" aria-label="TrueOrigin app" className="min-h-dvh px-6 sm:px-12 pb-[calc(8rem+env(safe-area-inset-bottom))] pt-[var(--app-header-height)]"><PageTransition>{children}</PageTransition></main><BottomNavigation /></div></AccountProvider>;
}
