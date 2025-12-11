import { cn } from "@0xbuidlerhq/ui/shadcn/lib/utils";

interface TypographyProps extends React.HTMLAttributes<HTMLElement> {}

/**
 * Hero / display headings above normal H1.
 * Each H1_x has:
 * - A unique size at every breakpoint
 * - Smaller on mobile, larger on wide screens
 */

const H1_6 = ({ children, className, ...props }: TypographyProps) => (
	<h1
		className={cn(
			"text-5xl sm:text-6xl md:text-7xl lg:text-8xl xl:text-9xl 2xl:text-9xl",
			// "overflow-hidden",
			className,
		)}
		{...props}
	>
		{children}
	</h1>
);

const H1_5 = ({ children, className, ...props }: TypographyProps) => (
	<h1
		className={cn(
			"text-4xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl 2xl:text-8xl",
			// "overflow-hidden",
			className,
		)}
		{...props}
	>
		{children}
	</h1>
);

const H1_4 = ({ children, className, ...props }: TypographyProps) => (
	<h1
		className={cn(
			"text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl 2xl:text-7xl",
			// "overflow-hidden",
			className,
		)}
		{...props}
	>
		{children}
	</h1>
);

const H1_3 = ({ children, className, ...props }: TypographyProps) => (
	<h1
		className={cn(
			"text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl 2xl:text-6xl",
			// "overflow-hidden",
			className,
		)}
		{...props}
	>
		{children}
	</h1>
);

const H1_2 = ({ children, className, ...props }: TypographyProps) => (
	<h1
		className={cn(
			"text-xl sm:text-2xl md:text-3xl lg:text-4xl xl:text-5xl 2xl:text-5xl",
			// "overflow-hidden",
			className,
		)}
		{...props}
	>
		{children}
	</h1>
);

const H1_1 = ({ children, className, ...props }: TypographyProps) => (
	<h1
		className={cn(
			"text-lg sm:text-xl md:text-2xl lg:text-3xl xl:text-4xl 2xl:text-4xl",
			// "overflow-hidden",
			className,
		)}
		{...props}
	>
		{children}
	</h1>
);

const H1_0 = ({ children, className, ...props }: TypographyProps) => (
	<h1
		className={cn(
			"text-base sm:text-lg md:text-xl lg:text-2xl xl:text-3xl 2xl:text-3xl",
			// "overflow-hidden",
			className,
		)}
		{...props}
	>
		{children}
	</h1>
);

/**
 * Normal document headings
 */

const H1 = ({ children, className, ...props }: TypographyProps) => (
	<h1 className={cn("text-2xl", className)} {...props}>
		{children}
	</h1>
);

const H2 = ({ children, className, ...props }: TypographyProps) => (
	<h2 className={cn("text-xl", className)} {...props}>
		{children}
	</h2>
);

const H3 = ({ children, className, ...props }: TypographyProps) => (
	<h3 className={cn("text-lg", className)} {...props}>
		{children}
	</h3>
);

const H4 = ({ children, className, ...props }: TypographyProps) => (
	<h4 className={cn("text-base", className)} {...props}>
		{children}
	</h4>
);

const H5 = ({ children, className, ...props }: TypographyProps) => (
	<h5 className={cn("text-sm", className)} {...props}>
		{children}
	</h5>
);

const H6 = ({ children, className, ...props }: TypographyProps) => (
	<h6 className={cn("text-xs", className)} {...props}>
		{children}
	</h6>
);

const H7 = ({ children, className, ...props }: TypographyProps) => (
	<h6 className={cn("text-[10px]", className)} {...props}>
		{children}
	</h6>
);

const P = ({ children, className, ...props }: TypographyProps) => (
	<p className={cn("text-base", className)} {...props}>
		{children}
	</p>
);

export { H1_0, H1_1, H1_2, H1_3, H1_4, H1_5, H1_6, H1, H2, H3, H4, H5, H6, H7, P };
