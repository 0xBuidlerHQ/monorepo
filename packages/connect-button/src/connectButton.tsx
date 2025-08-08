"use client";

import { ConnectButton as ConnectButtonPrimitive } from "@ethos/connect-button/components/connectButton";
import {
	type ConnectButtonStore,
	useConnectButton,
} from "@ethos/connect-button/hooks/useConnectButton";
import "@ethos/ui/globals.css";
import React from "react";

/**
 * @dev
 */
const useEffectSetConnectButtonProps = (props: ConnectButtonStore["props"]) => {
	const setConnectButton = useConnectButton((s) => s.setConnectButton);
	React.useEffect(() => setConnectButton(props), [props, setConnectButton]);
};

const ConnectButton = (props: ConnectButtonStore["props"]) => {
	useEffectSetConnectButtonProps(props);

	return <ConnectButtonPrimitive />;
};

export { ConnectButton };
