import { shortenAddress } from "../functions/shortenAddress";
import { shortenHash } from "../functions/shortenHash";
import { useBigIntInput } from "../hooks/useBigIntInput";

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

			<div>{shortenAddress("0x123456765435654")}</div>
			<div>{shortenHash("0x123456765435654")}</div>
		</div>
	);
};

export { BigIntInput };
