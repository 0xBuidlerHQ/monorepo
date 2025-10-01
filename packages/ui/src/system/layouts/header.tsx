import { cn } from "@0xbuidlerhq/ui/shadcn/lib/utils";
import { Container } from "@0xbuidlerhq/ui/system/base/container";

interface HeaderProps extends React.HTMLAttributes<HTMLElement> {}

const Header = ({ children, className }: HeaderProps) => (
	<Container className={cn(className)}>{children}</Container>
);

export { Header };
