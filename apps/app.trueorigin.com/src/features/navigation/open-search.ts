export const OPEN_SEARCH_EVENT = "trueorigin:open-search";

export function openSearchDrawer() {
 window.dispatchEvent(new Event(OPEN_SEARCH_EVENT));
}
