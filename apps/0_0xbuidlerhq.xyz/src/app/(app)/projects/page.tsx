"use client";

import { Box } from "@0xbuidlerhq/ui/system/base/box";
import { Container } from "@0xbuidlerhq/ui/system/base/container";
import { H1, H2 } from "@0xbuidlerhq/ui/system/base/typography";
import { Projects } from "@content/projects";
import { AnimatePresence, motion } from "motion/react";
import Image from "next/image";
import Link from "next/link";
import { useMemo, useState } from "react";

type Project = (typeof Projects)[number];

const ProjectCard = ({ project }: { project: Project }) => {
	const [hovered, setHovered] = useState(false);

	const description = useMemo(
		() => project.description ?? `Explore ${project.name} crafted by the 0xBuidlerHQ team.`,
		[project.description, project.name],
	);

	const handlers = {
		onMouseEnter: () => setHovered(true),
		onMouseLeave: () => setHovered(false),
		onFocus: () => setHovered(true),
		onBlur: () => setHovered(false),
	};

	return (
		<motion.div
			className="relative w-full"
			whileHover={{ y: -6 }}
			initial={{ opacity: 0, y: 12 }}
			whileInView={{ opacity: 1, y: 0 }}
			viewport={{ once: true, amount: 0.3 }}
			transition={{ duration: 0.4, ease: [0.21, 0.47, 0.32, 0.99] }}
			{...handlers}
		>
			<Box className="group relative flex min-h-[240px] flex-1 flex-col rounded-xl bg-muted p-4">
				<Box className="relative mb-4 h-40 overflow-hidden rounded-2xl border border-muted/40 bg-gradient-to-br from-muted/40 via-background to-card">
					<Box className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(255,255,255,0.08),transparent_35%),radial-gradient(circle_at_80%_10%,rgba(0,0,0,0.07),transparent_40%)]" />
					<Image
						src={project.img}
						alt={project.name}
						fill
						sizes="260px"
						className="rounded-2xl object-cover transition duration-500 ease-out group-hover:scale-105"
						priority={false}
					/>
				</Box>

				<H2 className="font-syne font-semibold leading-tight text-foreground">{project.name}</H2>

				<AnimatePresence>
					{hovered && (
						<motion.div
							key={project.id}
							className="pointer-events-auto absolute left-1/2 top-[-18%] z-30 w-[340px] max-w-[90vw] -translate-x-1/2 overflow-hidden rounded-3xl border border-muted/60 bg-background/95 shadow-[0_24px_70px_-30px_rgba(0,0,0,0.45)] backdrop-blur-xl md:top-[-30%]"
							initial={{ opacity: 0, y: 24, scale: 0.9 }}
							animate={{ opacity: 1, y: 0, scale: 1 }}
							exit={{ opacity: 0, y: 12, scale: 0.94 }}
							transition={{ duration: 0.38, ease: [0.21, 0.47, 0.32, 0.99] }}
							{...handlers}
						>
							<Box className="relative h-40 overflow-hidden bg-card">
								<Image
									src={project.img}
									alt={`${project.name} preview`}
									fill
									sizes="340px"
									className="object-cover"
									priority={false}
								/>

								<motion.div
									className="absolute inset-0 bg-gradient-to-t from-background via-background/40 to-transparent"
									initial={{ opacity: 0 }}
									animate={{ opacity: 1 }}
									exit={{ opacity: 0 }}
									transition={{ duration: 0.4 }}
								/>
							</Box>

							<Box className="flex flex-col gap-2 px-5 pb-5 pt-4">
								<H1 className="font-syne font-semibold text-foreground">{project.name}</H1>
								<p className="text-sm leading-tight text-muted-foreground">{description}</p>

								<Link
									href={project.url}
									target="_blank"
									className="mt-1 inline-flex items-center justify-center gap-2 self-start rounded-full bg-foreground px-4 py-2 text-sm font-semibold text-background transition duration-200 hover:scale-[1.02] hover:bg-foreground/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-background"
								>
									Visit site
									<span aria-hidden className="text-base">
										↗
									</span>
								</Link>
							</Box>
						</motion.div>
					)}
				</AnimatePresence>
			</Box>
		</motion.div>
	);
};

const Page = () => {
	return (
		<Container className="pb-20">
			<Box className="relative grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
				{Projects.map((project) => (
					<ProjectCard key={project.id} project={project} />
				))}
			</Box>
		</Container>
	);
};

export default Page;
