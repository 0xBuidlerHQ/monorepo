import "server-only";

import { browserAccountConfig } from "@0xhq/contracts.trueorigin.com/rpc";
import { cache } from "react";
import { sessionIdentity } from "./session";

export const initialAccountSession = cache(async () => ({
	identity: await sessionIdentity(),
	config: browserAccountConfig(),
}));
