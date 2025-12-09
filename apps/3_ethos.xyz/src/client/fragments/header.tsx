"use client";

import { LogoEthos } from "@0xbuidlerhq/assets/crypto/ethos/Logo";
import { Format } from "@0xbuidlerhq/core/index";
import { Separator } from "@0xbuidlerhq/ui/shadcn/components/separator";
import { cn } from "@0xbuidlerhq/ui/shadcn/lib/utils";
import { Box } from "@0xbuidlerhq/ui/system/base/box";
import { H1, H5, H6 } from "@0xbuidlerhq/ui/system/base/typography";
import { ButtonBase } from "@0xbuidlerhq/ui/system/buttons/ButtonBase";
import { Header as HeaderPrimitive } from "@0xbuidlerhq/ui/system/layouts/header";
import { ConnectButton } from "@client/components/connectButton";
import { Annoucement } from "@client/fragments/annoucement";
import { useTokenPricesBySymbol } from "@client/hooks/queries/useTokenPricesBySymbol";
import { useWeb3 } from "@client/providers/web3";
import { useToggleCmdK, useToggleDevMode } from "@client/stores/modals";
import { PAGES } from "@config/pages";
import { type IconType, SiBitcoin, SiEthereum } from "@icons-pack/react-simple-icons";
import { animated, useTransition } from "@react-spring/web";
import { LoaderCircle } from "lucide-react";
import { usePathname } from "next/navigation";
import React from "react";
import { useWindowScroll } from "react-use";

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

type HeaderCryptoPriceProps = {
	Icon: IconType;
	price?: string;
	isLoading: boolean;
};
const HeaderCryptoPrice = ({ Icon, price, isLoading }: HeaderCryptoPriceProps) => {
	return (
		<Box className="flex gap-2 items-center">
			<Icon className="size-[14px] rounded" />

			<FallbackLoader isLoading={isLoading}>
				<h6 className="font-medium text-[12px] font-numbers">{price}</h6>
			</FallbackLoader>
		</Box>
	);
};

interface FallbackLoaderProps {
	isLoading: boolean;
	children: React.ReactNode;
}

export function FallbackLoader({ isLoading, children }: FallbackLoaderProps) {
	// Transition for crossfade
	const transitions = useTransition(isLoading, {
		from: { opacity: 0 },
		enter: { opacity: 1 },
		leave: { opacity: 0 },
		config: { duration: 500 },
	});

	// Freeze children reference to avoid flickers
	const content = React.useMemo(() => children, [children]);

	return (
		<div className={`relative flex items-center justify-center transition-all`}>
			{/* Invisible sizer to keep parent size correct */}
			<div className="invisible">
				{isLoading ? <LoaderCircle className="size-[14px]" /> : content}
			</div>

			{/* Animated overlapping elements */}
			{transitions((style, isLoading) => (
				<animated.div
					key={isLoading ? "loader" : "content"}
					style={style}
					className="absolute inset-0 flex items-center justify-center"
				>
					{isLoading ? <LoaderCircle className="size-[14px] animate-spin" /> : content}
				</animated.div>
			))}
		</div>
	);
}

const TopTopHeader = () => {
	const { tokenPricesBySymbol, tokenPriceIsPending } = useTokenPricesBySymbol({
		symbols: ["BTC", "ETH"],
	});

	return (
		<Box className="border-y border-accent bg-muted">
			<HeaderPrimitive className="h-6">
				<Box className="border-x border-accent flex items-stretch justify-between h-full bg-muted">
					<Box className="flex items-center gap-3 px-3">
						<HeaderCryptoPrice
							Icon={SiEthereum}
							price={Format.FormatUSD.classic(Number(tokenPricesBySymbol?.[1].prices[0].value!))}
							isLoading={tokenPriceIsPending}
						/>

						<Box className="h-4">
							<Separator orientation="vertical" className="bg-accent rounded-2xl" />
						</Box>

						<HeaderCryptoPrice
							Icon={SiBitcoin}
							price={Format.FormatUSD.classic(Number(tokenPricesBySymbol?.[0].prices[0].value!))}
							isLoading={tokenPriceIsPending}
						/>
					</Box>
				</Box>
			</HeaderPrimitive>
		</Box>
	);
};

