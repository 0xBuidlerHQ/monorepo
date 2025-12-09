"use client";

import { Button } from "@0xbuidlerhq/ui/shadcn/components/button";
import { Box } from "@0xbuidlerhq/ui/system/base/box";
import { Container } from "@0xbuidlerhq/ui/system/base/container";
import { usePorto, usePortoActions } from "@client/hooks/porto";
import { useWeb3 } from "@client/providers/web3";
import { mintOnBehalf } from "@server/actions/mintOnBehalf";
import { Value } from "ox";
import type { wallet_grantPermissions } from "porto/RpcSchema";
import { useReadContract } from "wagmi";
import {
	expContract,
	mockReceiver,
	mockServerAccount,
	mockServerKey,
} from "../../../config/constants";

const newPermissions: wallet_grantPermissions.Parameters = {
	expiry: Math.floor(Date.now() / 1_000) + 60 * 60, // 1 hour
	feeToken: {
		symbol: "USDC",
		limit: "1",
	},
	key: mockServerKey,
	permissions: {
		calls: [
			{
				signature: "mint()",
				to: expContract.address,
			},
		],
		spend: [
			{
				period: "minute",
				limit: Value.fromEther("1000"),
				token: expContract.address,
			},
		],
	},
} as const;

const Page = () => {
	const { connect, disconnect, eoa, isConnected, isConnecting, isDisconnected, portoConnector } =
		useWeb3();

	const { addFunds, grantPermissions, upgradeAccount } = usePortoActions();
	const { permissions } = usePorto();

	const { data: balanceSender } = useReadContract({
		address: expContract.address,
		abi: expContract.abi,
		functionName: "balanceOf",
		args: [eoa.address!],
	});

	const { data: balanceReceiver } = useReadContract({
		address: expContract.address,
		abi: expContract.abi,
		functionName: "balanceOf",
		args: [mockReceiver!],
	});

	return (
		<Container>
			<Button onClick={connect}>Connect</Button>
			<Button onClick={disconnect}>Disconnect</Button>

			<Button
				onClick={() =>
					upgradeAccount.mutate(
						{
							account: eoa!,
							// connector: portoConnector,
						},
						{
							onError: (err) => console.log("Err: ", err),
							onSuccess: (err) => console.log("Success: ", err),
						},
					)
				}
			>
				Upgrade Account
			</Button>

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
						{},
						{
							onError: (err) => console.log("Err: ", err),
							onSuccess: (err) => console.log("Success: ", err),
						},
					)
				}
			>
				Add Exp
			</Button>

			<Button
				onClick={async () => {
					await mintOnBehalf(eoa.address!);
				}}
			>
				Mint on behalf
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
						<Box key={item.id + item.expiry}>
							Permission: {item.address} to {item.key.publicKey}, until{" "}
							{new Date(item.expiry * 1000).toString()}
						</Box>
					))}
				</Box>
			</Box>

			<Box>
				<h1 className="text-2xl">EXP Balance:</h1>
				<Box className="flex flex-col">
					<Box>[Sender] - EXP Balance: {Value.formatEther(balanceSender ?? BigInt(0))}</Box>
					<Box>[Receiver] - EXP Balance: {Value.formatEther(balanceReceiver ?? BigInt(0))}</Box>
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
