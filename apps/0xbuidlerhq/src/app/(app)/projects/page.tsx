"use client";

import { Box } from "@0xbuidlerhq/ui/system/base/box";
import { Container } from "@0xbuidlerhq/ui/system/base/container";
import { H1, H5, H6 } from "@0xbuidlerhq/ui/system/base/typography";
import { ButtonBase } from "@0xbuidlerhq/ui/system/buttons/ButtonBase";
import { Projects } from "@content/projects";
import { motion } from "motion/react";
import Image from "next/image";

type Project = (typeof Projects)[number];

const ProjectCard = ({ project }: { project: Project }) => {
	return (
		<ButtonBase href={project.url} external>
			<motion.div
				className="relative w-full"
				whileHover={{ y: -6 }}
				initial={{ opacity: 0, y: 12 }}
				whileInView={{ opacity: 1, y: 0 }}
				viewport={{ once: true, amount: 0.3 }}
				transition={{ duration: 0.4, ease: [0.21, 0.47, 0.32, 0.99] }}
			>
				<Box className="group relative flex min-h-[240px] flex-1 flex-col rounded bg-muted/80 p-2">
					<Box className="relative mb-4 h-40 overflow-hidden rounded border border-muted/40 bg-gradient-to-br from-muted/40 via-background to-card">
						<Box className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(255,255,255,0.08),transparent_35%),radial-gradient(circle_at_80%_10%,rgba(0,0,0,0.07),transparent_40%)]" />
						<Image
							src={project.img}
							alt={project.name}
							fill
							sizes="260px"
							className="fit transition duration-500 ease-out group-hover:scale-105"
							priority={false}
						/>
					</Box>

					<Box className="flex flex-col gap-2">
						<Box className="flex flex-col gap-1">
							<H1 className="font-montserrat font-semibold leading-tight text-foreground">
								{project.name}
							</H1>

							<Box className="flex flex-wrap gap-1 rounded *:px-[2px]">
								{project.stack.library && (
									<H6 className="bg-cyan-500/10 font-syne font-bold text-cyan-500 inline-block">
										Library
									</H6>
								)}
								{project.stack.web.map((item) => (
									<H6
										key={item}
										className="bg-orange-500/10 font-syne font-bold text-orange-500 inline-block"
									>
										{item}
									</H6>
								))}
								{project.stack.crypto?.map((item) => (
									<H6
										key={item}
										className="bg-purple-500/10 font-syne font-bold text-purple-500 inline-block"
									>
										{item}
									</H6>
								))}
								{project.stack.animation?.map((item) => (
									<H6
										key={item}
										className="bg-emerald-500/10 font-syne font-bold text-emerald-500 inline-block"
									>
										{item}
									</H6>
								))}
							</Box>
						</Box>

						<H5 className="text-muted-foreground font-montserrat tracking-tighter">
							{project.description}
						</H5>
					</Box>
				</Box>
			</motion.div>
		</ButtonBase>
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
