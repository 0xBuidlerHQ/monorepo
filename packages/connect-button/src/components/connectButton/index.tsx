"use client";

import { useConnectButton } from "@ethos/connect-button/hooks/useConnectButton";
// import { Format } from "@ethos/core";
import { Button } from "@ethos/ui/shadcn/components/button";
import { Box } from "@ethos/ui/system/base/box";
// import { Desktop, Mobile } from "@ethos/ui/system/layouts/screens";
import { H3, H5 } from "@ethos/ui/system/base/typography";
import { animated, useSpring, useTransition } from "@react-spring/web";
import { Wallet2 } from "lucide-react";
import { createBreakpoint } from "react-use";

const BUTTON_HEIGHT = "40px";

const CONNECT_BUTTON_WIDTH = "160px";
const WRONG_NETWORK_WIDTH = "150px";

const ACCOUNT_BUTTON_WIDTH = "198px";
const ACCOUNT_BUTTON_MOBILE_WIDTH = "70px";

const useBreakpoint = createBreakpoint();

const ConnectedButton = () => {
	// const accountDrawer = useConnectButton((s) => s.accountDrawer);
	const props = useConnectButton((s) => s.props);

	return (
		<Box className="flex gap-2 w-full h-full">
			<Box
				onClick={props.cb.onDisconnect}
				className="border rounded-full bg-background w-full flex justify-between p-1 overflow-hidden cursor-pointer hover:bg-muted transition-colors duration-300"
			>
				<Box className="grow relative flex items-center justify-center">
					<Box className="bg-primary rounded-full p-1 size-4">
						<Box className="size-2 bg-secondary rounded-full" />
					</Box>
				</Box>

				{/* ici */}
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
			className="flex items-center gap-2 w-full h-full"
		>
			<Wallet2 className="size-4" />
			<H5>Connect Wallet</H5>
		</Button>
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
		from: { opacity: 0, transform: "translateX(10px)" },
		enter: { opacity: 1, transform: "translateX(0px)" },
		leave: { opacity: 0, transform: "translateX(-10px)" },
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
						}
					})()}
				</animated.div>
			))}
		</animated.div>
	);
};

export { ConnectButton };

// ici
// {props.eoa.address && (
// 					<>
// 						{/**
// 						 *
// 						 * @dev Desktop / Mobile.
// 						 *
// 						 */}
// 						<Desktop>
// 							<Box className="flex bg-muted rounded-full items-center justify-center p-[3px] gap-2">
// 								<Box className="size-5 rounded-full overflow-hidden">
// 									<img alt="" src={blo(props.eoa.address as `0x${string}`)} />
// 								</Box>

// 								<H3 className="mr-2 font-geist-mono">
// 									{Format.FormatEvmAddress(props.eoa.address)}
// 								</H3>
// 							</Box>
// 						</Desktop>

// 						<Mobile>
// 							<Box className="flex bg-muted rounded-full items-center justify-center p-[3px] gap-2">
// 								<Box className="size-5 rounded-full overflow-hidden">
// 									<img alt="" src={blo(props.eoa.address as `0x${string}`)} />
// 								</Box>
// 							</Box>
// 						</Mobile>
// 					</>
// 				)}
