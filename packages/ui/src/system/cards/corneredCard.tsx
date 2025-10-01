import { cn } from "@0xbuidlerhq/ui/shadcn/lib/utils";
import { Box } from "@0xbuidlerhq/ui/system/base/box";

interface CorneredCardProps extends React.HTMLAttributes<HTMLDivElement> {
	classNameCross?: string;
}

const CorneredCard = (props: CorneredCardProps) => {
	const { children, className, classNameCross } = props;

	return (
		<Box
			className={cn(
				"relative outline h-full w-full z-0",
				"hover:cursor-pointer duration-500",
				className,
			)}
		>
			{children}

			<Box className="absolute top-[-0.5px] left-[-0.5px] -translate-1/2">
				<div className={cn("relative size-[6px]", classNameCross)}>
					<div className="absolute inset-0 flex items-center justify-center">
						<div className="w-[1px] h-full bg-gradient-to-t from-ring-50 to-accent rounded-full"></div>
					</div>

					<div className="absolute inset-0 flex items-center justify-center">
						<div className="w-full h-[1px] bg-gradient-to-l from-ring-50 to-accent rounded-full"></div>
					</div>
				</div>
			</Box>
			<Box className="absolute top-[-0.5px] right-[-0.5px] translate-x-1/2 -translate-y-1/2">
				<div className={cn("relative size-[6px]", classNameCross)}>
					<div className="absolute inset-0 flex items-center justify-center">
						<div className="w-[1px] h-full bg-gradient-to-t from-ring-50 to-accent rounded-full"></div>
					</div>

					<div className="absolute inset-0 flex items-center justify-center">
						<div className="w-full h-[1px] bg-gradient-to-r from-ring-50 to-accent rounded-full"></div>
					</div>
				</div>
			</Box>
			<Box className="absolute bottom-[-0.5px] right-[-0.5px] translate-1/2">
				<div className={cn("relative size-[6px]", classNameCross)}>
					<div className="absolute inset-0 flex items-center justify-center">
						<div className="w-[1px] h-full bg-gradient-to-b from-ring-50 to-accent rounded-full"></div>
					</div>

					<div className="absolute inset-0 flex items-center justify-center">
						<div className="w-full h-[1px] bg-gradient-to-r from-ring-50 to-accent rounded-full"></div>
					</div>
				</div>
			</Box>
			<Box className="absolute bottom-[-0.5px] left-[-0.5px] -translate-x-1/2 translate-y-1/2">
				<div className={cn("relative size-[6px]", classNameCross)}>
					<div className="absolute inset-0 flex items-center justify-center">
						<div className="w-[1px] h-full bg-gradient-to-b from-ring-50 to-accent rounded-full"></div>
					</div>

					<div className="absolute inset-0 flex items-center justify-center">
						<div className="w-full h-[1px] bg-gradient-to-l from-ring-50 to-accent rounded-full"></div>
					</div>
				</div>
			</Box>
		</Box>
	);
};

export { CorneredCard };
