import { Hooks } from "porto/wagmi";

const usePortoActions = () => {
	const addFunds = Hooks.useAddFunds({});
	const grantPermissions = Hooks.useGrantPermissions({});
	const upgradeAccount = Hooks.useUpgradeAccount({});

	return { addFunds, grantPermissions, upgradeAccount };
};

const usePorto = () => {
	const permissions = Hooks.usePermissions({});

	return { permissions };
};

export { usePortoActions, usePorto };
