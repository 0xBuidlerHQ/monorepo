"use client";

import { useTheme } from "@0xbuidlerhq/ui/providers/theme";
import { Box } from "@0xbuidlerhq/ui/system/base/box";
import { H1_1, H5 } from "@0xbuidlerhq/ui/system/base/typography";
import { ButtonBase } from "@0xbuidlerhq/ui/system/buttons/ButtonBase";
import { Header as HeaderPrimitive } from "@0xbuidlerhq/ui/system/layouts/header";
import { Moon, Sun } from "lucide-react";
import { useEffect, useState } from "react";

const Header = () => {
	const { theme, setTheme } = useTheme();
	const [mounted, setMounted] = useState(false);

	useEffect(() => {
		setMounted(true);
	}, []);

	return (
		<HeaderPrimitive className="py-4">
			<Box className="flex justify-between items-center">
				<Box>
					<H1_1 className="font-bold font-montserrat">Dex Pairs View</H1_1>
				</Box>

				<Box>
					{(() => {
						if (!mounted) return null;

						if (theme === "dark") {
							return (
								<ButtonBase className="flex gap-2 items-center" onClick={() => setTheme("light")}>
									<H5>go light</H5>
									<Sun className="h-5" />
								</ButtonBase>
							);
						}

						if (theme === "light") {
							return (
								<ButtonBase className="flex gap-2 items-center" onClick={() => setTheme("dark")}>
									<H5>go dark</H5>
									<Moon className="h-5" />
								</ButtonBase>
							);
						}
					})()}
				</Box>
			</Box>
		</HeaderPrimitive>
	);
};

export { Header };
