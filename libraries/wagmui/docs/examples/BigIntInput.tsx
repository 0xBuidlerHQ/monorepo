import { formatEvmAddress, formatEvmHash, formatKMB, formatUSD } from "@0xbuidlerhq/wagmui";
import { useBigIntInput } from "@0xbuidlerhq/wagmui/react";

const BigIntInput = () => {
	const decimals = 18;

	const { handleInputChange, value, valueAsBigInt, isError } = useBigIntInput({
		decimals,
	});

	return (
		<div className="">
			<div>
				<input className="border p-4 rounded" value={value} onChange={handleInputChange} />
			</div>

			<div>
				<div>{value}</div>
				<div>{String(valueAsBigInt)}</div>

				<div>{String(isError)}</div>
			</div>

			<div>{formatEvmAddress("0x123456765435654")}</div>
			<div>{formatEvmHash("0x123456765435654")}</div>

			<div>{formatUSD()(2987777888)}</div>
			<div>{formatKMB()(2987777888)}</div>
		</div>
	);
};

export { BigIntInput };
