import type { ReactNode } from "react";

const drawings: Record<string, ReactNode> = {
	trading: <><path d="M4 7h16m-4-4 4 4-4 4M20 17H4m4-4-4 4 4 4" /></>,
	pokedex: <><rect x="5" y="3" width="14" height="18" rx="3" /><circle cx="12" cy="11" r="4" /><path d="M8 11h8M9 18h6" /><circle cx="12" cy="11" r="1" fill="currentColor" stroke="none" /></>,
	cards: <><rect x="8" y="5" width="12" height="16" rx="2" /><path d="M5 18H4a1 1 0 0 1-1-1V4a2 2 0 0 1 2-2h10M12 10h4m-4 4h4" /></>,
	sets: <><rect x="3" y="3" width="7" height="7" rx="1.5" /><rect x="14" y="3" width="7" height="7" rx="1.5" /><rect x="3" y="14" width="7" height="7" rx="1.5" /><rect x="14" y="14" width="7" height="7" rx="1.5" /></>,
	sealed: <><path d="m12 3 9 5-9 5-9-5 9-5Zm-9 5v9l9 5 9-5V8M12 13v9M7.5 5.5l9 5" /></>,
	"video-games": <><path d="M8 7h8c3 0 4 2 5 6l1 4c.5 3-2 4-4 2l-3-3H9l-3 3c-2 2-4.5 1-4-2l1-4c1-4 2-6 5-6Z" /><path d="M6 10v4m-2-2h4" /><circle cx="16" cy="11" r="1" fill="currentColor" stroke="none" /><circle cx="19" cy="13" r="1" fill="currentColor" stroke="none" /></>,
	merchandise: <><circle cx="12" cy="6" r="3" /><path d="m8 11-4 4m12-4 4 4M8 11h8v5l2 5h-4l-2-4-2 4H6l2-5v-5Z" /></>,
};

export function CatalogCategoryIcon({ category }: { category: string }) {
	return <svg aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="size-4 shrink-0">{drawings[category]}</svg>;
}
