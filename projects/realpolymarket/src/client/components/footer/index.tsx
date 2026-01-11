import { Box } from "@0xbuidlerhq/ui/system/base/box";
import { H4 } from "@0xbuidlerhq/ui/system/base/typography";
import { Footer as FooterPrimitive } from "@0xbuidlerhq/ui/system/layouts/footer";

const Footer = () => {
	return (
		<FooterPrimitive className="py-4 font-montserrat">
			<Box className="flex justify-between">
				<H4 className="font-semibold">DexPairsView, 2026.</H4>
				<H4 className="text-right font-semibold">Made by 0xBuidlerhq.</H4>
			</Box>
		</FooterPrimitive>
	);
};

export { Footer };
