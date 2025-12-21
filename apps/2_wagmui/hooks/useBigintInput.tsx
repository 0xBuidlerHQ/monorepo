import React from "react";

enum NumberError {
	INVALID_NUMBER = "Invalid number input.",
}

enum ExternalError {
	INSUFFICIENT_FUNDS = "Insufficient funds.",
}

type ExternalValidationOptions = {
	userBalance?: bigint;
};

type UseBigIntInputOptions = {
	decimals?: number;
	options?: ExternalValidationOptions;
};

type UseBigIntInputResult = {
	value: string;
	valueAsBigInt: bigint;
	handleInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
	isNumberError: boolean;
	isExternalError: boolean;
	numberError: { type: NumberError | null; message: string | null };
	externalError: ExternalError | null;
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

const getExternalValidationError = (
	value: bigint,
	options?: ExternalValidationOptions,
): ExternalError | null => {
	if (options?.userBalance !== undefined && value > options.userBalance) {
		return ExternalError.INSUFFICIENT_FUNDS;
	}

	return null;
};

const useBigIntInput = ({
	decimals = 18,
	options,
}: UseBigIntInputOptions = {}): UseBigIntInputResult => {
	const safeDecimals = normalizeDecimals(decimals);
	const numberValidator = React.useMemo(() => buildNumberValidator(safeDecimals), [safeDecimals]);

	const [value, setValue] = React.useState("");
	const [valueAsBigInt, setValueAsBigInt] = React.useState<bigint>(0n);
	const [numberError, setNumberError] = React.useState<{
		type: NumberError | null;
		message: string | null;
	}>({ type: null, message: null });
	const [externalError, setExternalError] = React.useState<ExternalError | null>(null);
	const isNumberError = Boolean(numberError.type);
	const isExternalError = Boolean(externalError);

	const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const nextValue = e.target.value;

		if (!isValidNumberInput(nextValue, numberValidator)) {
			setNumberError({ type: NumberError.INVALID_NUMBER, message: NumberError.INVALID_NUMBER });
			return;
		}

		const nextBigInt = toBigIntWithDecimals(nextValue, safeDecimals);
		const externalValidationError = getExternalValidationError(nextBigInt, options);

		setNumberError({ type: null, message: null });
		setExternalError(externalValidationError);
		setValue(nextValue);
		setValueAsBigInt(nextBigInt);
	};

	return {
		value,
		valueAsBigInt,
		handleInputChange,

		isNumberError,
		isExternalError,
		isError: isNumberError || isExternalError,

		numberError,
		externalError,
	};
};

export { useBigIntInput, NumberError, ExternalError };
