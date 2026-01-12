"use client";

import { Separator } from "@0xbuidlerhq/ui/shadcn/components/separator";
import { Box } from "@0xbuidlerhq/ui/system/base/box";
import { ToolsSearchInput } from "@features/tools-search/ToolsSearchInput";
import { ToolsSearchList } from "@features/tools-search/ToolsSearchList";
import { useToolsSearch } from "@features/tools-search/useToolsSearch";

const ToolSearch = () => {
	const { form, tools } = useToolsSearch();

	return (
		<Box>
			<ToolsSearchInput form={form} />

			<Separator className="bg-accent my-8" />

			<ToolsSearchList items={tools} />
		</Box>
	);
};

export { ToolSearch };
