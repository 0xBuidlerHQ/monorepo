import { useBigIntInput } from "../hooks/useBigintInput";

const BigIntInput = () => {
	const { value, handleInputChange, valueAsBigInt } = useBigIntInput();

	return (
		<div className="flex flex-col gap-2">
			<input value={value} onChange={handleInputChange} />

			<div>{value}</div>

			<div>{String(valueAsBigInt)}</div>
		</div>
	);
};

export { BigIntInput };
