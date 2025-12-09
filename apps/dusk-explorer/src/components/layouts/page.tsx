import { Box } from "@web-playground/ui/system/base/box";
import { Container } from "@web-playground/ui/system/base/container";
import { H0, P } from "@web-playground/ui/system/typography";
import type { PropsWithChildren } from "react";

type TitleProps = {
	title: string;
	subtitle?: string;
} & PropsWithChildren;

const Page = ({ title, subtitle, children }: TitleProps) => {
	return (
		<Container className="my-10">
			<Box className="mb-10 space-y-0.5">
				<H0 className="font-bold tracking-tighter">{title}</H0>
				<P className="text-muted-foreground">{subtitle}</P>
			</Box>

			{children}
		</Container>
	);
};

export { Page };
