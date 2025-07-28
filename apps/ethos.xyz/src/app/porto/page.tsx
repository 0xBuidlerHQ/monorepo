"use client";

import { Button } from "@ethos/ui/shadcn/components/button";
import { Box } from "@ethos/ui/system/base/box";
import { Container } from "@ethos/ui/system/base/container";
import { Value } from "ox";
import type { wallet_grantPermissions } from "porto/RpcSchema";
import { erc20Abi } from "viem";
import { useReadContract } from "wagmi";
import { expContract, mockReceiver, mockServerAccount } from "@/constants";
import { usePorto, usePortoActions } from "@/hooks/porto";
import { useWeb3 } from "@/providers/web3";
import { executeOnBehalf, prepareServerAddy } from "@/server/actions/executeOnBehalf";

export const newPermissions: wallet_grantPermissions.Parameters = {
	expiry: Math.floor(Date.now() / 1_000) + 60 * 60, // 1 hour
	feeLimit: {
		currency: "USD",
		value: "1",
	},
	key: {
		publicKey: mockServerAccount.address,
		type: "secp256k1",
	},
	permissions: {
		calls: [
			{
				to: expContract.address,
				signature: "approve(address,uint256)",
			},
			{
				to: expContract.address,
				signature: "transferFrom(address,uint256)",
			},
		],
		spend: [
			{
				limit: Value.fromEther("10"),
				period: "hour",
				token: expContract.address,
			},
		],
	},
} as const;

const Page = () => {
	const { connect, disconnect, eoa, isConnected, isConnecting, isDisconnected } = useWeb3();

	const { addFunds, grantPermissions } = usePortoActions();
	const { permissions } = usePorto();

	const { data: balanceSender } = useReadContract({
		address: expContract.address,
		abi: erc20Abi,
		functionName: "balanceOf",
		args: [eoa.address!],
	});

	const { data: balanceReceiver } = useReadContract({
		address: expContract.address,
		abi: erc20Abi,
		functionName: "balanceOf",
		args: [mockReceiver!],
	});

	return (
		<Container>
			<Button onClick={connect}>Connect</Button>
			<Button onClick={disconnect}>Disconnect</Button>

			<Button
				onClick={() =>
					grantPermissions.mutate(newPermissions, {
						onError: (err) => console.log("Err: ", err),
						onSuccess: (err) => console.log("Success: ", err),
					})
				}
			>
				Add Permissions
			</Button>

			<Button
				onClick={() =>
					addFunds.mutate(
						{
							value: Value.from("1", 6),
						},
						{
							onError: (err) => console.log("Err: ", err),
							onSuccess: (err) => console.log("Success: ", err),
						},
					)
				}
			>
				Add Funds
			</Button>

			<Button
				onClick={async () => {
					await prepareServerAddy();
				}}
			>
				prepareServerAddy
			</Button>

			<Button
				onClick={async () => {
					await executeOnBehalf(eoa.address!);
				}}
			>
				Execute on behalf
			</Button>

			<Box>
				<h1 className="text-2xl">Server:</h1>
				<Box className="flex flex-col">
					<Box>Server Wallet: {mockServerAccount.address}</Box>
				</Box>
			</Box>

			<Box>
				<h1 className="text-2xl">Account:</h1>
				<Box className="flex flex-col">
					<Box>Address: {eoa.address}</Box>
				</Box>
			</Box>

			<Box>
				<h1 className="text-2xl">Permissions:</h1>
				<Box className="flex flex-col">
					{permissions.data?.map((item) => (
						<Box key={item.id}>
							Permission: {item.address} to {item.key.publicKey}, until{" "}
							{new Date(item.expiry * 1000).toString()}
						</Box>
					))}
				</Box>
			</Box>

			<Box>
				<h1 className="text-2xl">EXP Balance:</h1>
				<Box className="flex flex-col">
					<Box>[Sender] - EXP Balance: {Value.formatEther(balanceSender ?? 0n)}</Box>
					<Box>[Receiver] - EXP Balance: {Value.formatEther(balanceReceiver ?? 0n)}</Box>
				</Box>
			</Box>

			<Box>
				<h1 className="text-2xl">Status:</h1>
				<Box className="flex flex-col">
					<Box>isConnected: {isConnected ? "true" : "false"}</Box>
					<Box>isConnecting: {isConnecting ? "true" : "false"}</Box>
					<Box>isDisconnected: {isDisconnected ? "true" : "false"}</Box>
				</Box>
			</Box>
		</Container>
	);
};

export default Page;
