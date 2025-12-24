import tsconfigPaths from "vite-tsconfig-paths";
import { defineConfig } from "vocs";

export default defineConfig({
	title: "Docs",
	rootDir: ".",
	vite: {
		plugins: [tsconfigPaths()],
	},
});
