import {
	Inter,
	Montserrat,
	Noto_Sans,
	Noto_Sans_Display,
	Noto_Sans_Mono,
	Noto_Sans_Yi,
	Noto_Serif,
	Space_Grotesk,
	Syne,
	Syne_Mono,
	Syne_Tactile,
	TASA_Orbiter,
	Work_Sans,
} from "next/font/google";

/**
 * @dev Inter.
 */
const inter = Inter({
	subsets: ["latin"],
	variable: "--font-inter",
	display: "swap",
});

/**
 * @dev Work.
 */
const workSans = Work_Sans({
	subsets: ["latin"],
	variable: "--font-work-sans",
	display: "swap",
});

/**
 * @dev Montserrat.
 */
const montserrat = Montserrat({
	subsets: ["latin"],
	variable: "--font-montserrat",
	display: "swap",
});

/**
 * @dev Space Grotesk.
 */
const spaceGrotesk = Space_Grotesk({
	subsets: ["latin"],
	variable: "--font-space-grotesk",
	display: "swap",
});

/**
 * @dev TASA Orbiter.
 */
const tasaOrbiter = TASA_Orbiter({
	subsets: ["latin"],
	variable: "--font-tasa-orbiter",
	display: "swap",
	weight: ["400"],
});

/**
 * @dev TASA Orbiter.
 */
const syne = Syne({
	subsets: ["latin"],
	variable: "--font-syne",
	display: "swap",
});

/**
 * @dev TASA Orbiter.
 */
const syneMono = Syne_Mono({
	subsets: ["latin"],
	variable: "--font-syne-mono",
	display: "swap",
	weight: ["400"],
});

/**
 * @dev TASA Orbiter.
 */
const syneTactile = Syne_Tactile({
	subsets: ["latin"],
	variable: "--font-syne-tactile",
	display: "swap",
	weight: ["400"],
});

/**
 * @dev Noto.
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

export {
	montserrat,
	notoSans,
	notoSansDisplay,
	notoSansMono,
	notoSansYi,
	notoSerif,
	workSans,
	inter,
	spaceGrotesk,
	tasaOrbiter,
	syne,
	syneMono,
	syneTactile,
};
