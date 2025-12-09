"use client";

import { Page } from "@components/layouts/page";
import { DataTable } from "@web-playground/ui/system/table";
import { useLatestTxs } from "../../utils";

const Transactions = () => {
	const { data: dataLatestTxs, header: headerLatestTxs } = useLatestTxs();

	return (
		<Page title="Transactions">
			<DataTable
				columns={headerLatestTxs}
				data={dataLatestTxs}
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

export default Transactions;
