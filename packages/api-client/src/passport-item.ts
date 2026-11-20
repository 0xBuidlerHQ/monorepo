export const itemCategories = {
	pokemon: "Pokémon",
	magic: "Magic: The Gathering",
	"one-piece": "One Piece",
	yugioh: "Yu-Gi-Oh!",
	other: "Other",
} as const;
export type AttributeValue = string | number | boolean;
export type VersionedItem = {
	type: string;
	schemaVersion: number;
	category: string;
	attributes: Record<string, AttributeValue>;
};
export type PassportItem = VersionedItem;
export type ItemField = {
	key: string;
	label: string;
	type: "text" | "number" | "boolean";
	required?: boolean;
	maxLength?: number;
	unit?: string;
	placeholder?: string;
};
export type TitleFormat = "short" | "compact" | "full";
export type ItemSchema = {
	type: string;
	version: number;
	label: string;
	categories: readonly string[];
	fields: readonly ItemField[];
	validate: (attributes: Record<string, AttributeValue>) => void;
	title: (
		attributes: Record<string, AttributeValue>,
		format: TitleFormat,
	) => string;
};
const tradingCardV1: ItemSchema = {
	type: "trading-card",
	version: 1,
	label: "Trading card",
	categories: Object.keys(itemCategories),
	fields: [
		{
			key: "subject",
			label: "Subject",
			type: "text",
			required: true,
			maxLength: 100,
			placeholder: "Venusaur",
		},
		{
			key: "set",
			label: "Set",
			type: "text",
			required: true,
			maxLength: 100,
			placeholder: "Base Set",
		},
		{
			key: "number",
			label: "Card number",
			type: "text",
			maxLength: 20,
			placeholder: "15",
		},
		{
			key: "total",
			label: "Printed total",
			type: "text",
			maxLength: 20,
			placeholder: "102",
		},
	],
	validate(attributes) {
		if (attributes.total && !attributes.number)
			throw new Error("Enter a card number before the set total.");
	},
	title(attributes, format) {
		if (format === "short") return String(attributes.subject);
		const title = `${attributes.subject} — ${attributes.set}`;
		return format === "full" && attributes.number
			? `${title} #${attributes.number}${attributes.total ? `/${attributes.total}` : ""}`
			: title;
	},
};
// Add new versions alongside old definitions; never replace an issued version.
export const itemSchemas: readonly ItemSchema[] = [tradingCardV1];
export function getItemSchema(item: PassportItem) {
	const normalized = item;
	return itemSchemas.find(
		(schema) =>
			schema.type === normalized.type &&
			schema.version === normalized.schemaVersion,
	);
}
export function itemCategoryLabel(category: string) {
	return Object.hasOwn(itemCategories, category)
		? itemCategories[category as keyof typeof itemCategories]
		: category;
}
function object(value: unknown): Record<string, unknown> {
	if (!value || typeof value !== "object" || Array.isArray(value))
		throw new Error("Enter structured item details.");
	return value as Record<string, unknown>;
}
function readVersionedItem(value: unknown): VersionedItem {
	const data = object(value);
	if (
		typeof data.type !== "string" ||
		!/^[a-z][a-z0-9-]{0,63}$/.test(data.type) ||
		!Number.isSafeInteger(data.schemaVersion) ||
		Number(data.schemaVersion) < 1 ||
		typeof data.category !== "string" ||
		!/^[a-z][a-z0-9-]{0,63}$/.test(data.category)
	)
		throw new Error("Invalid item type, version or category.");
	const attributes = object(data.attributes);
	if (Object.keys(attributes).length > 50)
		throw new Error("Too many item attributes.");
	for (const [key, value] of Object.entries(attributes)) {
		if (
			!/^[a-z][a-zA-Z0-9]{0,63}$/.test(key) ||
			!["string", "number", "boolean"].includes(typeof value) ||
			(typeof value === "number" && !Number.isFinite(value)) ||
			(typeof value === "string" &&
				(value.length > 500 || /\p{Cc}/u.test(value)))
		)
			throw new Error(`Invalid item attribute: ${key}.`);
	}
	return {
		type: data.type,
		schemaVersion: Number(data.schemaVersion),
		category: data.category,
		attributes: { ...attributes } as Record<string, AttributeValue>,
	};
}
// Issuance accepts supported schemas only; readers can display future schemas.
export function parsePassportItem(value: unknown): VersionedItem {
	const item = readVersionedItem(value);
	const schema = getItemSchema(item);
	if (!schema) throw new Error("Unsupported item type or schema version.");
	if (!schema.categories.includes(item.category))
		throw new Error("Choose a valid category.");
	if (
		Object.keys(item.attributes).some(
			(key) => !schema.fields.some((field) => field.key === key),
		)
	)
		throw new Error("Unknown item attribute.");
	const attributes: Record<string, AttributeValue> = {};
	for (const field of schema.fields) {
		const value = item.attributes[field.key];
		if (field.type === "text") {
			if (value !== undefined && typeof value !== "string")
				throw new Error(`Invalid ${field.label}.`);
			const text = typeof value === "string" ? value.trim() : "";
			if (text.length > (field.maxLength ?? 500) || (field.required && !text))
				throw new Error(`Enter a valid ${field.label}.`);
			attributes[field.key] = text;
		} else if (value !== undefined) {
			if (typeof value !== (field.type === "number" ? "number" : "boolean"))
				throw new Error(`Invalid ${field.label}.`);
			attributes[field.key] = value;
		} else if (field.required) throw new Error(`Enter ${field.label}.`);
	}
	schema.validate(attributes);
	return { ...item, attributes };
}
export function readPassportItem(value: unknown): PassportItem {
	const item = readVersionedItem(value);
	return getItemSchema(item) ? parsePassportItem(item) : item;
}
export function itemDisplayTitle(
	item: PassportItem,
	format: TitleFormat = "full",
) {
	const normalized = item;
	return (
		getItemSchema(item)?.title(normalized.attributes, format) ??
		`${itemCategoryLabel(normalized.category)} — ${normalized.type}`
	);
}
export function itemAttributeDetails(item: PassportItem) {
	const normalized = item,
		schema = getItemSchema(item);
	const fields: readonly ItemField[] =
		schema?.fields ??
		Object.keys(normalized.attributes).map((key) => ({
			key,
			label: key.replace(/([a-z])([A-Z])/g, "$1 $2"),
			type: "text" as const,
		}));
	return fields
		.filter(
			(field) =>
				normalized.attributes[field.key] !== undefined &&
				normalized.attributes[field.key] !== "",
		)
		.map((field) => ({
			label: field.label,
			value: `${typeof normalized.attributes[field.key] === "boolean" ? (normalized.attributes[field.key] ? "Yes" : "No") : normalized.attributes[field.key]}${field.unit ? ` ${field.unit}` : ""}`,
		}));
}
export function itemMetadataAttributes(item: PassportItem) {
	const normalized = item,
		schema = getItemSchema(item);
	const fields =
		schema?.fields ??
		Object.keys(normalized.attributes).map((key) => ({ key, label: key }));
	return [
		{ trait_type: "Category", value: itemCategoryLabel(item.category) },
		...fields.map((field) => ({
			trait_type: field.label,
			value: normalized.attributes[field.key] ?? "",
		})),
	];
}
export function passportDisplayTitle(
	passport: { item?: PassportItem; title: string },
	format: TitleFormat = "full",
) {
	return passport.item && getItemSchema(passport.item)
		? itemDisplayTitle(passport.item, format)
		: passport.title;
}
