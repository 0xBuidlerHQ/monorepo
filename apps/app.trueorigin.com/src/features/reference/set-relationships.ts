// The source keeps the Classic Collection as a separate checklist, inside its parent release.
export function parentCollectionId(id: string) { return id === "me55c" ? "me55" : id; }
export function setPageHref(setId: string) {
 return setId === "me55c" ? "/explore/catalogue/collections/me55?section=classic" : `/explore/catalogue/collections/${setId}`;
}
export function cardCollectionId(setId: string | null | undefined, sets: readonly { id: string }[]) {
 if (!setId || !sets.some(set => set.id === setId)) return "misc";
 return parentCollectionId(setId);
}

export function cardPageHref(card: { setId: string; number: string }) {
 return `/explore/catalogue/${encodeURIComponent(card.setId)}/${encodeURIComponent(card.number)}`;
}
