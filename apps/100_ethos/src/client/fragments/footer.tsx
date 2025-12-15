import { Links } from "@0xbuidlerhq/core/constants";
import { Box } from "@0xbuidlerhq/ui/system/base/box";
import { ButtonBase } from "@0xbuidlerhq/ui/system/buttons/ButtonBase";
import { Footer as FooterPrimitive } from "@0xbuidlerhq/ui/system/layouts/footer";
import {
	type IconType,
	SiDiscord,
	SiGithub,
	SiTelegram,
	SiX,
} from "@icons-pack/react-simple-icons";

type FooterIconProps = {
	icon: IconType;
	link: string;
};
const FooterButton = (props: FooterIconProps) => {
	return (
		<ButtonBase href={props.link} external>
			<props.icon className="size-4" />
		</ButtonBase>
	);
};

const Footer = () => {
	return (
		<Box className="bg-muted flex flex-col border-t border-accent">
			<Box className="border-b border-accent">
				<FooterPrimitive className="">
					<Box className="h-full border-x border-accent p-2 flex items-center justify-between">
						<Box className="h-full flex items-center gap-2 grow basis-0">
							<FooterButton icon={SiTelegram} link={Links.APPS.ethos_xyz.socials.telegram} />
							<FooterButton icon={SiX} link={Links.APPS.ethos_xyz.socials.twitter} />
							<FooterButton icon={SiDiscord} link={Links.APPS.ethos_xyz.socials.discord} />
							<FooterButton icon={SiGithub} link={Links.APPS.ethos_xyz.socials.github} />
						</Box>
					</Box>
				</FooterPrimitive>
			</Box>
		</Box>
	);
};

export { Footer };
