"use client";

import { Box } from "@0xbuidlerhq/ui/system/base/box";
import { ButtonBase } from "@0xbuidlerhq/ui/system/buttons/ButtonBase";
import { useDaemonCreate } from "@client/query/useDaemonCreate";

const NomosPage = () => {
	const { daemonCreateAsync } = useDaemonCreate();

	return (
		<Box className="grow">
			<ButtonBase
				className="bg-red-500"
				onClick={async () => {
					const res = await daemonCreateAsync({
						nomosId: "nomos-0x-aave",
						event: {
							type: "START",
							payload: {
								initialAmount: 1000n,
							},
						},
					});
				}}
			>
				Start strategy
			</ButtonBase>
		</Box>
	);
};

export default NomosPage;

BigInt.prototype.toJSON = function () {
	return { $bigint: this.toString() };
};
