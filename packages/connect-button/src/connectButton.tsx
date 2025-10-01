"use client";

import { ConnectButton as ConnectButtonPrimitive } from "@0xbuidlerhq/connect-button/components/connectButton";
import {
	type ConnectButtonStore,
	useConnectButton,
} from "@0xbuidlerhq/connect-button/hooks/useConnectButton";
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
