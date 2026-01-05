/**
 * @dev
 */

const options: Intl.NumberFormatOptions = {
	notation: "compact",
	compactDisplay: "short",
	roundingMode: "trunc",
	minimumFractionDigits: 2,
	maximumFractionDigits: 2,
};

const formatKMB = (
	value: Parameters<Intl.NumberFormat["format"]>[0],
	//
	overrides?: Intl.NumberFormatOptions,
	locale: Intl.LocalesArgument = "en-US",
) => {
	return new Intl.NumberFormat(
		//
		locale,
		{
			...options,
			...(overrides ?? {}),
		},
	).format(value);
};

export { formatKMB };
