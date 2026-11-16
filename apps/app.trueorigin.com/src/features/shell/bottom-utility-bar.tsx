"use client";

import { useState, type ReactNode } from "react";
import Link from "next/link";
import { TrueOriginsMark } from "@/components/icons/trueorigins-mark";

const icons: Record<string, ReactNode> = {
	discord: <path fill="currentColor" stroke="none" d="M19.7 5.3a18 18 0 0 0-4.4-1.4l-.6 1.2a16 16 0 0 0-5.4 0l-.6-1.2a18 18 0 0 0-4.4 1.4C1.5 9.5.7 13.5 1.1 17.4a18 18 0 0 0 5.4 2.7l1.1-1.8-1.7-.8.4-.3a13.5 13.5 0 0 0 11.4 0l.4.3-1.7.8 1.1 1.8a18 18 0 0 0 5.4-2.7c.5-4.5-.8-8.4-3.2-12.1ZM8.4 14.8c-1 0-1.8-.9-1.8-2s.8-2 1.8-2 1.8.9 1.8 2-.8 2-1.8 2Zm7.2 0c-1 0-1.8-.9-1.8-2s.8-2 1.8-2 1.8.9 1.8 2-.8 2-1.8 2Z" />,
	reddit: <><circle cx="12" cy="12" r="10" fill="currentColor" stroke="none" /><g stroke="#080808" strokeWidth="1.5"><ellipse cx="12" cy="14" rx="6.5" ry="4.5" /><path d="m12 9 1.2-5 4 1" /><circle cx="18" cy="5" r="1.5" /><path d="M8.5 15.5q3.5 2.5 7 0" /></g><g fill="#080808" stroke="none"><circle cx="9" cy="12.5" r="1" /><circle cx="15" cy="12.5" r="1" /></g></>,
	telegram: <path fill="currentColor" stroke="none" d="M22 3 2.4 10.6c-1.3.5-1.3 1.2-.2 1.5l5 1.6 1.9 5.8c.2.6.4.9.9.9.4 0 .7-.2 1-.5l2.4-2.3 5 3.7c.9.5 1.5.3 1.7-.8l3-15.8C23.5 3.3 22.8 2.7 22 3ZM9.2 13.3l9.7-6.1c.5-.3.9-.1.5.3l-8 7.3-.4 4.3-1.8-5.8Z" />,
	x: <><path d="m4 3 16 18h-4L0 3h4Z" transform="translate(2 0) scale(.9 1)" /><path d="M20 3 4 21" /></>,
	instagram: <><rect x="3" y="3" width="18" height="18" rx="5" /><circle cx="12" cy="12" r="4" /><circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none" /></>,
	ethereum: <><path fill="currentColor" stroke="none" opacity=".8" d="m12 1-7 11 7 4 7-4-7-11Z" /><path fill="currentColor" stroke="none" d="m5 14 7 9 7-9-7 4-7-4Z" /><path fill="#080808" stroke="none" opacity=".45" d="m12 1 7 11-7 4V1Z" /></>,
	support: <><circle cx="12" cy="12" r="9" /><path d="M9.5 9a2.6 2.6 0 0 1 5 .6c0 1.9-2.5 2.1-2.5 4M12 17v.1" /></>,
	sun: <><circle cx="12" cy="12" r="4" /><path d="M12 1v2m0 18v2M1 12h2m18 0h2M4.2 4.2l1.4 1.4m12.8 12.8 1.4 1.4M4.2 19.8l1.4-1.4M18.4 5.6l1.4-1.4" /></>,
	moon: <path d="M20.6 14.2A9 9 0 0 1 9.8 3.4 9 9 0 1 0 20.6 14.2Z" />,
	system: <><circle cx="12" cy="12" r="9" /><path d="M12 3a9 9 0 0 1 0 18V3Z" fill="currentColor" stroke="none" /></>,
};

function BarIcon({ name, className = "size-3.5" }: { name: string; className?: string }) {
	return <svg aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.65" strokeLinecap="round" strokeLinejoin="round" className={`shrink-0 ${className}`}>{icons[name]}</svg>;
}
function Divider() {
	return <span aria-hidden="true" className="mx-3 h-3.5 w-px shrink-0 bg-white/[0.08]" />;
}
const buttonStyle = "inline-flex shrink-0 cursor-pointer items-center gap-1.5 whitespace-nowrap transition-colors hover:text-white";

export function BottomUtilityBar() {
	const [theme, setTheme] = useState("moon");
	return (
		<footer data-bottom-utility-bar style={{ viewTransitionName: "app-footer" }} className="fixed inset-x-0 bottom-0 z-40 overflow-x-auto rounded-b-[14px] border border-[#292929] bg-[var(--background)] pb-[env(safe-area-inset-bottom)] text-[11px] leading-none text-[#969696] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
			<div className="flex h-[30px] min-w-max items-center px-4">
				<Link href="/explore" aria-label="TrueOrigin Explore" className="grid h-[30px] shrink-0 place-items-center text-white/80 transition-colors hover:text-white"><TrueOriginsMark className="size-5" /></Link>
				<Divider />
				<button type="button" className={`${buttonStyle} text-[#dedede]`}><span aria-hidden="true" className="size-2 rounded-full bg-[#40bf6b] ring-2 ring-[#244b32]" />Live</button>
				<Divider />
				<button type="button" className={`${buttonStyle} gap-1 font-mono tracking-[0.025em]`}><BarIcon name="ethereum" className="h-3.5 w-2.5" />$1,832.93</button>
				<div className="min-w-5 flex-1" />
				<div className="flex items-center gap-2.5 text-[#dedede]">{["discord", "reddit", "telegram", "x", "instagram"].map(name => <button key={name} type="button" aria-label={name === "x" ? "X" : name[0].toUpperCase() + name.slice(1)} className="cursor-pointer transition-colors hover:text-white"><BarIcon name={name} /></button>)}</div>
				<Divider />
				<button type="button" className={buttonStyle}><BarIcon name="support" />Support</button>
				<Divider />
				<fieldset aria-label="Appearance preview" className="flex items-center rounded-full bg-[#161616] p-0.5">{["sun", "moon", "system"].map(name => <button key={name} type="button" aria-label={`${name === "sun" ? "Light" : name === "moon" ? "Dark" : "System"} appearance`} aria-pressed={theme === name} onClick={() => setTheme(name)} className={`grid size-5 cursor-pointer place-items-center rounded-full transition-colors ${theme === name ? "bg-[#262626] text-[#eeeeee]" : "text-[#929292] hover:text-white"}`}><BarIcon name={name} /></button>)}</fieldset>
			</div>
		</footer>
	);
}
