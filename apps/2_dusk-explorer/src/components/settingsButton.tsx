"use client";

import { Button } from "@web-playground/ui/shadcn/components/button";
import { cn } from "@web-playground/ui/utils/cn";
import { Settings } from "lucide-react";
import Link from "next/link";
import { SETTINGS } from "src/app/(account)/settings/metadata";
import { useClient } from "src/utils";

export function SettingsButton() {
	const { isRoute } = useClient();

	return (
		<Link href={`/${SETTINGS.href}`}>
			<Button
				variant="ghost"
				size="icon"
				className={cn(isRoute(SETTINGS.href) && "bg-accent")}
			>
				<Settings className="h-[1.2rem] w-[1.2rem] transition-all" />
			</Button>
		</Link>
	);
}
