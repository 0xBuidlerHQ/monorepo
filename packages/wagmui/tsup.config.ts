import { defineConfig } from "tsup";

export default defineConfig({
	entry: {
		core: "src/core/index.ts",
		react: "src/react/index.tsx",
	},
	format: ["esm", "cjs"],
	dts: true,
	sourcemap: true,
	clean: true,
	treeshake: true,
	splitting: false,
	outDir: "dist",
});
