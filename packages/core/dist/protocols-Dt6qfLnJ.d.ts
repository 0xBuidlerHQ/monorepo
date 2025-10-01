import * as react_jsx_runtime from 'react/jsx-runtime';
import * as react from 'react';
import { z } from 'zod';

/**
 * @dev List of all the {Protocols} the app interact with.
 */
declare const zProtocolId: z.ZodEnum<["aave"]>;
type ProtocolId = z.infer<typeof zProtocolId>;
declare const zProtocolName: z.ZodUnion<any>;
/**
 * @dev
 */
declare const protocolMetadata: (protocolId: ProtocolId | undefined) => {
    id: "aave";
    name: "AAVE";
    website: "https://aave.com";
    Logo: (props: react.SVGProps<SVGSVGElement>) => react_jsx_runtime.JSX.Element;
} | undefined;
type ProtocolMetadata = NonNullable<ReturnType<typeof protocolMetadata>>;

type protocols_ProtocolId = ProtocolId;
type protocols_ProtocolMetadata = ProtocolMetadata;
declare const protocols_protocolMetadata: typeof protocolMetadata;
declare const protocols_zProtocolName: typeof zProtocolName;
declare namespace protocols {
  export { type protocols_ProtocolId as ProtocolId, type protocols_ProtocolMetadata as ProtocolMetadata, protocols_protocolMetadata as protocolMetadata, protocols_zProtocolName as zProtocolName };
}

export { type ProtocolId as P, protocolMetadata as a, type ProtocolMetadata as b, protocols as p, zProtocolName as z };
