import { MagicIcon } from "@/components/icons/magic-icon";
import { OnePieceIcon } from "@/components/icons/one-piece-icon";
import { PikachuIcon } from "@/components/icons/pikachu-icon";
import { YugiohIcon } from "@/components/icons/yugioh-icon";

export const collections = [
	{ name: "Pokemon", href: "/explore/cards/pokemon", icon: PikachuIcon },
	{ name: "Yu-Gi-Oh!", href: "/yugioh", icon: YugiohIcon },
	{ name: "Magic", href: "/magic", icon: MagicIcon },
	{ name: "One Piece", href: "/one-piece", icon: OnePieceIcon },
] as const;

export const navigationItems = [
	{ name: "Home", href: "/", icon: HomeIcon },
	{ name: "Explore", href: "/explore", icon: ExploreIcon },
	{ name: "My Collection", href: "/collection", icon: CollectionIcon },
	{ name: "Verify", href: "/verify", icon: VerifyIcon },
	{ name: "Transfers", href: "/transfers", icon: TransfersIcon },
	...collections,
] as const;

export type CollectionName = (typeof navigationItems)[number]["name"];
import { CollectionIcon } from "@/components/icons/collection-icon";
import { TransfersIcon } from "@/components/icons/transfers-icon";
import { VerifyIcon } from "@/components/icons/verify-icon";
import { HomeIcon } from "@/components/icons/home-icon";
import { ExploreIcon } from "@/components/icons/explore-icon";
