import { defineConfig } from "@wagmi/cli";
import { hardhat, react } from "@wagmi/cli/plugins";

export default defineConfig({
	out: "lib/index.tsx",
	plugins: [
		hardhat({
			project: ".",
		}),
		//
		react(),
	],
});
