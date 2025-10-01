"use server";

import { expAbi, expContract, mockServerAccount, mockServerKey } from "@config/constants";
import { client } from "@server/configs/web3";
import { Value } from "ox";
import { Chains, RelayActions } from "porto";
import { type Address, encodeFunctionData } from "viem";

const mintOnBehalf = async (address: Address) => {
	console.log(client);
	await RelayActions.upgradeAccount(client, {
		account: mockServerAccount,
		chain: Chains.baseSepolia,
	});

	const dataMint = encodeFunctionData({
		abi: expAbi,
		functionName: "mint",
		args: [address, Value.fromEther("1")],
	});

	await RelayActions.sendCalls(client, {
		account: mockServerAccount,
		chain: Chains.baseSepolia,
		calls: [{ to: expContract.address, data: dataMint }],
		key: mockServerKey,
	});

	console.log("Executed on behalf");
};

export { mintOnBehalf };
