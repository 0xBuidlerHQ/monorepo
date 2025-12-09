import { Box } from "@0xbuidlerhq/ui/system/base/box";
import { H4 } from "@0xbuidlerhq/ui/system/base/typography";
import type { LucideIcon } from "lucide-react";
import type { PropsWithChildren } from "react";

type DashboardSectionProps = PropsWithChildren & {
	title: string;
	icon: LucideIcon;
};

const DashboardSection = (props: DashboardSectionProps) => {
	const { title, icon: Icon, children } = props;

	return (
		<Box className="flex flex-col gap-6 p-0">
			<Box className="flex items-center gap-2">
				<Icon className="size-4" />
				<H4 className="font-semibold tracking-tighter font-work-sans">{title}</H4>
			</Box>

			{children}
		</Box>
	);
};

export { DashboardSection };
