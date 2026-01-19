import { AnimatedStaggerContainer, AnimatedStaggerItem } from "@0xbuidlerhq/animotion";
import { cn } from "@0xbuidlerhq/ui/shadcn/lib/utils";
import { Box } from "@0xbuidlerhq/ui/system/base/box";
import { H1, H3, H4, H5, H6 } from "@0xbuidlerhq/ui/system/base/typography";
import { ButtonBase } from "@0xbuidlerhq/ui/system/buttons/ButtonBase";
import { PAGES } from "@config/pages";
import type { Tool } from "@config/tools";
import { categoryStyles } from "@config/tools";

type ToolsSearchListProps = {
	items: readonly Tool[];
};

/**
 * @dev ToolsSearchList.
 */
const ToolsSearchList = ({ items }: ToolsSearchListProps) => {
	return (
		<>
			<AnimatedStaggerContainer className="grid md:grid-cols-3 grid-cols-1 gap-6">
				{items.map((item) => {
					const isAvailable = item.available;

					const bgColor = isAvailable ? "bg-green-500/10" : "bg-yellow-500/10";
					const textColor = isAvailable ? "text-green-500" : "text-yellow-500";
					const text = isAvailable ? "Available" : "Coming Soon.";

					const categoryStyle = categoryStyles[item.category];

					return (
						<AnimatedStaggerItem key={item.href}>
							<ButtonBase
								href={`${PAGES.tools}/${item.href}`}
								disabled={!isAvailable}
								className={cn(
									"group relative bg-background",
									isAvailable && "hover:scale-[1.025] transition-all duration-500",
								)}
							>
								<Box
									className={cn(
										"border border-accent p-4 rounded-lg flex flex-col gap-2 bg-muted/10",
										isAvailable && "bg-muted group-hover:bg-muted transition-all duration-500",
										!isAvailable && "opacity-50",
									)}
								>
									<Box>
										<Box className="p-2 border-blue-500 bg-accent rounded-lg inline-block">
											<item.icon />
										</Box>
									</Box>

									<Box>
										<H3 className="font-medium">{item.name}</H3>
										<H5 className="text-muted-foreground">{item.subtitle}</H5>
									</Box>
								</Box>

								{!isAvailable && (
									<Box className="absolute top-2 right-2">
										<Box className={cn("px-2 py-[1px] border border-accent rounded-lg", bgColor)}>
											<H6 className={cn("font-medium font-mono", textColor)}>{text}</H6>
										</Box>
									</Box>
								)}

								{isAvailable && (
									<Box className="absolute top-2 right-2">
										<Box className="flex gap-2">
											<Box className={cn("border border-accent px-2 rounded", categoryStyle.bg)}>
												<H6 className={cn("font-mono", categoryStyle.text)}>
													{categoryStyle.label}
												</H6>
											</Box>
										</Box>
									</Box>
								)}
							</ButtonBase>
						</AnimatedStaggerItem>
					);
				})}
			</AnimatedStaggerContainer>

			{items.length === 0 && <NotFound />}
		</>
	);
};

const NotFound = () => {
	return (
		<Box className="flex flex-col">
			<H1 className="font-semibold">The tool you are looking for is not available yet.</H1>

			<ButtonBase className="underline underline-offset-4">
				<H4 className="font-medium text-muted-foreground">Tell us what to build next ✨</H4>
			</ButtonBase>
		</Box>
	);
};

export { ToolsSearchList };
