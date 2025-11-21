"use client";

import { Separator } from "@0xbuidlerhq/ui/shadcn/components/separator";
import { cn } from "@0xbuidlerhq/ui/shadcn/lib/utils";
import { Box } from "@0xbuidlerhq/ui/system/base/box";
import { Container } from "@0xbuidlerhq/ui/system/base/container";
import { H1, H1_6, H2, H3, H4, H5, H6 } from "@0xbuidlerhq/ui/system/base/typography";
import { ButtonBase } from "@0xbuidlerhq/ui/system/buttons/ButtonBase";
import { PAGES } from "@config/pages";
import { categoryStyles, ToolCategories, type ToolCategory, Tools } from "@config/tools";
import { useForm, useStore } from "@tanstack/react-form";
import { Sparkles } from "lucide-react";
import { motion, useAnimationFrame } from "motion/react";
import type { PropsWithChildren } from "react";
import React from "react";

const useUserSearchInputForm = () => {
	const formApi = useForm({
		defaultValues: {
			search: "",
			categories: ToolCategories,
		},
	});

	return formApi;
};

type FormType = ReturnType<typeof useUserSearchInputForm>;
type FormComponent = {
	form: FormType;
};

const ToolsList = ({ form }: FormComponent) => {
	const store = useStore(form.store);
	const search = store.values.search ?? "";
	const selectedCategories = (store.values.categories ?? []) as string[];

	const query = search.trim().toLowerCase();

	const filteredTools = Object.values(Tools).filter((item) => {
		const matchesSearch = !query || `${item.name} ${item.subtitle}`.toLowerCase().includes(query);

		const matchesCategory =
			selectedCategories.length === 0 || selectedCategories.includes(item.category);

		return matchesSearch && matchesCategory;
	});

	return (
		<>
			<motion.ul
				className="grid md:grid-cols-3 grid-cols-1 gap-6"
				variants={{
					hidden: {},
					show: {
						transition: {
							staggerChildren: 0.09,
						},
					},
				}}
				layout
				initial="hidden"
				animate="show"
			>
				{filteredTools.map((item) => {
					const isAvailable = item.available;

					const bgColor = isAvailable ? "bg-green-500/10" : "bg-yellow-500/10";
					const textColor = isAvailable ? "text-green-500" : "text-yellow-500";
					const text = isAvailable ? "Available" : "Coming Soon.";

					const categoryStyle = categoryStyles[item.category];

					return (
						<motion.div
							key={item.href}
							variants={{
								hidden: { opacity: 0, y: 20, x: 0 },
								show: { opacity: 1, y: 0, x: 0 },
							}}
							layout
							initial={{ opacity: 0, y: 20 }}
							animate={{ opacity: 1, y: 0 }}
							exit={{ opacity: 0, y: -20 }}
						>
							<ButtonBase
								href={`${PAGES.tools}/${item.href}`}
								disabled={!isAvailable}
								className={cn(
									"group relative",
									isAvailable && "hover:scale-[1.025] transition-all duration-500",
								)}
							>
								<Box
									className={cn(
										"border border-accent p-4 rounded-lg flex flex-col gap-2 bg-muted/10",
										isAvailable && "bg-muted group-hover:bg-muted transition-all duration-500",
										!isAvailable && "opacity-50",
									)}
								>
									<Box>
										<Box className="p-2 border-blue-500 bg-accent rounded-lg inline-block">
											<item.icon />
										</Box>
									</Box>

									<Box>
										<H3 className="font-medium">{item.name}</H3>
										<H5 className="text-muted-foreground">{item.subtitle}</H5>
									</Box>
								</Box>

								{!isAvailable && (
									<Box className="absolute top-2 right-2">
										<Box className={cn("px-2 py-[1px] border border-accent rounded-lg", bgColor)}>
											<H6 className={cn("font-medium font-mono", textColor)}>{text}</H6>
										</Box>
									</Box>
								)}

								{isAvailable && (
									<Box className="absolute top-2 right-2">
										<Box className="flex gap-2">
											<Box className={cn("border border-accent px-2 rounded", categoryStyle.bg)}>
												<H6 className={cn("font-mono", categoryStyle.text)}>
													{categoryStyle.label}
												</H6>
											</Box>
										</Box>
									</Box>
								)}
							</ButtonBase>
						</motion.div>
					);
				})}
			</motion.ul>

			{filteredTools.length === 0 && <NotFound />}
		</>
	);
};

const NotFound = () => {
	return (
		<Box className="flex flex-col">
			<H1 className="font-semibold">The tool you are looking for is not available yet.</H1>

			<ButtonBase className="underline underline-offset-4">
				<H4 className="font-medium text-muted-foreground">Tell us what to build next ✨</H4>
			</ButtonBase>
		</Box>
	);
};

