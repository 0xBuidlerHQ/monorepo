// Source catalogs keep the Classic Collection as a separate checklist.
// Present it inside its parent expansion without changing card identities.
export function setPageHref(setId: string) {
	return setId === "me55c" ? "/explore/sets/me55?section=classic" : `/explore/sets/${setId}`;
}
