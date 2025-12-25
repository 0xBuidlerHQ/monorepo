type IntlNumberFormat = Parameters<typeof Intl.NumberFormat>;

const formatKMBDefaultOptions: IntlNumberFormat = [
	"en-US",
	{
		notation: "compact",
		compactDisplay: "short",
		roundingMode: "trunc",
		minimumFractionDigits: 2,
		maximumFractionDigits: 2,
	},
];

const formatKMB = (options: IntlNumberFormat = formatKMBDefaultOptions) => {
	return new Intl.NumberFormat(...options).format;
};

export { formatKMB };
