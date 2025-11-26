import { Box } from "@0xbuidlerhq/ui/system/base/box";
import { H4 } from "@0xbuidlerhq/ui/system/base/typography";
import { ButtonBase } from "@0xbuidlerhq/ui/system/buttons/ButtonBase";
import { Footer as FooterPrimitive } from "@0xbuidlerhq/ui/system/layouts/footer";
import { PAGES } from "@config/pages";
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
			>
				<H4>{props.name}</H4>
				<props.icon className="size-4" />
			</ButtonBase>
		);
	};

	return (
		<Box className="flex flex-wrap justify-center gap-x-4 gap-y-2">
			<FooterLink icon={SiTelegram} name="telegram" href={PAGES._spotify} />
			<FooterLink icon={SiGithub} name="github" href={PAGES._github} />
			<FooterLink icon={SiX} name="twitter" href={PAGES._twitter} />
			<FooterLink icon={SiYoutube} name="youtube" href={PAGES._youtube} />
			<FooterLink icon={SiSpotify} name="spotify" href={PAGES._spotify} />
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
