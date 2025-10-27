import { cn } from "@0xbuidlerhq/ui/shadcn/lib/utils";

interface TypographyProps extends React.HTMLAttributes<HTMLElement> {}

const H1_6 = ({ children, className, ...props }: TypographyProps) => (
	<h1 className={cn(className, "md:text-9xl! text-5xl!")} {...props}>
		{children}
	</h1>
);

const H1_5 = ({ children, className, ...props }: TypographyProps) => (
	<h1 className={cn(className, "text-8xl")} {...props}>
		{children}
	</h1>
);

const H1_4 = ({ children, className, ...props }: TypographyProps) => (
	<h1 className={cn(className, "text-7xl")} {...props}>
		{children}
	</h1>
);

const H1_3 = ({ children, className, ...props }: TypographyProps) => (
	<h1 className={cn(className, "text-6xl")} {...props}>
		{children}
	</h1>
);

const H1_2 = ({ children, className, ...props }: TypographyProps) => (
	<h1 className={cn(className, "text-5xl")} {...props}>
		{children}
	</h1>
);

const H1_1 = ({ children, className, ...props }: TypographyProps) => (
	<h1 className={cn(className, "text-4xl")} {...props}>
		{children}
	</h1>
);

const H1_0 = ({ children, className, ...props }: TypographyProps) => (
	<h1 className={cn(className, "text-3xl")} {...props}>
		{children}
	</h1>
);

const H1 = ({ children, className, ...props }: TypographyProps) => (
	<h1 className={cn(className, "text-2xl")} {...props}>
		{children}
	</h1>
);

const H2 = ({ children, className, ...props }: TypographyProps) => (
	<h2 className={cn(className, "text-xl")} {...props}>
		{children}
	</h2>
);

const H3 = ({ children, className, ...props }: TypographyProps) => (
	<h3 className={cn(className, "text-lg")} {...props}>
		{children}
	</h3>
);

const H4 = ({ children, className, ...props }: TypographyProps) => (
	<h4 className={cn(className, "text-base")} {...props}>
		{children}
	</h4>
);

const H5 = ({ children, className, ...props }: TypographyProps) => (
	<h5 className={cn(className, "text-sm")} {...props}>
		{children}
	</h5>
);

const H6 = ({ children, className, ...props }: TypographyProps) => (
	<h6 className={cn(className, "text-xs")} {...props}>
		{children}
	</h6>
);

const P = ({ children, className, ...props }: TypographyProps) => (
	<p className={cn(className, "text-base")} {...props}>
		{children}
	</p>
);

export { H1_0, H1_2, H1_3, H1_4, H1_5, H1_6, H1_1, H1, H2, H3, H4, H5, H6, P };
