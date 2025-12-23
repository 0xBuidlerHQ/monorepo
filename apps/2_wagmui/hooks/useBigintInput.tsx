import React from "react";

type UseBigIntInputOptions = {
	decimals?: number;
};

type UseBigIntInputResult = {
	value: string;
	valueAsBigInt: bigint;
	handleInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
	isError: boolean;
};

const normalizeDecimals = (decimals: number) => Math.max(0, Math.floor(decimals));

const buildNumberValidator = (decimals: number) => {
	if (decimals <= 0) return /^(\d+)?$/;
	return new RegExp(`^(\\d+(\\.\\d{0,${decimals}})?)?$`);
};

const isValidNumberInput = (input: string, validator: RegExp): boolean => validator.test(input);

const toBigIntWithDecimals = (value: string, decimals: number) => {
	if (value === "") return 0n;
	const [integerPart, decimalPart] = value.split(".");
	if (decimals <= 0) return BigInt(integerPart || "0");
	return BigInt((integerPart || "0") + (decimalPart || "").padEnd(decimals, "0"));
};

const useBigIntInput = ({ decimals = 18 }: UseBigIntInputOptions = {}): UseBigIntInputResult => {
	const safeDecimals = normalizeDecimals(decimals);
	const numberValidator = React.useMemo(() => buildNumberValidator(safeDecimals), [safeDecimals]);

	const [value, setValue] = React.useState("");
	const [valueAsBigInt, setValueAsBigInt] = React.useState<bigint>(0n);
	const [isError, setIsError] = React.useState(false);

	const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const nextValue = e.target.value;

		if (!isValidNumberInput(nextValue, numberValidator)) {
			setIsError(true);
			return;
		}

		const nextBigInt = toBigIntWithDecimals(nextValue, safeDecimals);

		setIsError(false);
		setValue(nextValue);
		setValueAsBigInt(nextBigInt);
	};

	return {
		value,
		valueAsBigInt,
		handleInputChange,
		isError,
	};
};

export { useBigIntInput };
