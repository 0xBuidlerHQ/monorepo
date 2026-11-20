export type SearchResult = { title: string; detail: string; href: string; group: string; image?: string; universe?: string; keywords?: string };
export function normalizeSearchText(value: string) {
 return value.normalize("NFD").replace(/\p{M}/gu, "").toLowerCase().replace(/[^a-z0-9]/g, "");
}
export function rankSearchResults(entries: SearchResult[], query: string, perGroup = 6) {
 const terms = query.trim().split(/\s+/).map(normalizeSearchText).filter(Boolean);
 if (!terms.length) return [];
 const exact = normalizeSearchText(query);
 const counts = new Map<string, number>();
 return entries.filter(entry => terms.every(term => normalizeSearchText(`${entry.title} ${entry.detail} ${entry.keywords ?? ""}`).includes(term)))
  .map((entry, order) => ({ entry, order, score: normalizeSearchText(entry.title) === exact ? 0 : normalizeSearchText(entry.title).startsWith(exact) ? 1 : 2 }))
  .sort((a, b) => a.score - b.score || a.order - b.order)
  .filter(({ entry }) => { const count = counts.get(entry.group) ?? 0; counts.set(entry.group, count + 1); return count < perGroup; })
  .map(({ entry: { keywords: _keywords, ...entry } }) => entry);
}
