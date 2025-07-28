import { cn } from "@ethos/ui/shadcn/lib/utils";
import { Container } from "@ethos/ui/system/base/container";

interface FooterProps extends React.HTMLAttributes<HTMLElement> {}

const Footer = ({ children, className }: FooterProps) => (
	<Container className={cn(className)}>{children}</Container>
);

export { Footer };