type HeaderButtonProps = {
	name: string;
	pathnames: string[];
	href: string;
};
const HeaderButton = (props: HeaderButtonProps) => {
	const { pathnames, href, name } = props;

	const pathname = usePathname();

	const isCurrentPath = pathnames.includes(pathname);
	return (
		<ButtonBase href={href}>
			<H5
				className={cn(
					"font-montserrat tracking-tighter font-semibold px-2 transition-all duration-500 cursor-pointer hover:px-2.5 hover:bg-accent text-[13px]! rounded-none py-[2px] bg-muted text-muted-foreground",
					"hover:bg-muted hover:text-primary",
					isCurrentPath &&
						"bg-primary text-primary-foreground hover:bg-primary hover:text-primary-foreground",
				)}
			>
				{name}
			</H5>
		</ButtonBase>
	);
};

const BottomHeader = () => {
	const toggleCmdK = useToggleCmdK();
	const toggleDevMode = useToggleDevMode();
	const { y } = useWindowScroll();

	const isScrolledDown = y > 32;

	return (
		<Box className="border-b border-accent bg-background">
			<HeaderPrimitive className="h-10">
				<Box className="border-x border-accent w-full h-full flex">
					<Box className="flex border-r border-accent">
						<Box className="flex flex-end border-r border-accent *:not-last:border-r *:not-last:border-accent">
							<Box className="h-full flex items-center p-1 gap-1">
								<Box className="size-8 flex items-center justify-center bg-foreground rounded-xs p-[2px]">
									<LogoEthos className="invert dark:invert-0" />
								</Box>
							</Box>
						</Box>

						<Box
							className={cn(
								"my-auto px-2 flex gap-1 transition-all duration-500",
								isScrolledDown && "px-4",
							)}
						>
							<H1 className="font-bold tracking-tighter font-montserrat">ethos.</H1>
						</Box>
					</Box>

					<Box className="grow h-full px-2">
						<Box className="flex items-center h-full gap-2">
							<HeaderButton
								name="dashboard."
								href={PAGES.homepage}
								pathnames={["/", "/dashboard"]}
							/>

							<HeaderButton name="explore." href={PAGES.explore} pathnames={["/explore"]} />
						</Box>
					</Box>

					<Box className="h-full px-4 border-accent flex items-center">
						<ButtonBase
							className="hover:scale-102 hover:translate-x-0.5 transition duration-500"
							onClick={toggleCmdK.toggle}
						>
							<Box className="flex items-center gap-2 pr-2 pl-3 rounded h-7 bg-muted outline">
								<H6
									className={cn(
										"text-muted-foreground w-20 text-left tracking-tighter font-montserrat font-medium transition-all duration-500",
										isScrolledDown && "w-24",
									)}
								>
									Commands...
								</H6>

								<Box className="flex items-center gap-[2px]">
									<H6 className="size-[18px] text-[10px]! rounded border border-accent/10 bg-white flex items-center justify-center font-montserrat font-semibold">
										⌘
									</H6>

									<H6 className="size-[18px] text-[10px]! rounded border border-accent/10 bg-white flex items-center justify-center font-montserrat font-semibold">
										K
									</H6>
								</Box>
							</Box>
						</ButtonBase>
					</Box>

					<Box className="flex justify-end">
						<Box className="flex border-l border-accent *:not-last:border-r *:not-last:border-accent">
							<ConnectButtonWrapper />
						</Box>
					</Box>
				</Box>
			</HeaderPrimitive>
		</Box>
	);
};

const Header = () => {
	return (
		<Box className="sticky top-0 z-50">
			<Annoucement />
			<TopTopHeader />
			<BottomHeader />
		</Box>
	);
};

export { Header };
