import { Box } from "@0xbuidlerhq/ui/system/base/box";
import { H1 } from "@0xbuidlerhq/ui/system/base/typography";
import { ButtonBase } from "@0xbuidlerhq/ui/system/buttons/ButtonBase";
import { Header as HeaderPrimitive } from "@0xbuidlerhq/ui/system/layouts/header";
import { PAGES } from "@config/pages";
import { DraftingCompass } from "lucide-react";

const Header = () => {
	return (
		<HeaderPrimitive className="py-2">
			<ButtonBase href={PAGES.home} className="inline-flex items-center gap-2 py-1">
				<DraftingCompass
					className="size-8 p-1 bg-muted text-white rounded border border-accent"
					strokeWidth={3}
				/>

				<Box className="flex gap-[0px]">
					<H1 className="font-black text-cyan-400">u</H1>
					<H1 className="font-black text-blue-400">s</H1>
					<H1 className="font-black text-purple-400">e</H1>
					<H1 className="font-black text-pink-400">f</H1>
					<H1 className="font-black text-green-400">u</H1>
					<H1 className="font-black text-yellow-400">l</H1>
					<H1 className="font-black text-green-400">.</H1>
					<H1 className="font-black text-purple-400">a</H1>
					<H1 className="font-black text-rose-400">f</H1>
				</Box>
			</ButtonBase>
		</HeaderPrimitive>
	);
};

export { Header };
