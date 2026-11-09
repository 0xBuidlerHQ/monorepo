import type { ReactNode } from "react";

const icons: Record<string, ReactNode> = {
 Submit: <><path d="M12 16V3m-5 5 5-5 5 5M4 14v5a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-5" /></>,
 Registry: <><rect x="5" y="3" width="15" height="18" rx="2" fill="currentColor" fillOpacity="0.06" /><path d="M5 7H3m2 5H3m2 5H3M9 8h7m-7 4h7m-7 4h4" /></>,
 Home: <><path d="m3 10 9-7 9 7v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2Z" fill="currentColor" fillOpacity="0.06" /><path d="M9 21v-7h6v7" /></>,
 Explore: <><circle cx="12" cy="12" r="9" /><path d="m16 8-2.5 5.5L8 16l2.5-5.5Z" fill="currentColor" fillOpacity="0.12" /></>,
 "My Collection": <><path d="M8 3h8M6 6h12" /><rect x="3" y="9" width="18" height="12" rx="3" fill="currentColor" fillOpacity="0.06" /><path d="M9 14h6" /></>,
 "Verify": <><path d="m12 3 8 3v6c0 4-4 7-8 9-4-2-8-5-8-9V6Z" fill="currentColor" fillOpacity="0.06" /><path d="m8.5 12 2.5 2.5 4.5-5" /></>,
 Scan: <><path d="M8 3H5a2 2 0 0 0-2 2v3m13-5h3a2 2 0 0 1 2 2v3M3 16v3a2 2 0 0 0 2 2h3m8 0h3a2 2 0 0 0 2-2v-3" /><rect x="8" y="7" width="8" height="10" rx="1.5" fill="currentColor" fillOpacity="0.06" /><path d="M6 12h12" /></>,
 Trading: <><path d="M3 4h2l2.5 11h10l3-8H6" /><circle cx="9" cy="20" r="1" /><circle cx="18" cy="20" r="1" /></>,
 Transfers: <><path d="M4 7h16m-4-4 4 4-4 4M20 17H4m4-4-4 4 4 4" /></>,
};

export function NavigationIcon({ name, className = "size-[19px] shrink-0" }: { name: string; className?: string }) {
 return <svg aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.65" strokeLinecap="round" strokeLinejoin="round" className={className}>{icons[name]}</svg>;
}
