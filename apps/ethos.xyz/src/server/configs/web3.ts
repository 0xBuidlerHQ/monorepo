import { Porto } from "porto";
import { createClient, custom } from "viem";
import { portoConfig } from "../../config/porto";

const porto = Porto.create(portoConfig);

const client = createClient({
	transport: custom(porto.provider),
});

export { porto, client };
