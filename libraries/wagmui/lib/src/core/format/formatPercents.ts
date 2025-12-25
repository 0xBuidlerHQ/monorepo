type IntlNumberFormat = Parameters<typeof Intl.NumberFormat>;

const formatPercentDefaultOptions: IntlNumberFormat = [
	"en-US",
	{
		style: "percent",
		minimumFractionDigits: 2,
		maximumFractionDigits: 2,
	},
];

const formatPercent = (options: IntlNumberFormat = formatPercentDefaultOptions) => {
	return new Intl.NumberFormat(...options).format;
};

export { formatPercent };
