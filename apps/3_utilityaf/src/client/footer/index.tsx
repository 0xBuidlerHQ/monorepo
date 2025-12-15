import { Constants } from "@0xbuidlerhq/core";
import { Box } from "@0xbuidlerhq/ui/system/base/box";
import { H5 } from "@0xbuidlerhq/ui/system/base/typography";
import { ButtonBase } from "@0xbuidlerhq/ui/system/buttons/ButtonBase";
import { Footer as FooterPrimitive } from "@0xbuidlerhq/ui/system/layouts/footer";
import { SiGithub, SiTelegram, SiX, SiYoutube } from "@icons-pack/react-simple-icons";

const Footer = () => {
	return (
		<Box className="mt-10">
			<FooterPrimitive className="flex justify-end items-center py-2 gap-2">
				<ButtonBase external href={Constants.Links.GLOBAL.x}>
					<Box className="flex gap-1">
						<H5>Buidl by</H5>
						<H5 className="font-bold">0xBuidler</H5>
					</Box>
				</ButtonBase>

				<Box className="h-3 bg-muted-foreground w-[2px]" />

				<Box className="flex gap-1">
					<ButtonBase external href={Constants.Links.GLOBAL.telegram}>
						<SiTelegram className="size-4" />
					</ButtonBase>

					<ButtonBase external href={Constants.Links.GLOBAL.github}>
						<SiGithub className="size-4" />
					</ButtonBase>

					<ButtonBase external href={Constants.Links.GLOBAL.x}>
						<SiX className="size-4" />
					</ButtonBase>

					<ButtonBase external href={Constants.Links.GLOBAL.youtube}>
						<SiYoutube className="size-4" />
					</ButtonBase>
				</Box>
			</FooterPrimitive>
		</Box>
	);
};

export { Footer };
