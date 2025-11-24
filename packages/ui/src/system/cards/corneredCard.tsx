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
				"relative border border-muted-foreground/25 border-[1px] h-full w-full -z-0",
				className,
			)}
		>
			{children}

			<Box className="absolute top-0 left-0 -translate-x-1/2 -translate-y-1/2 -z-10">
				<div className={cn("relative size-[6px]", classNameCross)}>
					<div className="absolute inset-0 flex items-center justify-center -z-10">
						<div className="w-[1px] h-full bg-gradient-to-t from-ring-50 to-accent rounded-full"></div>
					</div>

					<div className="absolute inset-0 flex items-center justify-center -z-10">
						<div className="w-full h-[1px] bg-gradient-to-l from-ring-50 to-accent rounded-full"></div>
					</div>
				</div>
			</Box>

			<Box className="absolute top-0 right-0 translate-x-1/2 -translate-y-1/2 -z-10">
				<div className={cn("relative size-[6px]", classNameCross)}>
					<div className="absolute inset-0 flex items-center justify-center -z-10">
						<div className="w-[1px] h-full bg-gradient-to-t from-ring-50 to-accent rounded-full"></div>
					</div>

					<div className="absolute inset-0 flex items-center justify-center -z-10">
						<div className="w-full h-[1px] bg-gradient-to-r from-ring-50 to-accent rounded-full"></div>
					</div>
				</div>
			</Box>

			<Box className="absolute bottom-0 right-0 translate-x-1/2 translate-y-1/2  -z-10">
				<div className={cn("relative size-[6px]", classNameCross)}>
					<div className="absolute inset-0 flex items-center justify-center -z-10">
						<div className="w-[1px] h-full bg-gradient-to-b from-ring-50 to-accent rounded-full"></div>
					</div>

					<div className="absolute inset-0 flex items-center justify-center -z-10">
						<div className="w-full h-[1px] bg-gradient-to-r from-ring-50 to-accent rounded-full"></div>
					</div>
				</div>
			</Box>

			<Box className="absolute bottom-0 left-0 -translate-x-1/2 translate-y-1/2 -z-10">
				<div className={cn("relative size-[6px]", classNameCross)}>
					<div className="absolute inset-0 flex items-center justify-center -z-10">
						<div className="w-[1px] h-full bg-gradient-to-b from-ring-50 to-accent rounded-full"></div>
					</div>

					<div className="absolute inset-0 flex items-center justify-center -z-10">
						<div className="w-full h-[1px] bg-gradient-to-l from-ring-50 to-accent rounded-full"></div>
					</div>
				</div>
			</Box>
		</Box>
	);
};

export { CorneredCard };
