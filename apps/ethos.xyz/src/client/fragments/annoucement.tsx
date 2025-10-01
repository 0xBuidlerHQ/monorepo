"use client";

import { cn } from "@0xbuidlerhq/ui/shadcn/lib/utils";
import { Box } from "@0xbuidlerhq/ui/system/base/box";
import { Container } from "@0xbuidlerhq/ui/system/base/container";
import { H6 } from "@0xbuidlerhq/ui/system/base/typography";
import { ButtonBase } from "@0xbuidlerhq/ui/system/buttons/ButtonBase";
import { useToggleAnnouncementBar } from "@client/stores/modals";
import { Terminal, X } from "lucide-react";
import React from "react";

const Annoucement = () => {
	const toggleAnnoucementBar = useToggleAnnouncementBar();

	React.useEffect(() => {
		const timer = setTimeout(() => {
			toggleAnnoucementBar.turnOn();
			console.log("Executed after 2 seconds!");
			// put your logic here
		}, 1000);

		// cleanup in case component unmounts before timeout
		return () => clearTimeout(timer);
	}, []);

	return (
		<Box
			className={cn(
				"z-50 flex w-full items-center text-sm backdrop-blur duration-500 transition-all bg-accent-foreground text-white",
				toggleAnnoucementBar.isOn ? "h-8" : "h-0 opacity-0",
			)}
		>
			<Container>
				<Box className="flex w-full flex-row justify-between items-center">
					<Box className="flex flex-row justify-center">
						<Terminal className="size-4 " />
						<H6 className="text-center tracking-tight ml-2">
							{"This is an announcement hello hello hello."}
						</H6>
					</Box>

					<ButtonBase onClick={toggleAnnoucementBar.turnOff}>
						<Box className="flex flex-row-reverse items-center px-3">
							<X className="h-4 w-4 cursor-pointer" />
						</Box>
					</ButtonBase>
				</Box>
			</Container>
		</Box>
	);
};

export { Annoucement };
