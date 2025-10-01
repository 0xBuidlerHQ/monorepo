import { defineConfig } from "tsup";

export default defineConfig({
	entry: ["src/**/*.ts"],
	sourcemap: true,
	clean: true,
	format: "esm",
	dts: true,
	platform: "neutral",
	target: "es2024",
	external: [],
});
