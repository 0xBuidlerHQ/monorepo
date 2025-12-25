type IntlNumberFormat = Parameters<typeof Intl.NumberFormat>;

const formatPercentDefaultOptions: IntlNumberFormat = [
	"en-US",
	{
		style: "currency",
		currency: "USD",
	},
];

const formatUSD = (options: IntlNumberFormat = formatPercentDefaultOptions) => {
	return new Intl.NumberFormat(...options).format;
};

export { formatUSD };
