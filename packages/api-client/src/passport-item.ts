export const itemUniverses = {
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
	universe: string;
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
	universes: readonly string[];
	fields: readonly ItemField[];
	validate: (attributes: Record<string, AttributeValue>) => void;
	title: (
		attributes: Record<string, AttributeValue>,
		format: TitleFormat,
	) => string;
};
const sealedField: ItemField = {
	key: "sealed",
	label: "Factory sealed",
	type: "boolean",
};
const cardV1: ItemSchema = {
	type: "card",
	version: 1,
	label: "Card",
	universes: Object.keys(itemUniverses),
	fields: [
		sealedField,
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
const bookV1: ItemSchema = {
	type: "book",
	version: 1,
	label: "Book",
	universes: Object.keys(itemUniverses),
	fields: [
		sealedField,
		{
			key: "title",
			label: "Title",
			type: "text",
			required: true,
			maxLength: 200,
		},
		{
			key: "author",
			label: "Author",
			type: "text",
			required: true,
			maxLength: 200,
		},
		{ key: "isbn", label: "ISBN", type: "text", maxLength: 17 },
		{ key: "edition", label: "Edition", type: "text", maxLength: 100 },
		{ key: "publisher", label: "Publisher", type: "text", maxLength: 100 },
	],
	validate() {},
	title(attributes, format) {
		return format === "short"
			? String(attributes.title)
			: `${attributes.title} — ${attributes.author}`;
	},
};
const boxV1: ItemSchema = {
	type: "box",
	version: 1,
	label: "Box",
	universes: Object.keys(itemUniverses),
	fields: [
		sealedField,
		{
			key: "name",
			label: "Name",
			type: "text",
			required: true,
			maxLength: 200,
		},
		{ key: "set", label: "Set", type: "text", maxLength: 100 },
		{
			key: "format",
			label: "Product format",
			type: "text",
			required: true,
			maxLength: 100,
			placeholder: "Booster box",
		},
		{ key: "edition", label: "Edition", type: "text", maxLength: 100 },
		{ key: "language", label: "Language", type: "text", maxLength: 100 },
	],
	validate() {},
	title(attributes, format) {
		return format === "short" || !attributes.set
			? String(attributes.name)
			: `${attributes.name} — ${attributes.set}`;
	},
};
// Each type defines the identity fields shared by its catalogue entries.
export const itemSchemas: readonly ItemSchema[] = [cardV1, bookV1, boxV1];
export function itemTypeLabel(item: PassportItem) {
	return getItemSchema(item)?.label ?? item.type;
}
export function getItemSchema(item: PassportItem) {
	const normalized = item;
	return itemSchemas.find(
		(schema) =>
			schema.type === normalized.type &&
			schema.version === normalized.schemaVersion,
	);
}
export function itemUniverseLabel(universe: string) {
	return Object.hasOwn(itemUniverses, universe)
		? itemUniverses[universe as keyof typeof itemUniverses]
		: universe;
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
		typeof data.universe !== "string" ||
		!/^[a-z][a-z0-9-]{0,63}$/.test(data.universe)
	)
		throw new Error("Invalid item type, version or universe.");
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
		universe: data.universe,
		attributes: { ...attributes } as Record<string, AttributeValue>,
	};
}
// Issuance accepts supported schemas only; readers can display future schemas.
export function parsePassportItem(value: unknown): VersionedItem {
	const item = readVersionedItem(value);
	const schema = getItemSchema(item);
	if (!schema) throw new Error("Unsupported item type or schema version.");
	if (!schema.universes.includes(item.universe))
		throw new Error("Choose a valid universe.");
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
		`${itemUniverseLabel(normalized.universe)} — ${normalized.type}`
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
		{ trait_type: "Universe", value: itemUniverseLabel(item.universe) },
		{ trait_type: "Type", value: itemTypeLabel(item) },
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
