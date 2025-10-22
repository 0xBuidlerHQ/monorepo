import { Box } from "@0xbuidlerhq/ui/system/base/box";
import { Footer as FooterPrimitive } from "@0xbuidlerhq/ui/system/layouts/footer";
import { type IconType, SiGithub, SiX, SiYoutube } from "@icons-pack/react-simple-icons";

const FooterLinks = () => {
	const FooterLink = (props: { icon: IconType }) => {
		return (
			<Box>
				<props.icon className="size-5" />
			</Box>
		);
	};

	return (
		<Box className="flex justify-center gap-2">
			<FooterLink icon={SiYoutube} />
			<FooterLink icon={SiX} />
			<FooterLink icon={SiGithub} />
		</Box>
	);
};

const Footer = () => {
	return (
		<FooterPrimitive>
			<Box className="py-4 min-h-20 flex flex-col-reverse">
				<FooterLinks />
			</Box>
		</FooterPrimitive>
	);
};

export { Footer };
