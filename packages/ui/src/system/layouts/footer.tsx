import { cn } from "@0xbuidlerhq/ui/shadcn/lib/utils";
import { Container } from "@0xbuidlerhq/ui/system/base/container";

interface FooterProps extends React.HTMLAttributes<HTMLElement> {}

const Footer = ({ children, className }: FooterProps) => (
	<Container
		className={cn(
			"mx-auto max-w-[var(--footer-w)] px-[var(--footer-px)] box-content w-[calc(100vw-2*var(--footer-px))]",
			className,
		)}
	>
		{children}
	</Container>
);

export { Footer };
