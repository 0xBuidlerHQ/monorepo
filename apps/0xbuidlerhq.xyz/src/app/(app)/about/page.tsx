import { Box } from "@0xbuidlerhq/ui/system/base/box";
import { Container } from "@0xbuidlerhq/ui/system/base/container";
import { H1_6, P } from "@0xbuidlerhq/ui/system/base/typography";
import { ButtonBase } from "@0xbuidlerhq/ui/system/buttons/ButtonBase";
import { PAGES } from "@config/pages";
import { ExternalLink } from "lucide-react";

const CoolText = (props: { text: string }) => {
	return <span className="px-1 bg-muted text-black! font-medium">{props.text}</span>;
};

const CoolTextLink = (props: { text: string; href: string; external?: boolean }) => {
	return (
		<ButtonBase href={props.href} external={props.external}>
			<span className="px-1 bg-black text-white font-medium relative group transition-all">
				<ExternalLink className="absolute size-3 -top-[2px] -right-[14px] text-black group-hover:-top-[6px] group-hover:-right-[12px] transition-all" />

				{props.text}
			</span>
		</ButtonBase>
	);
};

const ILove = (props: { text: string }) => {
	return (
		<P>
			<span className="pr-1">I love</span>
			<CoolText text={props.text} />.
		</P>
	);
};

const Page = () => {
	return (
		<Container>
			<Box className="mt-10 relative flex flex-col gap-6">
				<H1_6 className="text-accent rounded font-black">ABOUT</H1_6>

				<Box className="leading-5">
					<Box className="leading-5">
						<P>
							My name is <CoolText text="Maxime" />.
						</P>
					</Box>

					<br />

					<Box>
						<P>
							👷🏼‍♂️ I'm a master at beginning{" "}
							<CoolTextLink text="projects" href={PAGES._github} external />
							.
							<br />
							{/*  
                        /
                        */}
							🎵 I make noise until it sounds like{" "}
							<CoolTextLink text="music" href={PAGES._spotify} external />.
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

					<Box>
						<ILove text="the sun" />
						<ILove text="hanging out with friends & family" />
						<ILove text="meeting new people & cultures" />
						<ILove text="learning new languages" />
						<ILove text="skateboarding" />
						<ILove text="programming" />
						<ILove text="playing football" />
						<ILove text="oysters" />
						<ILove text="riding my motobike" />
					</Box>
				</Box>
			</Box>
		</Container>
	);
};

export default Page;
