"use server";

import { Value } from "ox";
import { Chains } from "porto";
import { sendCalls, upgradeAccount } from "porto/viem/ServerActions";
import { type Address, createClient, encodeFunctionData, erc20Abi, http } from "viem";
import { expContract, mockServerAccount } from "@/constants";

const client = createClient({
	chain: Chains.baseSepolia,
	transport: http(),
});

const prepareServerAddy = async () => {
	console.log("Upgrade Account");

	const a = await upgradeAccount(client, {
		account: mockServerAccount,
		authorizeKeys: [
			{
				publicKey: mockServerAccount.address,
				type: "secp256k1",
				role: "admin",
			},
		],
	});

	console.log(a.address);

	console.log("Account Upgraded");
};

const executeOnBehalf = async (address: Address) => {
	const dataApprove = encodeFunctionData({
		abi: erc20Abi,
		functionName: "approve",
		args: [mockServerAccount.address, Value.fromEther("1")],
	});

	const dataTransferFrom = encodeFunctionData({
		abi: erc20Abi,
		functionName: "transferFrom",
		args: [address, mockServerAccount.address, Value.fromEther("0.0000000001")],
	});

	await sendCalls(client, {
		account: mockServerAccount,
		calls: [
			{ to: expContract.address, data: dataApprove },
			{ to: expContract.address, data: dataTransferFrom },
		],
		key: {
			publicKey: mockServerAccount.publicKey,
			role: "session",
			type: "secp256k1",
			// "hash": "0x2"
		}, // Porto specific,
	});
};

export { executeOnBehalf, prepareServerAddy };
