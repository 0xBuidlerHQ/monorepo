/**
 * @dev
 */

const options: Intl.NumberFormatOptions = {
	style: "currency",
	currency: "USD",
};

const formatUSD = (
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

export { formatUSD };
