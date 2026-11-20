import type { ReactNode } from "react";
import { TrueOriginsMark } from "./trueorigins-mark";

const icons: Record<string, ReactNode> = {
 Activity: <><path d="M4 6h16M4 12h12M4 18h8" /><circle cx="19" cy="18" r="2" fill="currentColor" fillOpacity="0.12" /></>,
 Submit: <path d="m12 1 3 2 3.6.5 1 3.5 2 4-2 3.5-1 3.5-3.6.5-3 2-3-2-3.6-.5-1-3.5-2-3.5 2-4 1-3.5L9 3Zm-4.5 10 3 3 6-6-1.4-1.4-4.6 4.6-1.6-1.6Z" fill="currentColor" fillRule="evenodd" stroke="none" />,
 Registry: <><rect x="5" y="3" width="15" height="18" rx="2" fill="currentColor" fillOpacity="0.06" /><path d="M5 7H3m2 5H3m2 5H3M9 8h7m-7 4h7m-7 4h4" /></>,
 Home: <><path d="m3 10 9-7 9 7v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2Z" fill="currentColor" fillOpacity="0.06" /><path d="M9 21v-7h6v7" /></>,
 Explore: <><circle cx="12" cy="12" r="9" /><path d="m16 8-2.5 5.5L8 16l2.5-5.5Z" fill="currentColor" fillOpacity="0.12" /></>,
 "My Collection": <><rect x="3" y="3" width="7" height="7" rx="1.5" /><rect x="14" y="3" width="7" height="7" rx="1.5" /><rect x="3" y="14" width="7" height="7" rx="1.5" /><rect x="14" y="14" width="7" height="7" rx="1.5" /></>,
 "Verify": <><path d="M7 3H5a2 2 0 0 0-2 2v2m14-4h2a2 2 0 0 1 2 2v2M3 17v2a2 2 0 0 0 2 2h2m10 0h2a2 2 0 0 0 2-2v-2" strokeWidth="2.2" /><path d="M7.5 13v-1.5a4.5 4.5 0 0 1 9 0V13m-6 4c.8-1.5 1.5-3.2 1.5-5.5m-3 3a12 12 0 0 0 0-3 3 3 0 0 1 6 0c0 1.8-.3 3.5-1 5" strokeWidth="1.8" /></>,
 Scan: <><path d="M8 3H5a2 2 0 0 0-2 2v3m13-5h3a2 2 0 0 1 2 2v3M3 16v3a2 2 0 0 0 2 2h3m8 0h3a2 2 0 0 0 2-2v-3" /><rect x="8" y="7" width="8" height="10" rx="1.5" fill="currentColor" fillOpacity="0.06" /><path d="M6 12h12" /></>,
 Transfers: <><path d="M4 7h16m-4-4 4 4-4 4M20 17H4m4-4-4 4 4 4" /></>,
};

export function NavigationIcon({ name, className = "size-[19px] shrink-0" }: { name: string; className?: string }) {
 if (name === "My Collection") return <TrueOriginsMark className={className} />;
 return <svg aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.65" strokeLinecap="round" strokeLinejoin="round" className={className}>{icons[name]}</svg>;
}
