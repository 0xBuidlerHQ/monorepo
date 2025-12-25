import { createConnectButton } from "@0xbuidlerhq/connect-button";

enum ActionId {}

type ActionStepBase = {
	id: ActionId;
	type: string;
	label: string;
};

type ActionStepSuccess = { link: string };
type ActionStepError = { msg: string };

const {
	useConnectButton,
	useConnectButtonActions,
	createConnectButtonActionStep,
	ActionSuccess,
	ActionError,
} = createConnectButton<{
	ActionStepBase: ActionStepBase;
	ActionStepSuccess: ActionStepSuccess;
	ActionStepError: ActionStepError;
}>();

export {
	useConnectButton,
	ActionId,
	useConnectButtonActions,
	createConnectButtonActionStep,
	ActionSuccess,
	ActionError,
	type ActionStepBase,
	type ActionStepSuccess,
	type ActionStepError,
};
