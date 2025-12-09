"use client";

import { Page } from "@components/layouts/page";
import { DataTable } from "@web-playground/ui/system/table";
import { useLatestBlocks } from "../../utils";

const Blocks = () => {
	const { data: dataLatestBlocks, header: headerLatestBlocks } =
		useLatestBlocks();

	return (
		<Page title="Blocks">
			<DataTable
				columns={headerLatestBlocks}
				data={dataLatestBlocks}
				paginationOptions={{
					showPageOf: true,
					showPageArrows: true,
					showRowsPerPage: true,
					showSelectedRows: true,
				}}
			/>
		</Page>
	);
};

export default Blocks;
