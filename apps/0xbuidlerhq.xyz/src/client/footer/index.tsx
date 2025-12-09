import { Constants } from "@0xbuidlerhq/core";
import { Box } from "@0xbuidlerhq/ui/system/base/box";
import { H4 } from "@0xbuidlerhq/ui/system/base/typography";
import { ButtonBase } from "@0xbuidlerhq/ui/system/buttons/ButtonBase";
import { Footer as FooterPrimitive } from "@0xbuidlerhq/ui/system/layouts/footer";
import {
	type IconType,
	SiGithub,
	SiSpotify,
	SiTelegram,
	SiX,
	SiYoutube,
} from "@icons-pack/react-simple-icons";

const FooterLinks = () => {
	const FooterLink = (props: { icon: IconType; name: string; href: string }) => {
		return (
			<ButtonBase
				className="flex gap-1 hover:underline items-center underline-offset-2"
				href={props.href}
				external
			>
				<H4>{props.name}</H4>
				<props.icon className="size-4" />
			</ButtonBase>
		);
	};

	return (
		<Box className="flex flex-wrap justify-center gap-x-4 gap-y-2">
			<FooterLink icon={SiTelegram} name="telegram" href={Constants.Links.GLOBAL.telegram} />
			<FooterLink icon={SiGithub} name="github" href={Constants.Links.GLOBAL.github} />
			<FooterLink icon={SiX} name="twitter" href={Constants.Links.GLOBAL.x} />
			<FooterLink icon={SiYoutube} name="youtube" href={Constants.Links.GLOBAL.youtube} />
			<FooterLink icon={SiSpotify} name="spotify" href={Constants.Links.GLOBAL.spotify} />
		</Box>
	);
};

const Footer = () => {
	return (
		<FooterPrimitive className="pt-10">
			<Box className="py-4 min-h-20 flex flex-col-reverse">
				<FooterLinks />
			</Box>
		</FooterPrimitive>
	);
};

export { Footer };
