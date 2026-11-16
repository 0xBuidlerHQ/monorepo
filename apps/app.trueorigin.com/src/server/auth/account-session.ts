import "server-only";

import { browserAccountConfig } from "@0xhq/trueorigin-sdk/rpc";
import { cache } from "react";
import { sessionIdentity } from "./session";

export const initialAccountSession = cache(async () => ({
	identity: await sessionIdentity(),
	config: browserAccountConfig(),
}));
