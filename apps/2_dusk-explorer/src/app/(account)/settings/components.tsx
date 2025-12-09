import { TabsContent, TabsTrigger } from "@radix-ui/react-tabs";
import { Separator } from "@web-playground/ui/shadcn/components/separator";
import { H2, H5 } from "@web-playground/ui/system/typography";
import type { PropsWithChildren } from "react";

type RowProps = {
	title: string;
	subtitle: string;
	upSubtitle?: boolean;
} & PropsWithChildren;

const Row = ({ title, subtitle, upSubtitle, children }: RowProps) => (
	<div className="space-y-2">
		<H5 className="font-semibold tracking-normal">{title}</H5>
		{upSubtitle && <H5 className="text-[0.8rem]">{subtitle}</H5>}
		<div className="col-span-2 flex items-end">{children}</div>
		{!upSubtitle && <H5 className="text-[0.8rem]">{subtitle}</H5>}
	</div>
);

type Props = { value: string };

const TabTrigger = ({ value }: Props) => (
	<TabsTrigger
		value={value}
		className="inline-flex h-9 items-center justify-start whitespace-nowrap rounded-md px-4 py-2 text-sm font-medium transition-colors hover:bg-transparent hover:text-accent-foreground hover:underline focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 data-[state=active]:bg-muted data-[state=active]:hover:no-underline"
	>
		{value}
	</TabsTrigger>
);

type SettingsContentProps = {
	title: string;
	subtitle: string;
} & PropsWithChildren;

const SettingsContent = ({
	title,
	subtitle,
	children,
}: SettingsContentProps) => {
	return (
		<TabsContent value={title}>
			<H2 className="pb-[2px]">{title}</H2>
			<H5>{subtitle}</H5>
			<Separator className="my-6" />

			<div className="grid space-y-6">{children}</div>
		</TabsContent>
	);
};

export { Row, TabTrigger, SettingsContent };
