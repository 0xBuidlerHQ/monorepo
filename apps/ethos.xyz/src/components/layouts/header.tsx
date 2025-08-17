"use client";

import { LogoEthos } from "@ethos/assets/crypto/ethos/Logo";
import { Format } from "@ethos/core/index";
import { useTheme } from "@ethos/ui/providers/theme";
import { Separator } from "@ethos/ui/shadcn/components/separator";
import { cn } from "@ethos/ui/shadcn/lib/utils";
import { Box } from "@ethos/ui/system/base/box";
import { H4, H5 } from "@ethos/ui/system/base/typography";
import { Header as HeaderPrimitive } from "@ethos/ui/system/layouts/header";
import { type IconType, SiBitcoin, SiEthereum } from "@icons-pack/react-simple-icons";
import { Moon, Settings, Sun } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { PAGES } from "@/configs/pages";
import { ConnectButton } from "@/connectButton";
import { useTokenPricesBySymbol } from "@/hooks/queries/useTokenPricesBySymbol";
import { useWeb3 } from "@/providers/web3";

const ConnectButtonWrapper = () => {
	const { connect, disconnect, eoa, networkMetadata, status, provider, isNetworkUnsupported } =
		useWeb3();

	return (
		<ConnectButton
			status={status}
			eoa={{ address: eoa?.address! }}
			network={networkMetadata}
			isNetworkUnsupported={isNetworkUnsupported}
			cb={{
				onConnect: () => connect(),
				onDisconnect: () => disconnect(),
				onWrongNetwork: () => {}, // switchChain({ chainId: chains[0].id })
			}}
			provider={{
				name: provider.name!,
				img: provider.image!,
			}}
		/>
	);
};

type HeaderTitleProps = {
	label: string;
	href: string;
};
const HeaderTitle = ({ label, href }: HeaderTitleProps) => {
	const pathname = usePathname();

	const isActive = pathname.includes(label.toLowerCase());

	return (
		<Link href={href}>
			<H5
				className={cn(
					"cursor-pointer px-1 py-1 h-7 rounded-tl-md rounded-bl-xs rounded-tr-xs rounded-br-md flex items-center font-regular",
					"duration-500 transition-all hover:bg-muted hover:px-5 tracking-tighter font-noto-sans-display",
					"hover:rounded-tl-lg hover:rounded-bl-md hover:rounded-tr-md hover:rounded-br-lg",
					isActive && "bg-primary text-primary-foreground px-6 font-medium hover:bg-primary",
				)}
			>
				{label}
			</H5>
		</Link>
	);
};

type HeaderCryptoPriceProps = {
	Icon: IconType;
	price?: string;
};
const HeaderCryptoPrice = ({ Icon, price }: HeaderCryptoPriceProps) => {
	return (
		<Box className="flex gap-2 items-center">
			<Icon className="size-4 rounded" />
			<h6 className="font-medium text-[12px] font-noto-sans-display">{price}</h6>
		</Box>
	);
};

const Header = () => {
	const { theme, setTheme } = useTheme();

	const { tokenPricesBySymbol } = useTokenPricesBySymbol({ symbols: ["BTC", "ETH"] });

	return (
		<Box className=" bg-muted flex flex-col">
			<HeaderPrimitive className="h-10 border-y border-accent">
				<Box className="border-x border-accent flex items-stretch">
					{/*  */}
					<Box className="flex flex-end border-r border-accent *:not-last:border-r *:not-last:border-accent">
						<Box className="h-full flex items-center p-1 gap-1">
							<Box className="size-8 flex items-center justify-center bg-foreground rounded-xs p-[2px]">
								<LogoEthos className="invert dark:invert-0" />
							</Box>
						</Box>
					</Box>

					<Box className="m-auto px-2">
						<H4 className="font-bold tracking-tighter">Ethos</H4>
					</Box>

					<Box className="flex items-center gap-4">
						<Box className="h-4">
							<Separator orientation="vertical" className="bg-accent rounded-2xl" />
						</Box>

						<HeaderCryptoPrice
							Icon={SiEthereum}
							price={Format.FormatUSD.classic(Number(tokenPricesBySymbol?.[1].prices[0].value!))}
						/>

						<Box className="h-4">
							<Separator orientation="vertical" className="bg-accent rounded-2xl" />
						</Box>

						<HeaderCryptoPrice
							Icon={SiBitcoin}
							price={Format.FormatUSD.classic(Number(tokenPricesBySymbol?.[0].prices[0].value!))}
						/>
					</Box>

					<Box className="grow" />

					<Box className="flex flex-end border-l border-accent *:not-last:border-r *:not-last:border-accent">
						<ConnectButtonWrapper />

						<Box
							className="group hover:bg-muted hover:cursor-pointer"
							onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
						>
							<Box className="h-full flex items-center p-1">
								<Box className="size-8 flex items-center justify-center">
									<Sun className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0 transform duration-300 group-hover:rotate-12 size-4" />
									<Moon className="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100 transform duration-300 group-hover:rotate-12 size-4" />
								</Box>
							</Box>
						</Box>

						<Box className="hover:bg-muted hover:cursor-pointer">
							<Box className="h-full flex items-center p-1">
								<Box className="size-8 flex items-center justify-center">
									<Settings className="size-4" />
								</Box>
							</Box>
						</Box>
					</Box>
				</Box>
			</HeaderPrimitive>

			<HeaderPrimitive className="h-10 border-b border-accent">
				{/*  */}

				<Box className="border-x border-accent flex items-stretch bg-background h-full">
					<Box className="flex-1">
						<Box className="flex justify-center gap-6 h-full items-center">
							<HeaderTitle label="Create" href={PAGES.create} />
							<HeaderTitle label="Dashboard" href={PAGES.dashboard} />
							<HeaderTitle label="Metrics" href={PAGES.metrics} />
							<HeaderTitle label="Porto" href={"/porto"} /> {/* tmp */}
						</Box>
					</Box>
				</Box>
			</HeaderPrimitive>
		</Box>
	);
};

export { Header };
