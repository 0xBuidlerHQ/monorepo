import { useBigIntInput } from "../hooks/useBigintInput";

const BigIntInput = () => {
	const userBalance = 1_000_000n;
	const decimals = 18;

	const { value, handleInputChange, valueAsBigInt, externalError, numberError } = useBigIntInput({
		decimals,
		options: { userBalance },
	});

	return (
		<div className="">
			<div>
				<input className="border p-4 rounded" value={value} onChange={handleInputChange} />
			</div>

			<div>
				<div>{value}</div>
				<div>{String(valueAsBigInt)}</div>

				<div>{externalError}</div>
				<div>{numberError.message}</div>
			</div>
		</div>
	);
};

export { BigIntInput };
