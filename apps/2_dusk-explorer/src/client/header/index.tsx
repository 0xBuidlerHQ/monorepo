"use client";

import { Header as HeaderPrimitive } from "@web-playground/ui/system/layouts/header";

import { useBanner, useClient } from "../../utils";

import { Banner } from "@components/banner";
import { SearchBar } from "@components/searchBar";
import { SettingsButton } from "@components/settingsButton";
import {
	NavigationMenu,
	NavigationMenuItem as NavigationMenuItemPrimitive,
	NavigationMenuLink,
	NavigationMenuList,
} from "@web-playground/ui/shadcn/components/navigation-menu";
import { Separator } from "@web-playground/ui/shadcn/components/separator";
import { Box } from "@web-playground/ui/system/base/box";
import { Combobox } from "@web-playground/ui/system/combobox";
import { ThemeToggle } from "@web-playground/ui/system/themeToggle";
import { H6 } from "@web-playground/ui/system/typography";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { BLOCKS } from "src/app/blocks/metadata";
import { DASHBOARD } from "src/app/metadata";
import { TRANSACTIONS } from "src/app/transactions/metadata";
import Logo from "src/assets/logo-full.svg";
import {
	ListItem,
	NavigationMenuItem,
	customNavigationMenuTriggerStyle,
} from "./navigation-menu-extended";

const NavigationArray = [DASHBOARD, BLOCKS, TRANSACTIONS];

const Header = () => {
	const { fullRoute } = useClient();
	const banner = useBanner();

	const [network, setNetwork] = useState("mainnet");

	return (
		<Box>
			<Banner banner={banner} />

			<HeaderPrimitive className="relative z-50 backdrop-blur md:block">
				<Box className="flex h-8 items-center justify-between">
					<div className="flex gap-4">
						<div className="flex items-center gap-1">
							<H6 className="font-normal">Dusk Price:</H6>
							<H6 className="text-blue-400">$123</H6>
						</div>

						<Separator orientation="vertical" className="h-auto" />

						<div className="flex items-center gap-1">
							<H6 className="font-normal">Gas:</H6>
							<H6 className="text-blue-400">2 Gwei</H6>
						</div>
					</div>
				</Box>

				<Separator />

				<Box className="flex h-14">
					<Link href={"/"} style={{ display: "flex", alignSelf: "center" }}>
						<Image
							src={Logo}
							style={{ width: 70, height: "auto" }}
							alt=""
							className="dark:invert"
							quality={100}
						/>
					</Link>

					<Separator orientation="vertical" className="ml-5 mr-4 h-[50%] translate-y-1/2" />

					<Combobox
						className="self-center"
						items={["mainnet"]}
						searching="Network"
						value={network}
						onChange={setNetwork}
					/>

					<Separator orientation="vertical" className="ml-5 mr-4 h-[50%] translate-y-1/2" />

					<NavigationMenu>
						<NavigationMenuList>
							{NavigationArray.map((item) =>
								item.submenu ? (
									item.submenu.image ? (
										<NavigationMenuItem key={item.href} item={item}>
											<div className="grid w-[800px] grid-cols-4 gap-5 p-4">
												<div className="relative col-span-1">
													<Image priority src={"/vercel.svg"} alt="" fill />
												</div>

												<ul className="col-span-3 grid grid-cols-2 gap-3">
													{item.submenu.items.map((component) => (
														<Link
															href={`/${component.href}`}
															legacyBehavior
															passHref
															key={component.href}
														>
															<ListItem
																activated={fullRoute === component.href}
																title={component.name}
																href={component.href}
															>
																{component.description}
															</ListItem>
														</Link>
													))}
												</ul>
											</div>
										</NavigationMenuItem>
									) : (
										<NavigationMenuItem key={item.href} item={item}>
											<ul className="= grid w-[600px] gap-3 p-4 md:grid-cols-2">
												{item.submenu.items.map((component) => (
													<Link
														key={component.href}
														href={`/${component.href}`}
														legacyBehavior
														passHref
													>
														<ListItem
															activated={fullRoute === component.href}
															title={component.name}
															href={component.href}
														>
															{component.description}
														</ListItem>
													</Link>
												))}
											</ul>
										</NavigationMenuItem>
									)
								) : (
									<NavigationMenuItemPrimitive key={item.href}>
										<Link href={`/${item.href}`} legacyBehavior passHref>
											<NavigationMenuLink
												className={customNavigationMenuTriggerStyle({
													activated: fullRoute === item.href,
												})}
											>
												{item.name}
											</NavigationMenuLink>
										</Link>
									</NavigationMenuItemPrimitive>
								),
							)}
						</NavigationMenuList>
					</NavigationMenu>

					<div className="flex flex-grow items-center justify-end gap-2">
						<SearchBar
							text="Search anything ..."
							placeholder="Address / Txn Hash / Block / Token / Domain Name"
						/>
						<Separator orientation="vertical" className="ml-5 mr-4 h-[50%]" />
						<SettingsButton />
						<ThemeToggle />
					</div>
				</Box>

				<Separator />
			</HeaderPrimitive>
		</Box>
	);
};

export { Header };
