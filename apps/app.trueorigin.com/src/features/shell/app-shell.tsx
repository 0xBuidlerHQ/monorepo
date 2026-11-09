import type { ReactNode } from "react";
import { AccountProvider } from "@/features/account/account-provider";
import { ConnectAccount } from "@/features/account/connect-account";
import Link from "next/link";
import { OriginLogo } from "@/components/origin-logo";
import { Sidebar } from "@/features/navigation/sidebar";
import { ResearchPanel } from "@/features/navigation/research-panel";
import { SettingsDrawer } from "@/features/settings/settings-drawer";

export function AppShell({ children }: { children: ReactNode }) {
	return (
		<AccountProvider>
			<div className="app-shell flex h-dvh min-h-0 flex-none flex-col overflow-hidden bg-black outline-1 -outline-offset-1 outline-white/20 text-white [--cell:var(--app-cell)] [color-scheme:dark]">
				<header className="relative grid h-[var(--cell)] shrink-0 grid-cols-[var(--cell)_minmax(0,1fr)_var(--cell)] after:pointer-events-none after:absolute after:inset-x-0 after:bottom-0 after:h-px after:bg-white/20">
					<Link href="/" aria-label="Back to TrueOrigin website" title="Back to TrueOrigin website" className="grid place-items-center border-r border-white/20 text-brand-accent transition-colors hover:bg-white/5 focus-visible:outline-2 focus-visible:-outline-offset-4 focus-visible:outline-brand-accent">
						<OriginLogo className="size-[calc(var(--cell)*0.5)]" />
					</Link>
					<div className="flex justify-end bg-[linear-gradient(to_right,rgba(255,255,255,0.04)_1px,transparent_1px)] [background-size:var(--cell)_100%]">
						<ResearchPanel />
						<ConnectAccount />
					</div>
					<SettingsDrawer />
				</header>
				<main id="main-content" className="grid min-h-0 flex-1 overflow-hidden grid-cols-[var(--cell)_minmax(0,1fr)_var(--cell)]">
                    <Sidebar />
                    <div className="min-h-0 min-w-0 overflow-y-auto overscroll-contain bg-[linear-gradient(to_right,rgba(255,255,255,0.04)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.04)_1px,transparent_1px)] [background-size:var(--cell)_var(--cell)]"><div className="flex min-h-full items-center">{children}</div></div>
                    <div aria-hidden="true" className="border-l border-white/20 bg-[linear-gradient(to_bottom,rgba(255,255,255,0.04)_1px,transparent_1px)] [background-size:100%_var(--cell)]" />
                </main>
				<footer className="relative grid h-[var(--cell)] shrink-0 grid-cols-[var(--cell)_minmax(0,1fr)_var(--cell)] after:pointer-events-none after:absolute after:inset-x-0 after:top-0 after:h-px after:bg-white/20">
					<div
						className="grid place-items-center border-r border-white/20 text-[calc(var(--cell)*0.6)] leading-none font-light text-brand-accent"
						aria-hidden="true"
					>
						+
					</div>
					<div
						aria-hidden="true"
						className="bg-[linear-gradient(to_right,rgba(255,255,255,0.04)_1px,transparent_1px)] [background-size:var(--cell)_100%]"
					/>
					<div
						aria-hidden="true"
						className="grid place-items-center border-l border-white/20 text-[calc(var(--cell)*0.6)] leading-none font-light text-brand-accent"
					>
						+
					</div>
				</footer>
			</div>
		</AccountProvider>
	);
}
