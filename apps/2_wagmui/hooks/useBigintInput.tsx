import React from "react";

type UseBigIntInputOptions = {
	decimals?: number;
};

const getRegex = (decimals: number) => {
	if (decimals <= 0) return /^(\d+)?$/;
	return new RegExp(`^(\\d+(\\.\\d{0,${decimals}})?)?$`);
};

const isValidInput = (input: string, decimals: number): boolean => getRegex(decimals).test(input);

const toBigIntWithDecimals = (value: string, decimals: number) => {
	if (value === "") return 0n;
	const [integerPart, decimalPart] = value.split(".");
	if (decimals <= 0) return BigInt(integerPart || "0");
	return BigInt((integerPart || "0") + (decimalPart || "").padEnd(decimals, "0"));
};

const useBigIntInput = ({ decimals = 18 }: UseBigIntInputOptions = {}) => {
	const safeDecimals = Math.max(0, Math.floor(decimals));
	const [value, setValue] = React.useState("");
	const [valueAsBigInt, setValueAsBigInt] = React.useState<bigint>(0n);
	const [isError, setIsError] = React.useState(false);

	const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const nextValue = e.target.value;

		if (!isValidInput(nextValue, safeDecimals)) {
			setIsError(true);
			return;
		}

		setIsError(false);
		setValue(nextValue);
		setValueAsBigInt(toBigIntWithDecimals(nextValue, safeDecimals));
	};

	return { value, handleInputChange, valueAsBigInt, isError };
};

export { useBigIntInput };
