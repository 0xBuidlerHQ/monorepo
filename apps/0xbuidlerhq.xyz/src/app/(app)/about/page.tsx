import { cn } from "@0xbuidlerhq/ui/shadcn/lib/utils";
import { Box } from "@0xbuidlerhq/ui/system/base/box";
import { H1_6, P } from "@0xbuidlerhq/ui/system/base/typography";
import { ButtonBase } from "@0xbuidlerhq/ui/system/buttons/ButtonBase";
import { PAGES } from "@config/pages";
import { ExternalLink } from "lucide-react";

const MutedCoolText = (props: { text: string }) => {
	return <span className="text-muted-foreground bg-muted px-1">{props.text}</span>;
};

const CoolText = (props: { text: string }) => {
	return <span className="px-1 bg-red-500 text-white font-medium">{props.text}</span>;
};

const CoolTextLink = (props: { text: string; href: string; external?: boolean }) => {
	return (
		<ButtonBase href={props.href} external={props.external}>
			<span className="px-1 bg-red-500 text-white font-medium relative group hover:px-3 transition-all">
				<ExternalLink className="absolute size-3 -top-[2px] -right-[14px] text-red-500 group-hover:-top-[6px] group-hover:-right-[12px] transition-all" />

				{props.text}
			</span>
		</ButtonBase>
	);
};

const ILove = (props: { text: string; force?: boolean }) => {
	return (
		<P>
			<span className="text-muted-foreground bg-muted px-1">I love</span>
			<span
				className={cn(
					"hover:text-white hover:bg-red-500 px-1",
					props.force && "text-white bg-red-500",
				)}
			>
				{props.text}
			</span>
			.
		</P>
	);
};

const Page = () => {
	return (
		<Box className="mt-10 relative flex flex-col gap-6">
			<H1_6 className="text-accent rounded font-black">ABOUT</H1_6>

			<Box className="leading-5">
				<Box className="leading-1">
					<P>
						Hello, my name is <CoolText text="Maxime" /> & my main goal is to make this{" "}
						<CoolText text=" world a better place" />.
					</P>
					<br />
					<P>
						I'm a <CoolText text="Software Engineer" />. I worked at <MutedCoolText text="Bancor" />{" "}
						, <MutedCoolText text="Ledger" />, <MutedCoolText text="Giza" />.
					</P>
				</Box>

				<br />

				<Box>
					<P>
						👷🏼‍♂️ I'm a master at beginning <CoolTextLink text="projects" href={PAGES.projects} />.
						<br />
						{/*  
						/
						*/}
						🎵 I make noise until it sounds like <CoolTextLink text="music" href={PAGES.music} />.
						<br />
						{/*  
						/
						*/}
						✍ I write and share my humble <CoolTextLink text="thoughts" href={PAGES.thoughts} />.
						<br />
						{/*  
						/
						*/}
						📹 I document my journey and the things I love on{" "}
						<CoolTextLink text="youtube" href={PAGES._youtube} external />.
					</P>
				</Box>

				<br />

				<Box className="leading-1">
					<ILove text="the sun" force />
					<ILove text="hanging out with friends & family" />
					<ILove text="meeting new people & cultures" />
					<ILove text="learning new languages" />
					<ILove text="skateboarding" />
					<ILove text="programming" />
					<ILove text="playing football" />
					<ILove text="oysters" />
				</Box>

				<br />

				<P>
					I recently bought a <CoolText text="motobike" /> and it makes me really happy.
				</P>
			</Box>
		</Box>
	);
};

export default Page;
