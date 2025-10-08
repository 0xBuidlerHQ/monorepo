import type { Nomos, Praxis } from "@0xbuidlerhq/package-ethos.xyz";
import type { NomosRegistry } from "@/core/nomos/index.js";
import { praxis as Praxis0xAave } from "@/core/praxis/[nomos-0x-aave]/index.js";

type NomosRegistryType = typeof NomosRegistry;

const PraxisRegistry: {
	[K in keyof NomosRegistryType]: Praxis.Praxis<NomosRegistryType[K]>;
} = {
	"nomos-0x-aave": Praxis0xAave,
} as const;

const getPraxis = (id: Nomos.NomosId): Praxis.Praxis<Nomos.Nomos> | undefined => {
	return (PraxisRegistry as any)[id];
};

export { PraxisRegistry, getPraxis };
