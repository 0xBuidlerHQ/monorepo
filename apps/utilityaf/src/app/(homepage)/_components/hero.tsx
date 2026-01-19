import { Box } from "@0xbuidlerhq/ui/system/base/box";
import { H1_6, H2 } from "@0xbuidlerhq/ui/system/base/typography";
import { Floating } from "@client/components/animated/Floating";
import { Sparkles } from "lucide-react";

const Hero = () => {
	return (
		<Box className="flex flex-col gap-2 py-10">
			<Box className="relative">
				<Box className="absolute -z-10 -top-10 left-1/10 -rotate-[5deg] text-yellow-500">
					<Floating>
						<Sparkles className="size-8" />
					</Floating>
				</Box>

				<Box className="absolute -bottom-1 right-1/9 -z-10 rotate-[5deg] text-rose-400">
					<Floating>
						<Sparkles className="size-8" />
					</Floating>
				</Box>

				<Box className="absolute -top-10 right-1/2 -z-10  rotate-[5deg] text-blue-500">
					<Floating>
						<Sparkles className="size-8" />
					</Floating>
				</Box>

				<Box className="absolute top-6 right-1/4 -z-10  rotate-[5deg] text-green-400">
					<Floating>
						<Sparkles className="size-8" />
					</Floating>
				</Box>

				<Box>
					<H1_6 className="relative font-extrabold font-montserrat">
						Do <span className="text-purple-400 font-black">More,</span>
					</H1_6>

					<H1_6 className="relative font-extrabold font-montserrat">
						With <span className="text-orange-400 font-black">Less.</span>
					</H1_6>
				</Box>
			</Box>

			<H2 className="font-semibold text-muted-foreground font-montserrat">
				A lightweight toolkit that keeps everything quick and simple.
			</H2>
		</Box>
	);
};

export { Hero };
