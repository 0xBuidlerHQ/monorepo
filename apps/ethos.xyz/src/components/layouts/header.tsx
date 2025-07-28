import { Box } from "@ethos/ui/system/base/box";
import { H5 } from "@ethos/ui/system/base/typography";
import { Header as HeaderPrimitive } from "@ethos/ui/system/layouts/header";

type HeaderTitleProps = {
	label: string;
};
const HeaderTitle = ({ label }: HeaderTitleProps) => (
	<Box className="bg-muted">
		<H5 className="hover:cursor-pointer hover:underline">{label}</H5>
	</Box>
);

const Header = () => {
	return (
		<Box className="border-y">
			<HeaderPrimitive className="h-10 bg-muted border-x flex items-stretch">
				<Box className="border-x">Ethos</Box>
				<Box className="flex-1">
					<Box className="flex justify-center gap-6 h-full items-center">
						<HeaderTitle label="Dashboard" />
						<HeaderTitle label="Strategies" />
						<HeaderTitle label="Metrics" />
					</Box>
				</Box>
				<Box className="border-x">Ethos</Box>
			</HeaderPrimitive>
		</Box>
	);
};

export { Header };
