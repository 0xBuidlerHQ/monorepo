import { Box } from "@web-playground/ui/system/base/box";
import { H0, P } from "@web-playground/ui/system/typography";

type TitleProps = {
	title: string;
	subtitle?: string;
};

export const Title = ({ title, subtitle }: TitleProps) => {
	return (
		<Box className="my-10 space-y-0.5">
			<H0 className="font-bold tracking-tighter">{title}</H0>
			{subtitle && <P className="text-muted-foreground">{subtitle}</P>}
		</Box>
	);
};
