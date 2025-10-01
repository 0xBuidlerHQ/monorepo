import "@0xbuidlerhq/ui/globals.css";

import { ConnectButton } from "@0xbuidlerhq/connect-button/connectButton";

import { useConnectButton } from "@0xbuidlerhq/connect-button/hooks/useConnectButton";

import {
	createConnectButtonStepper,
	type DefaultActionStepBase,
	type DefaultActionStepError,
	type DefaultActionStepSuccess,
} from "@0xbuidlerhq/connect-button/hooks/useConnectButtonActions";

type ConnectButtonActionsOptions = {
	ActionStepBase: DefaultActionStepBase;
	ActionStepSuccess: DefaultActionStepSuccess;
	ActionStepError: DefaultActionStepError;
};

const createConnectButton = <T extends ConnectButtonActionsOptions>() => {
	const {
		useStepperStore: useConnectButtonActions,
		createStep: createConnectButtonActionStep,
		ActionError,
		ActionSuccess,
	} = createConnectButtonStepper<
		T["ActionStepBase"],
		T["ActionStepSuccess"],
		T["ActionStepError"]
	>();

	return {
		ConnectButton,

		useConnectButton,

		useConnectButtonActions,
		createConnectButtonActionStep,
		ActionError,
		ActionSuccess,
	};
};

export { createConnectButton };
