import { cn } from "@0xbuidlerhq/ui/shadcn/lib/utils";
import { Box } from "@0xbuidlerhq/ui/system/base/box";

interface ContainerProps extends React.HTMLAttributes<HTMLElement> {}

const Container = ({ children, className, ...props }: ContainerProps) => {
	return (
		<Box
			className={cn(
				"mx-auto max-w-[var(--app-w)] px-[var(--app-px)] box-content w-[calc(100vw-2*var(--app-px))]",
				className,
			)}
			{...props}
		>
			{children}
		</Box>
	);
};

export { Container };
