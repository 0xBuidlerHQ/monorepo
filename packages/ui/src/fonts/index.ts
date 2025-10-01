import {
	Montserrat,
	Noto_Sans,
	Noto_Sans_Display,
	Noto_Sans_Mono,
	Noto_Sans_Yi,
	Noto_Serif,
	Work_Sans,
} from "next/font/google";

/**
 * @dev
 */
const workSans = Work_Sans({
	subsets: ["latin"],
	variable: "--font-work-sans",
	display: "swap",
});

/**
 * @dev
 */
const montserrat = Montserrat({
	subsets: ["latin"],
	variable: "--font-montserrat",
	display: "swap",
});

/**
 * @dev
 */
const notoSerif = Noto_Serif({
	subsets: ["latin"],
	variable: "--font-noto-serif",
	display: "swap",
	weight: ["400"],
});

const notoSans = Noto_Sans({
	subsets: ["latin"],
	variable: "--font-noto-sans",
	display: "swap",
});

const notoSansDisplay = Noto_Sans_Display({
	subsets: ["latin"],
	variable: "--font-noto-sans-display",
	display: "swap",
});

const notoSansMono = Noto_Sans_Mono({
	subsets: ["latin"],
	variable: "--font-noto-sans-mono",
	display: "swap",
});

const notoSansYi = Noto_Sans_Yi({
	subsets: ["latin"],
	variable: "--font-noto-sans-yi",
	display: "swap",
	weight: ["400"],
});

export { montserrat, notoSans, notoSansDisplay, notoSansMono, notoSansYi, notoSerif, workSans };
