import _0xBuidlerHQPng from "./0xbuidlerhq.png";
import BetterLidoPng from "./betterlido.png";
import DexPairsView from "./dexpairsview.png";
import UtilityAfPng from "./utilityaf.png";
import wagmuiPng from "./wagmui.png";

const https = "https://";
const baseUrl = "0xbuidlerhq.com";

const Projects = [
	{
		id: "0_0xbuidlerhq",
		name: "0xBuidlerHQ",
		url: `${https}${baseUrl}`,
		img: _0xBuidlerHQPng,
		description: "Studio hub for experiments.",
		stack: {
			web: ["React", "Typescript"],
		},
	},
	{
		id: "1_betterlido",
		name: "BetterLido",
		url: `${https}betterlido.${baseUrl}`,
		img: BetterLidoPng,
		description: "A better experience for the Lido ecosystem with a sharper UX.",
		stack: {
			web: ["React", "Typescript"],
			crypto: ["Wagmi", "Viem"],
			animation: ["Motion"],
		},
	},
	{
		id: "2_wagmui",
		name: "Wagmui",
		url: `${https}wagmui.${baseUrl}`,
		img: wagmuiPng,
		description: "Composable formatting helpers and React hooks for polished web3 interfaces.",
		stack: {
			web: ["React", "Typescript"],
			animation: ["Motion"],
			library: true,
		},
	},
	{
		id: "3_utility",
		name: "UtilityAf",
		url: `${https}utilityaf.${baseUrl}`,
		img: UtilityAfPng,
		description: "A set of lean utilities to get work done fast.",
		stack: {
			web: ["React", "Typescript"],
			animation: ["Motion"],
		},
	},
	{
		id: "4_dexpairsview",
		name: "Dex Pairs View",
		url: `${https}dexpairsview.${baseUrl}`,
		img: DexPairsView,
		description: "Search engine for Dex Pairs.",
		stack: {
			web: ["React", "Typescript"],
			animation: ["Motion"],
		},
	},
];

export { Projects };
