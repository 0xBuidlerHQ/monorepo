import type { Nomos } from "@0xbuidlerhq/package-ethos.xyz";
import { nomos as Nomos0xAave } from "@/core/nomos/[nomos-0x-aave]/index.js";

/**
 * @dev
 */
const NomosRegistry = {
	"nomos-0x-aave": Nomos0xAave,
} as const satisfies { [key: Nomos.NomosId]: Nomos.Nomos };

/**
 * @dev
 */
const getNomos = (id: Nomos.NomosId) =>
	(NomosRegistry as { [key: Nomos.NomosId]: Nomos.Nomos })[id];

export { NomosRegistry, getNomos };
