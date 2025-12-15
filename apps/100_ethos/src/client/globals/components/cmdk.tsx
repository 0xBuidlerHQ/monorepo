"use client";

import { Button } from "@0xbuidlerhq/ui/shadcn/components/button";
import { Box } from "@0xbuidlerhq/ui/system/base/box";
import { H4 } from "@0xbuidlerhq/ui/system/base/typography";
import { useToggleCmdK } from "@client/stores/modals";
import { animated, useTransition } from "@react-spring/web";
import { Command } from "cmdk";
import type { PropsWithChildren } from "react";

const Shortcuts = () => {
	return (
		<Box className="flex gap-2">
			<Button>New Strategy</Button>
			<Button>New Strategy</Button>
			<Button>New Strategy</Button>
		</Box>
	);
};

const Path = () => {
	return <Box>1</Box>;
};

const Commands = () => {
	return (
		<Command label="Command Menu">
			<Command.Input />

			<Command.List>
				<Command.Empty>No results found.</Command.Empty>

				<Command.Group heading="Strategies" className="text-xs">
					<Command.Item value="1">
						<H4>a</H4>
					</Command.Item>
					<Command.Item value="2">
						<H4>b</H4>
					</Command.Item>
					<Command.Item value="3">
						<H4>c</H4>
					</Command.Item>
				</Command.Group>
			</Command.List>
		</Command>
	);
};

const CmdkPanel = () => {
	return (
		<Box className="h-full min-w-[calc(100vw/2)] p-4 shadow-xl bg-muted rounded outline">
			<Box className="flex flex-col">
				<Shortcuts />

				{/* <Separator />

				<Path />

				<Separator />

				<Commands /> */}
			</Box>
		</Box>
	);
};

const Animation = (props: PropsWithChildren) => {
	const { children } = props;

	const toggleCmdK = useToggleCmdK();

	// Transition config
	const transitions = useTransition(toggleCmdK.isOn, {
		from: { opacity: 0, transform: "translateY(50px) scale(0.95)" },
		enter: { opacity: 1, transform: "translateY(0px) scale(1)" },
		leave: { opacity: 0, transform: "translateY(50px) scale(0.95)" },
		config: { tension: 250, friction: 30 },
	});

	return (
		<>
			{transitions(
				(style, item) =>
					item && (
						<animated.div
							className="fixed top-[120px] left-1/2 -translate-x-1/2 z-100"
							style={{ ...style }}
						>
							{children}
						</animated.div>
					),
			)}
		</>
	);
};

const Cmdk = () => {
	return (
		<Animation>
			<CmdkPanel />
		</Animation>
	);
};

export { Cmdk };
