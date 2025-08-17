"use server";

import { Value } from "ox";
import { Chains, Porto, ServerActions } from "porto";
import { type Address, createClient, custom, encodeFunctionData } from "viem";
import { expAbi, expContract, mockServerKey } from "@/configs/constants";

const porto = Porto.create({
	chains: [Chains.baseSepolia],
});

const client = createClient({
	transport: custom(porto.provider),
});

const mintOnBehalf = async (address: Address) => {
	const dataMint = encodeFunctionData({
		abi: expAbi,
		functionName: "mint",
		args: [address, Value.fromEther("1")],
	});

	await ServerActions.sendCalls(client, {
		account: address,
		chain: Chains.baseSepolia,
		calls: [{ to: expContract.address, data: dataMint }],
		key: mockServerKey,
	});

	console.log("Executed on behalf");
};

export { mintOnBehalf };
