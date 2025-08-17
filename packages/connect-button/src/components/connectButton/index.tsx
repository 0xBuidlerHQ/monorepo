"use client";

import { useConnectButton } from "@ethos/connect-button/hooks/useConnectButton";
import { Format } from "@ethos/core/index";
// import { Format } from "@ethos/core";
import { Button } from "@ethos/ui/shadcn/components/button";
import { Box } from "@ethos/ui/system/base/box";
// import { Desktop, Mobile } from "@ethos/ui/system/layouts/screens";
import { H3, H5 } from "@ethos/ui/system/base/typography";
import { animated, useSpring, useTransition } from "@react-spring/web";
import { blo } from "blo";
import { Wallet2 } from "lucide-react";
import { createBreakpoint } from "react-use";

const BUTTON_HEIGHT = "40px";

const CONNECT_BUTTON_WIDTH = "170px";
const WRONG_NETWORK_WIDTH = "150px";

const ACCOUNT_BUTTON_WIDTH = "170px";
const ACCOUNT_BUTTON_MOBILE_WIDTH = "70px";

const useBreakpoint = createBreakpoint();

const ConnectedButton = () => {
	// const accountDrawer = useConnectButton((s) => s.accountDrawer);
	const props = useConnectButton((s) => s.props);

	return (
		<Box className="flex gap-2 w-full h-full">
			<Box
				onClick={props.cb.onDisconnect}
				className="bg-background w-full flex justify-center items-center p-1 overflow-hidden cursor-pointer hover:bg-muted transition-colors"
			>
				{props.eoa.address && (
					<Box className="flex items-center justify-center p-[3px] gap-2">
						<Box className="size-5 overflow-hidden rounded-full">
							<img alt="" src={blo(props.eoa.address as `0x${string}`)} />
						</Box>

						<H5 className="mr-2 font-geist-mono">{Format.FormatEvmAddress(props.eoa.address)}</H5>
					</Box>
				)}
			</Box>
		</Box>
	);
};

const DisconnectedButton = () => {
	const connectButton = useConnectButton((s) => s.props);

	return (
		<Button
			variant="secondary"
			onClick={connectButton.cb.onConnect}
			className="flex items-center gap-2 w-full h-full cursor-pointer rounded-none"
		>
			<Wallet2 className="size-4" />
			<H5 className="font-normal">Connect Wallet</H5>
		</Button>
	);
};

const Connecting = () => {
	const connectButton = useConnectButton((s) => s.props);

	return (
		<Box className="w-full h-full bg-background flex justify-center items-center">
			<H5 className="font-medium">Connecting ...</H5>
		</Box>
	);
};

const WrongNetwork = () => {
	const connectButton = useConnectButton((s) => s.props);

	return (
		<Button
			onClick={connectButton.cb.onWrongNetwork}
			className="flex items-center gap-2 w-full h-full bg-red-500 hover:bg-red-500"
		>
			<H3>Switch Network</H3>
		</Button>
	);
};

const ConnectButton = () => {
	const props = useConnectButton((s) => s.props);

	const breakpoint = useBreakpoint();
	const isMobile = breakpoint === "tablet";

	const transitions = useTransition(props.status, {
		from: { opacity: 0, transform: "translateX(5px)" },
		enter: { opacity: 1, transform: "translateX(0px)" },
		leave: { opacity: 0, transform: "translateX(-5px)" },
	});

	const isNetworkUnsupported = props.status === "connected" && props.isNetworkUnsupported;

	const springy = useSpring({
		height: BUTTON_HEIGHT,
		width: (() => {
			if (isNetworkUnsupported) return WRONG_NETWORK_WIDTH;

			if (props.status === "connected") {
				if (isMobile) return ACCOUNT_BUTTON_MOBILE_WIDTH;
				return ACCOUNT_BUTTON_WIDTH;
			}
			return CONNECT_BUTTON_WIDTH;
		})(),
	});

	return (
		<animated.div className="relative" style={{ ...springy }}>
			{transitions((style, status) => (
				<animated.div className="absolute h-full w-full" style={{ ...style }}>
					{(() => {
						switch (status) {
							case "connected":
								return isNetworkUnsupported ? <WrongNetwork /> : <ConnectedButton />;
							case "disconnected":
								return <DisconnectedButton />;
							case "connecting":
								return <Connecting />;
						}
					})()}
				</animated.div>
			))}
		</animated.div>
	);
};

export { ConnectButton };
