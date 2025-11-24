import { Box } from "@0xbuidlerhq/ui/system/base/box";
import { H4 } from "@0xbuidlerhq/ui/system/base/typography";
import { ButtonBase } from "@0xbuidlerhq/ui/system/buttons/ButtonBase";
import { Footer as FooterPrimitive } from "@0xbuidlerhq/ui/system/layouts/footer";
import { PAGES } from "@config/pages";
import { type IconType, SiGithub, SiX, SiYoutube } from "@icons-pack/react-simple-icons";

const FooterLinks = () => {
	const FooterLink = (props: { icon: IconType; name: string; href: string }) => {
		return (
			<ButtonBase className="flex gap-1 hover:underline items-center" href={props.href}>
				<H4>{props.name}</H4>
				<props.icon className="size-3" />
			</ButtonBase>
		);
	};

	return (
		<Box className="flex justify-center gap-3">
			<FooterLink icon={SiYoutube} name="youtube" href={PAGES._youtube} />
			<FooterLink icon={SiX} name="twitter" href={PAGES._twitter} />
			<FooterLink icon={SiGithub} name="github" href={PAGES._github} />
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
