import { SiDiscord, SiReddit, SiX } from "@icons-pack/react-simple-icons";
import { Button } from "@web-playground/ui/shadcn/components/button";
import { Separator } from "@web-playground/ui/shadcn/components/separator";
import { Box } from "@web-playground/ui/system/base/box";
import { Footer as FooterPrimitive } from "@web-playground/ui/system/layouts/footer";
import { H5, H6 } from "@web-playground/ui/system/typography";
import Link from "next/link";
import { URLS } from "src/utils/urls";
import PackageJson from "../../../package.json";

const Footer = () => {
	return (
		<Box className="bg-accent">
			<FooterPrimitive>
				<div className="flex justify-between px-2 py-8">
					<div className="flex gap-3">
						<Button
							asChild
							variant="ghost"
							className="h-auto bg-transparent p-0"
						>
							<Link href={URLS.discord}>
								<SiDiscord className="h-5 w-5" />
							</Link>
						</Button>

						<Button
							asChild
							variant="ghost"
							className="h-auto bg-transparent p-0"
						>
							<Link href={URLS.twitter}>
								<SiX className="h-5 w-5" />
							</Link>
						</Button>

						<Button
							asChild
							variant="ghost"
							className="h-auto bg-transparent p-0"
						>
							<Link href={URLS.reddit}>
								<SiReddit className="h-5 w-5" />
							</Link>
						</Button>
					</div>
				</div>

				<Separator className="dark:bg-accent-foreground dark:opacity-10" />

				<div className="flex flex-col justify-between px-2 md:flex-row">
					<div className="grid grid-flow-row gap-8 py-10 md:grid-flow-col md:gap-40">
						{/* <Image src={LogoNice} alt="" className="h-20 w-20 self-center" /> */}
					</div>

					<div className="flex flex-col items-end gap-2 self-end py-10">
						{/* <Image src={Logo} alt="" className="h-4 w-auto dark:invert" /> */}
						<H5 className="font-normal">© 2024 Dusk. All Rights Reserved.</H5>
					</div>
				</div>

				<Separator className="dark:bg-accent-foreground dark:opacity-10" />

				<div className="flex flex-col gap-1 px-2 py-2 md:flex-row md:justify-between md:gap-0 items-center">
					<H6 className="font-semibold">Duskscan</H6>

					<div className="flex items-center gap-1">
						<H6 className="font-normal">
							Made with love by
							<Button variant="ghost" className="h-auto p-0">
								&nbsp;
								<H6 className="underline underline-offset-4">@sshmaxime</H6>
								&nbsp;
							</Button>
						</H6>
					</div>

					<div>
						<span className="text-xs font-semibold">
							v{PackageJson.version}
						</span>
					</div>
				</div>
			</FooterPrimitive>
		</Box>
	);
};

export { Footer };
