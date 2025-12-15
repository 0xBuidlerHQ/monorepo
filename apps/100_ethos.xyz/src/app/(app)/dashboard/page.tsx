"use client";

import { Button } from "@0xbuidlerhq/ui/shadcn/components/button";
import {
	Drawer,
	DrawerClose,
	DrawerContent,
	DrawerDescription,
	DrawerFooter,
	DrawerHeader,
	DrawerTitle,
	DrawerTrigger,
} from "@0xbuidlerhq/ui/shadcn/components/drawer";
import { Box } from "@0xbuidlerhq/ui/system/base/box";
import { Portfolio } from "@app/(app)/dashboard/_components/portfolio";
import { Strategies } from "@app/(app)/dashboard/_components/strategies";

const DashboardPage = () => {
	return (
		<Box>
			<Box className="flex flex-col gap-4 p-10">
				<Portfolio />
				<Strategies />
			</Box>

			<Drawer>
				<DrawerTrigger>Open</DrawerTrigger>
				<DrawerContent>
					<DrawerHeader>
						<DrawerTitle>Are you absolutely sure?</DrawerTitle>
						<DrawerDescription>This action cannot be undone.</DrawerDescription>
					</DrawerHeader>
					<DrawerFooter>
						<Button>Submit</Button>

						<DrawerClose>Cancel</DrawerClose>
					</DrawerFooter>
				</DrawerContent>
			</Drawer>
		</Box>
	);
};

export default DashboardPage;
