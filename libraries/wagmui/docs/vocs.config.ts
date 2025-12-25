import tsconfigPaths from "vite-tsconfig-paths";
import { defineConfig } from "vocs";

export default defineConfig({
	title: "Docs",
	rootDir: ".",
	vite: {
		plugins: [tsconfigPaths()],
	},
	sidebar: [
		{
			text: "Getting Started",
			link: "/docs",
		},
	],
	socials: [
		{
			icon: "github",
			link: "https://github.com/0xbuidler",
		},
		{
			icon: "x",
			link: "https://x.com/maximeisalive",
		},
	],
});
