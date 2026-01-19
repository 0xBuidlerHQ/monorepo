import { CustomConnectButton } from "@0xbuidlerhq/connect-button/connectButton";
import { Format } from "@0xbuidlerhq/core";
import { cn } from "@0xbuidlerhq/ui/shadcn/lib/utils";
import { Box } from "@0xbuidlerhq/ui/system/base/box";
import { ButtonBase } from "@0xbuidlerhq/ui/system/buttons/ButtonBase";
import { useConnectButton } from "@client/connectButton";
import { useWeb3 } from "@client/providers/web3";
import { AnimatePresence, easeOut, type MotionProps, motion } from "motion/react";

const fadeScale: MotionProps = {
	initial: { opacity: 0, scale: 1, x: -12 },
	animate: { opacity: 1, scale: 1, x: 0 },
	exit: { opacity: 0, scale: 1, x: 12 },
	transition: { duration: 0.2, ease: easeOut },
};

const baseClassname = "px-2 py-1 bg-white text-black";

const ConnectedButton = () => {
	const connectButton = useConnectButton((s) => s.props);

	return (
		<ButtonBase onClick={connectButton.cb.onDisconnect}>
			<Box className={cn(baseClassname, "")}>
				{Format.FormatEvmAddress(connectButton.eoa.address)}
			</Box>
		</ButtonBase>
	);
};

const DisconnectedButton = () => {
	const connectButton = useConnectButton((s) => s.props);

	return (
		<ButtonBase onClick={connectButton.cb.onConnect}>
			<Box className={cn(baseClassname, "")}>Connect</Box>
		</ButtonBase>
	);
};

const LoadingButton = () => {
	return <Box className={cn(baseClassname, "")}>Loading ...</Box>;
};

const ConnectButton = () => {
	const { status } = useConnectButton((s) => s.props);

	return (
		<AnimatePresence mode="wait">
			{status === "connected" && (
				<motion.div key="connected" {...fadeScale}>
					<ConnectedButton />
				</motion.div>
			)}

			{status === "disconnected" && (
				<motion.div key="disconnected" {...fadeScale}>
					<DisconnectedButton />
				</motion.div>
			)}

			{status === "connecting" && (
				<motion.div key="loading" {...fadeScale}>
					<LoadingButton />
				</motion.div>
			)}
		</AnimatePresence>
	);
};

const ConnectButtonWrapper = () => {
	const {
		connect,
		disconnect,
		switchToDefaultChain,
		eoa,
		networkMetadata,
		status,
		provider,
		isNetworkUnsupported,
	} = useWeb3();

	return (
		<CustomConnectButton
			status={status}
			eoa={{ address: eoa?.address! }}
			network={networkMetadata}
			isNetworkUnsupported={isNetworkUnsupported}
			cb={{
				onConnect: () => connect(),
				onDisconnect: () => disconnect(),
				onWrongNetwork: () => switchToDefaultChain(),
			}}
			provider={{
				name: provider.name!,
				img: provider.image!,
			}}
		>
			<ConnectButton />
		</CustomConnectButton>
	);
};

export { ConnectButtonWrapper as ConnectButton };
