export function formatCardNumber(card: { setId: string; number: string }, printedTotal?: number | null) {
	const rgbMew = card.setId === "me55" && ["R", "G", "B"].includes(card.number);
	return rgbMew || !printedTotal ? card.number : `${card.number}/${printedTotal}`;
}
