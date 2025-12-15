"use client";

import { useEffect, useState } from "react";
import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";

import { Button } from "@0xbuidlerhq/ui/shadcn/components/button";

const ThemeToggle = () => {
	const { theme, setTheme } = useTheme();
	const [mounted, setMounted] = useState(false);

	useEffect(() => setMounted(true), []);

	const toggle = () => setTheme(theme === "dark" ? "light" : "dark");

	if (!mounted) return null;

	return (
		<Button
			variant="ghost"
			size="icon"
			onClick={toggle}
			className="rounded-full border border-muted"
		>
			{theme === "dark" ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
		</Button>
	);
};

export { ThemeToggle };
