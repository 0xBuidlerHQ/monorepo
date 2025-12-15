import _0xBuidlerHQPng from "./0xbuidlerhq.png";
import BetterLidoPng from "./betterlido.png";
import UtilityAfPng from "./utilityaf.png";

const https = "https://";
const baseUrl = "0xbuidlerhq.com";

const Projects = [
	{
		id: "0_0xbuidlerhq.xyz",
		name: "0xBuidlerHQ",
		url: `${https}${baseUrl}`,
		img: _0xBuidlerHQPng,
		description:
			"The studio hub for experiments, product drops, and everything built under the 0xBuidlerHQ banner.",
	},
	{
		id: "1_betterlido.xyz",
		name: "BetterLido",
		url: `${https}betterlido.${baseUrl}`,
		img: BetterLidoPng,
		description: "A refined experience for the Lido ecosystem with cleaner flows and sharper UX.",
	},
	{
		id: "2_dusk-explorer.xyz",
		name: "Dusk Explorer",
		url: `${https}betterlido.${baseUrl}`,
		img: BetterLidoPng,
		description:
			"Exploring the darker edges of the stack with purposeful data visuals and controls.",
	},
	{
		id: "3_utility.af",
		name: "Utility.Af",
		url: `${https}utilityaf.${baseUrl}`,
		img: UtilityAfPng,
		description: "A set of lean utilities with bold presentation to get work done fast.",
	},
];

export { Projects };
