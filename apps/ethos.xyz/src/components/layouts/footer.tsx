import { Footer as FooterPrimitive } from "@ethos/ui/system/layouts/footer";
import { SiDiscord, SiTelegram, SiX } from "@icons-pack/react-simple-icons";

const Footer = () => {
	return (
		<FooterPrimitive className="flex gap-4 py-4">
			<SiTelegram className="size-5" />
			<SiX className="size-5" />
			<SiDiscord className="size-5" />
		</FooterPrimitive>
	);
};

export { Footer };
