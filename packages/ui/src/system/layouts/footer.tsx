import { cn } from "@0xbuidlerhq/ui/shadcn/lib/utils";
import { Container } from "@0xbuidlerhq/ui/system/base/container";

interface FooterProps extends React.HTMLAttributes<HTMLElement> {}

const Footer = ({ children, className }: FooterProps) => (
	<Container className={cn(className)}>{children}</Container>
);

export { Footer };
