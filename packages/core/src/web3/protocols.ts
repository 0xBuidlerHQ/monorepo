import { AAVELogo } from "@0xbuidlerhq/assets/crypto/aave/Logo";
import { z } from "zod";
import { createZodSchemaFromObjectValues } from "../utils";

/**
 * @dev List of all the {Protocols} the app interact with.
 */
const zProtocolId = z.enum(["aave"]);
type ProtocolId = z.infer<typeof zProtocolId>;

/**
 * @dev List of all the {Protocols}'s name.
 */
const ProtocolName = {
	aave: "AAVE",
} as const satisfies { [key in ProtocolId]: string };
const zProtocolName = createZodSchemaFromObjectValues(ProtocolName);

/**
 * @dev List of all the {Protocols}'s logo.
 */
const ProtocolLogo = {
	aave: AAVELogo,
} as const satisfies { [key in ProtocolId]: React.ElementType };

/**
 * @dev List of all the {Protocols}'s website.
 */
const ProtocolWebsite = {
	aave: "https://aave.com",
} as const satisfies { [key in ProtocolId]: string };

/**
 * @dev
 */
const protocolMetadata = (protocolId: ProtocolId | undefined) => {
	if (!protocolId) return undefined;

	if (!zProtocolId.safeParse(protocolId).success) return undefined;

	return {
		id: protocolId,
		name: ProtocolName[protocolId],
		website: ProtocolWebsite[protocolId],

		// Tsx.
		Logo: ProtocolLogo[protocolId],
	};
};
type ProtocolMetadata = NonNullable<ReturnType<typeof protocolMetadata>>;

export {
	// Schemas.
	zProtocolName,
	//
	type ProtocolId,
	protocolMetadata,
	type ProtocolMetadata,
};
