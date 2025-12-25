type IntlNumberFormat = Parameters<typeof Intl.NumberFormat>;

const formatNumberDefaultOptions: IntlNumberFormat = [
	"en-US",
	{
		style: "decimal",
		roundingMode: "trunc",
		maximumFractionDigits: 4,
	},
];

const formatNumber = (options: IntlNumberFormat = formatNumberDefaultOptions) => {
	return new Intl.NumberFormat(...options).format;
};

export { formatNumber };
