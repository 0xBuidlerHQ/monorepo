import { cn } from "@0xbuidlerhq/ui/shadcn/lib/utils";

interface TypographyProps extends React.HTMLAttributes<HTMLElement> {}

const H1_6 = ({ children, className, ...props }: TypographyProps) => (
	<h1 className={cn(className, "md:text-9xl! text-6xl! overflow-hidden")} {...props}>
		{children}
	</h1>
);

const H1_5 = ({ children, className, ...props }: TypographyProps) => (
	<h1 className={cn(className, "text-8xl overflow-hidden")} {...props}>
		{children}
	</h1>
);

const H1_4 = ({ children, className, ...props }: TypographyProps) => (
	<h1 className={cn(className, "text-7xl overflow-hidden")} {...props}>
		{children}
	</h1>
);

const H1_3 = ({ children, className, ...props }: TypographyProps) => (
	<h1 className={cn(className, "text-6xl overflow-hidden")} {...props}>
		{children}
	</h1>
);

const H1_2 = ({ children, className, ...props }: TypographyProps) => (
	<h1 className={cn(className, "text-5xl overflow-hidden")} {...props}>
		{children}
	</h1>
);

const H1_1 = ({ children, className, ...props }: TypographyProps) => (
	<h1 className={cn(className, "text-4xl overflow-hidden")} {...props}>
		{children}
	</h1>
);

const H1_0 = ({ children, className, ...props }: TypographyProps) => (
	<h1 className={cn(className, "text-3xl overflow-hidden")} {...props}>
		{children}
	</h1>
);

const H1 = ({ children, className, ...props }: TypographyProps) => (
	<h1 className={cn(className, "text-2xl overflow-hidden")} {...props}>
		{children}
	</h1>
);

const H2 = ({ children, className, ...props }: TypographyProps) => (
	<h2 className={cn(className, "text-xl overflow-hidden")} {...props}>
		{children}
	</h2>
);

const H3 = ({ children, className, ...props }: TypographyProps) => (
	<h3 className={cn(className, "text-lg overflow-hidden")} {...props}>
		{children}
	</h3>
);

const H4 = ({ children, className, ...props }: TypographyProps) => (
	<h4 className={cn(className, "text-base overflow-hidden")} {...props}>
		{children}
	</h4>
);

const H5 = ({ children, className, ...props }: TypographyProps) => (
	<h5 className={cn(className, "text-sm overflow-hidden")} {...props}>
		{children}
	</h5>
);

const H6 = ({ children, className, ...props }: TypographyProps) => (
	<h6 className={cn(className, "text-xs overflow-hidden")} {...props}>
		{children}
	</h6>
);

const P = ({ children, className, ...props }: TypographyProps) => (
	<p className={cn(className, "text-base overflow-hidden")} {...props}>
		{children}
	</p>
);

export { H1_0, H1_2, H1_3, H1_4, H1_5, H1_6, H1_1, H1, H2, H3, H4, H5, H6, P };
