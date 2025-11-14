"use client";

import { H1 } from "@0xbuidlerhq/ui/system/base/typography";
import { ButtonBase } from "@0xbuidlerhq/ui/system/buttons/ButtonBase";
import { Header as HeaderPrimitive } from "@0xbuidlerhq/ui/system/layouts/header";
import { PAGES } from "@config/pages";
import { DraftingCompass } from "lucide-react";

const Header = () => {
	return (
		<HeaderPrimitive>
			<ButtonBase href={PAGES.home} className="flex items-center gap-2 py-1">
				<DraftingCompass className="size-6" strokeWidth={3} />
				<H1 className="font-extrabold">utility.af</H1>
			</ButtonBase>
		</HeaderPrimitive>
	);
};

export { Header };
