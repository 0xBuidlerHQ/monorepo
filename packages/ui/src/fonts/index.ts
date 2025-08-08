import { Noto_Sans_Display, Noto_Sans_Mono } from "next/font/google";

const notoSans = Noto_Sans_Display({
	subsets: ["latin"],
	variable: "--font-noto-sans-display",
	display: "swap",
});

const notoSansMono = Noto_Sans_Mono({
	subsets: ["latin"],
	variable: "--font-noto-sans-mono",
	display: "swap",
});

export { notoSans, notoSansMono };
