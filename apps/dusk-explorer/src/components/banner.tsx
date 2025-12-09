"use client";

import { Container } from "@web-playground/ui/system/base/container";
import { cn } from "@web-playground/ui/utils/cn";
import { X } from "lucide-react";
import { useStore } from "src/store";
import { useClient } from "src/utils";

type Banner = {
	label: string;
};

type Props = {
	banner: Banner;
};

const Banner = ({ banner }: Props) => {
	const { mounted } = useClient();
	const { open, toggle } = useStore();

	const isOpen = mounted ? open : false;

	return (
		<header
			className={cn(
				"z-50 flex w-full items-center bg-muted text-sm backdrop-blur duration-500 transition-all",
				isOpen ? "h-8" : "h-0 opacity-0",
			)}
		>
			<Container
				className={"flex w-full flex-row justify-between items-center"}
			>
				<div />
				<div className="flex flex-row justify-center">
					<p className="text-center">{banner.label}</p>
				</div>
				<div className="flex w-20 flex-row-reverse items-center px-3">
					<X className="h-4 w-4 cursor-pointer" onClick={toggle} />
				</div>
			</Container>
		</header>
	);
};

export { Banner };
