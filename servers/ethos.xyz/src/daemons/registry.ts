import type { Nomos } from "@0xbuidlerhq/package-ethos.xyz";
import type { UnknownActorLogic } from "xstate";
import { AaveDaemon } from "@/daemons/daemon.js";
import type { DaemonStep } from "@/daemons/factory.js";

type Daemonn<N extends Nomos.Nomos> = {
	actors: Record<keyof N["states"], UnknownActorLogic>;
	states: Record<keyof N["states"], DaemonStep<N>>;
};

type NomosRegistryType = typeof Nomos.NomosRegistry;

const DaemonRegistry: {
	[K in keyof NomosRegistryType]: Daemonn<NomosRegistryType[K]>;
} = {
	"nomos-0x-aave": AaveDaemon,
} as const;

const getDaemon = (id: Nomos.NomosId): Daemonn<Nomos.Nomos> | undefined => {
	return (DaemonRegistry as unknown as Record<string, Daemonn<Nomos.Nomos>>)[id];
};
export { DaemonRegistry, getDaemon };
