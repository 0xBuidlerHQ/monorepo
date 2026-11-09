export interface GradedItem {
 id: string;
 referenceId: string | null;
 name: string;
 category: string;
 collection: string;
 edition: string;
 variant: string;
 language: string;
 attributes: { label: string; value: string }[];
 grading: { company: string; grade: string; certificationNumber: string | null; gradedAt: string | null };
 preview: boolean;
}

// Presentation sample only: no real slab, certificate, owner, or valuation is asserted.
export const gradedItems: GradedItem[] = [{
 id: "preview-charizard",
 referenceId: "base1-4",
 name: "Charizard",
 category: "Cards",
 collection: "Pokemon",
 edition: "Base Set",
 variant: "Unlimited · Holo",
 language: "English",
 attributes: [{ label: "Card number", value: "4/102" }, { label: "Release year", value: "1999" }],
 grading: { company: "PSA", grade: "9", certificationNumber: null, gradedAt: null },
 preview: true,
}];

export function getGradedItem(id: string) {
 return gradedItems.find((item) => item.id === id);
}
