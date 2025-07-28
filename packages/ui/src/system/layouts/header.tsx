import { cn } from "@ethos/ui/shadcn/lib/utils";
import { Container } from "@ethos/ui/system/base/container";

interface HeaderProps extends React.HTMLAttributes<HTMLElement> {}

const Header = ({ children, className }: HeaderProps) => (
	<Container className={cn(className)}>{children}</Container>
);

export { Header };
