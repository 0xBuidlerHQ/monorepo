import { cn } from "@0xbuidlerhq/ui/shadcn/lib/utils";
import { Container } from "@0xbuidlerhq/ui/system/base/container";

interface HeaderProps extends React.HTMLAttributes<HTMLElement> {}

const Header = ({ children, className }: HeaderProps) => (
	<Container
		className={cn(
			"mx-auto max-w-[var(--header-w)] px-[var(--header-px)] box-content w-[calc(100vw-2*var(--header-px))]",
			className,
		)}
	>
		{children}
	</Container>
);

export { Header };
