"use client";

import { EthereumLogo } from "@ethos/assets/crypto/ethereum/Logo";
import { cn } from "@ethos/ui/shadcn/lib/utils";
import { Box } from "@ethos/ui/system/base/box";
import { H5 } from "@ethos/ui/system/base/typography";
import { Header as HeaderPrimitive } from "@ethos/ui/system/layouts/header";
import { Settings, Sun } from "lucide-react";
import { ConnectButton } from "@/connectButton";
import { useWeb3 } from "@/providers/web3";

const ConnectButtonWrapper = () => {
	const {
		connect,
		disconnect,
		eoa,
		networkMetadata,
		status,
		provider,
		isNetworkUnsupported,
		switchChain,
	} = useWeb3();

	return (
		<ConnectButton
			status={status}
			eoa={{ address: eoa?.address! }}
			network={networkMetadata}
			isNetworkUnsupported={isNetworkUnsupported}
			cb={{
				onConnect: () => connect(),
				onDisconnect: () => disconnect(),
				onWrongNetwork: () => {}, // switchChain({ chainId: chains[0].id })
			}}
			provider={{
				name: provider.name!,
				img: provider.image!,
			}}
		/>
	);
};

type HeaderTitleProps = {
	label: string;
};
const HeaderTitle = ({ label }: HeaderTitleProps) => (
	<Box className="">
		<H5
			className={cn(
				"cursor-pointer px-1 py-1 rounded",
				"duration-300 transition-all hover:bg-muted hover:px-4",
			)}
		>
			{label}
		</H5>
	</Box>
);

const Header = () => {
	return (
		<Box className="border-y bg-muted">
			<HeaderPrimitive className="h-10">
				<Box className="border-x flex items-stretch bg-background">
					{/*  */}
					<Box className="flex grow basis-1">
						<Box className="flex flex-end border-r *:not-last:border-l">
							<Box className="h-full flex items-center p-1">
								<Box className="size-8 flex items-center justify-center">
									<EthereumLogo className="size-6" />
								</Box>
							</Box>
						</Box>
					</Box>

					<Box className="flex-1">
						<Box className="flex justify-center gap-6 h-full items-center">
							<HeaderTitle label="Dashboard" />
							<HeaderTitle label="Strategies" />
							<HeaderTitle label="Metrics" />
						</Box>
					</Box>

					<Box className="flex grow basis-1 justify-end">
						<Box className="flex flex-end border-l *:not-last:border-r">
							<Box>
								<ConnectButtonWrapper />
							</Box>

							<Box className="group hover:bg-muted hover:cursor-pointer">
								<Box className="h-full flex items-center p-1">
									<Box className="size-8 flex items-center justify-center">
										<Sun className="group-hover:rotate-45 size-4" />
									</Box>
								</Box>
							</Box>

							<Box className="hover:bg-muted hover:cursor-pointer">
								<Box className="h-full flex items-center p-1">
									<Box className="size-8 flex items-center justify-center">
										<Settings className="size-4" />
									</Box>
								</Box>
							</Box>
						</Box>
					</Box>
				</Box>
			</HeaderPrimitive>
		</Box>
	);
};

export { Header };
