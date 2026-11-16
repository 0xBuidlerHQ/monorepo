/** Shared manual handover methods. Add a definition here to expose a new method in both apps. */
export type HandoverDetailsByMethod = {
	delivery: { carrier: string; trackingNumber: string };
	in_person: { location: string };
};
export type HandoverMethod = keyof HandoverDetailsByMethod;
export type HandoverInput = { [M in HandoverMethod]: { method: M; details: HandoverDetailsByMethod[M] } }[HandoverMethod];
export type PhysicalHandover = HandoverInput & {
	status: "awaiting_receipt" | "received";
	recordedAt: string;
	receivedAt: string | null;
};
type MethodDefinition = {
	label: string; description: string; recordLabel: string; waitingLabel: string;
	fields: readonly { name: string; label: string; maxLength: number; required: boolean }[];
	summary: (details: Record<string, string>) => string;
};
export const handoverMethods = {
	in_person: {
		label: "Hand-to-hand", description: "Meet the owner and hand over the item directly.",
		recordLabel: "Record handover", waitingLabel: "Handed over in person. Waiting for your receipt confirmation.",
		fields: [{ name: "location", label: "Meeting location", maxLength: 200, required: false }],
		summary: (details: Record<string, string>) => details.location || "In person",
	},
	delivery: {
		label: "Delivery", description: "Arrange delivery manually and record dispatch after giving the parcel to the carrier.",
		recordLabel: "Record dispatch", waitingLabel: "Your return has been dispatched. Confirm receipt once it arrives.",
		fields: [{ name: "carrier", label: "Carrier", maxLength: 80, required: true }, { name: "trackingNumber", label: "Tracking number", maxLength: 120, required: true }],
		summary: (details: Record<string, string>) => `${details.carrier} · ${details.trackingNumber}`,
	},
} satisfies Record<HandoverMethod, MethodDefinition>;

export function isHandoverMethod(value: unknown): value is HandoverMethod {
	return typeof value === "string" && Object.hasOwn(handoverMethods, value);
}
export function parseHandover(value: unknown): HandoverInput {
	if (!value || typeof value !== "object" || Array.isArray(value)) throw new Error("Choose a handover method.");
	const input = value as { method?: unknown; details?: unknown };
	if (!isHandoverMethod(input.method)) throw new Error("Choose a supported handover method.");
	if (!input.details || typeof input.details !== "object" || Array.isArray(input.details)) throw new Error("Enter the handover details.");
	const details: Record<string, string> = {};
	for (const field of handoverMethods[input.method].fields) {
		const raw = (input.details as Record<string, unknown>)[field.name];
		if (raw === undefined && !field.required) { details[field.name] = ""; continue; }
		if (typeof raw !== "string" || raw.length > field.maxLength || (field.required && !raw.trim())) throw new Error(`Enter a valid ${field.label.toLowerCase()}.`);
		details[field.name] = raw.trim();
	}
	return { method: input.method, details } as HandoverInput;
}
export function handoverSummary(handover: HandoverInput) {
	return handoverMethods[handover.method].summary(handover.details);
}
