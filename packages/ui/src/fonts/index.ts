import { Noto_Sans, Noto_Sans_Display, Noto_Sans_Mono, Noto_Sans_Yi } from "next/font/google";

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

export { notoSans, notoSansDisplay, notoSansMono, notoSansYi };
