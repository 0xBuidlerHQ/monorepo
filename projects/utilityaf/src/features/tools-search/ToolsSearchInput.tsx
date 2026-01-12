"use client";

import { cn } from "@0xbuidlerhq/ui/shadcn/lib/utils";
import { Box } from "@0xbuidlerhq/ui/system/base/box";
import { H5 } from "@0xbuidlerhq/ui/system/base/typography";
import { ButtonBase } from "@0xbuidlerhq/ui/system/buttons/ButtonBase";
import { categoryStyles, ToolCategories, type ToolCategory } from "@config/tools";
import type { ToolsSearchFormProps } from "@features/tools-search/useToolsSearch";

/**
 * @dev ToolsSearchInput.
 */
const ToolsSearchInput = ({ form }: ToolsSearchFormProps) => {
	return (
		<>
			{/* Search field */}
			<form.Field name="search">
				{(field) => (
					<Box className="w-full">
						<input
							className="w-full bg-muted border border-accent rounded-lg h-10 p-6 font-mono"
							placeholder="Search tools..."
							value={field.state.value}
							onChange={(e) => field.handleChange(e.target.value)}
						/>
					</Box>
				)}
			</form.Field>

			{/* Category multi-select pills */}
			<Box className="flex gap-2 ml-2 mt-1 flex-wrap">
				<form.Field name="categories">
					{(field) => {
						const selected = (field.state.value ?? ToolCategories) as ToolCategory[];

						const toggleCategory = (key: ToolCategory) => {
							const all = ToolCategories as ToolCategory[];

							const isSelected = selected.includes(key);
							const isAllSelected = selected.length === all.length;
							const isLastSelected = selected.length === 1 && isSelected;

							// 1) All selected → clicking one => only that one stays selected
							if (isAllSelected && isSelected) {
								return field.handleChange([key]);
							}

							// 2) Last one selected → clicking it => select all
							if (isLastSelected) {
								return field.handleChange(all);
							}

							// 3) Normal toggle behaviour
							const updated = isSelected ? selected.filter((c) => c !== key) : [...selected, key];

							field.handleChange(updated);
						};

						return (
							<>
								{ToolCategories.map((toolCategory) => {
									const item = categoryStyles[toolCategory];
									const isActive = selected.includes(toolCategory);

									return (
										<ButtonBase
											key={item.label}
											className={cn(
												"flex gap-2 mt-2 cursor-pointer hover:scale-105 transition-all group",
												isActive ? "opacity-100" : "opacity-50",
												"hover:opacity-100",
											)}
											onClick={() => toggleCategory(toolCategory)}
										>
											<Box className={cn("border border-accent px-2 rounded", item.bg)}>
												<H5
													className={cn(
														"font-mono group-hover:px-2 transition-all duration-500",
														isActive && "px-1",
														item.text,
													)}
												>
													{item.label}
												</H5>
											</Box>
										</ButtonBase>
									);
								})}
							</>
						);
					}}
				</form.Field>
			</Box>
		</>
	);
};

export { ToolsSearchInput };