const InputBox = ({ form }: FormComponent) => {
	return (
		<>
			{/* Search field */}
			<form.Field name="search">
				{(field) => (
					<Box className="w-full">
						<input
							className="w-full bg-muted border border-accent rounded-lg h-10 p-6 font-mono"
							placeholder="Search tools..."
							value={field.state.value}
							onChange={(e) => field.handleChange(e.target.value)}
						/>
					</Box>
				)}
			</form.Field>

			{/* Category multi-select pills */}
			<Box className="flex gap-2 ml-2 mt-1 flex-wrap">
				<form.Field name="categories">
					{(field) => {
						const selected = (field.state.value ?? ToolCategories) as ToolCategory[];

						const toggleCategory = (key: ToolCategory) => {
							const all = ToolCategories as ToolCategory[];

							const isSelected = selected.includes(key);
							const isAllSelected = selected.length === all.length;
							const isLastSelected = selected.length === 1 && isSelected;

							// 1) All selected → clicking one => only that one stays selected
							if (isAllSelected && isSelected) {
								return field.handleChange([key]);
							}

							// 2) Last one selected → clicking it => select all
							if (isLastSelected) {
								return field.handleChange(all);
							}

							// 3) Normal toggle behaviour
							const updated = isSelected ? selected.filter((c) => c !== key) : [...selected, key];

							field.handleChange(updated);
						};

						return (
							<>
								{ToolCategories.map((toolCategory) => {
									const item = categoryStyles[toolCategory];
									const isActive = selected.includes(toolCategory);

									return (
										<ButtonBase
											key={item.label}
											className={cn(
												"flex gap-2 mt-2 cursor-pointer hover:scale-105 transition-all group",
												isActive ? "opacity-100" : "opacity-50",
												"hover:opacity-100",
											)}
											onClick={() => toggleCategory(toolCategory)}
										>
											<Box className={cn("border border-accent px-2 rounded", item.bg)}>
												<H5
													className={cn(
														"font-mono group-hover:px-2 transition-all duration-500",
														isActive && "px-1",
														item.text,
													)}
												>
													{item.label}
												</H5>
											</Box>
										</ButtonBase>
									);
								})}
							</>
						);
					}}
				</form.Field>
			</Box>
		</>
	);
};

const FloatingElem = ({ children }: PropsWithChildren) => {
	const ref = React.useRef<HTMLDivElement | null>(null);

	const config = React.useMemo(() => {
		const rand = () => Math.random();

		return {
			// how far it moves
			ampX: (rand() - 0.5) * 40, // -20..20 px
			ampY: (rand() - 0.5) * 40, // -20..20 px

			// how fast it moves (different per axis)
			freqX: 0.00015 + rand() * 0.0002, // in ms^-1
			freqY: 0.0001 + rand() * 0.00025,

			// phase offsets so they don't line up
			phaseX: rand() * Math.PI * 2,
			phaseY: rand() * Math.PI * 2,

			// rotation + scale wobble
			rotAmp: (rand() - 0.5) * 6, // -3°..3°
			rotFreq: 0.00012 + rand() * 0.0002,
			scaleAmp: 0.01 + rand() * 0.03, // 0.01–0.04
			scaleFreq: 0.00008 + rand() * 0.0002,
		};
	}, []);

	useAnimationFrame((time) => {
		const el = ref.current;
		if (!el) return;

		const t = time * 1.5; // ms

		const x = Math.sin(t * config.freqX + config.phaseX) * config.ampX;
		const y = Math.sin(t * config.freqY + config.phaseY) * config.ampY;

		const r = Math.sin(t * config.rotFreq + config.phaseY) * config.rotAmp;
		const s = 1 + Math.sin(t * config.scaleFreq + config.phaseX) * config.scaleAmp;

		// smooth, continuous, slightly chaotic path:
		el.style.transform = `translate3d(${x}px, ${y}px, 0) rotate(${r}deg) scale(${s})`;
	});

	return (
		<div
			ref={ref}
			style={{
				willChange: "transform",
			}}
		>
			{children}
		</div>
	);
};

const Page = () => {
	const form = useUserSearchInputForm();

	return (
		<Container className="mt-10">
			<form
				onSubmit={(e) => {
					e.preventDefault();
					e.stopPropagation();
					form.handleSubmit();
				}}
			>
				<Box className="flex flex-col gap-2 py-10">
					<Box className="relative">
						<Box className="absolute -z-10 -top-10 left-1/10 -rotate-[5deg] text-yellow-500">
							<FloatingElem>
								<Sparkles className="size-8" />
							</FloatingElem>
						</Box>

						<Box className="absolute -bottom-1 right-1/9 -z-10 rotate-[5deg] text-rose-400">
							<FloatingElem>
								<Sparkles className="size-8" />
							</FloatingElem>
						</Box>

						<Box className="absolute -top-10 right-1/2 -z-10  rotate-[5deg] text-blue-500">
							<FloatingElem>
								<Sparkles className="size-8" />
							</FloatingElem>
						</Box>

						<Box className="absolute top-6 right-1/4 -z-10  rotate-[5deg] text-green-400">
							<FloatingElem>
								<Sparkles className="size-8" />
							</FloatingElem>
						</Box>

						<Box className="">
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

				<Box>
					<InputBox form={form} />
				</Box>

				<Box className="py-8">
					<Separator className="bg-accent" />
				</Box>

				<Box>
					<ToolsList form={form} />
				</Box>
			</form>
		</Container>
	);
};

export default Page;
