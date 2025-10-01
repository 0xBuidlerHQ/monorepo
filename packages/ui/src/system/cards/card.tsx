import { cn } from "@0xbuidlerhq/ui/shadcn/lib/utils";
import { Box } from "@0xbuidlerhq/ui/system/base/box";

interface CorneredCardProps extends React.HTMLAttributes<HTMLDivElement> {}

const Card = (props: CorneredCardProps) => {
	const { children, className } = props;

	return (
		<Box
			className={cn(
				"relative outline-accent/40 p-4 bg-muted h-full w-full z-0 outline shadow-md",
				"hover:cursor-pointer hover:scale-101 duration-500 hover:outline-accent/70 rounded",
				className,
			)}
		>
			{children}
		</Box>
	);
};

export { Card };
