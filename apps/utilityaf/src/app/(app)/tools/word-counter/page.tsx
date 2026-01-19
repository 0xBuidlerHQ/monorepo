"use client";

import { Separator } from "@0xbuidlerhq/ui/shadcn/components/separator";
import { Box } from "@0xbuidlerhq/ui/system/base/box";
import { Container } from "@0xbuidlerhq/ui/system/base/container";
import { H1_3, H1_6, H2, H4 } from "@0xbuidlerhq/ui/system/base/typography";
import { getTextStats } from "@app/(app)/tools/word-counter/utils";
import { Tools } from "@config/tools";
import React from "react";

const tool = Tools["word-counter"];

type ResultItem = {
	title: string;
	data: number;
};
const ResultItem = (props: ResultItem) => {
	const { title, data } = props;

	return (
		<Box className="flex flex-col gap-2">
			<H1_3 className="text-center font-bold">{data}</H1_3>
			<H4 className="text-center">{title}</H4>
		</Box>
	);
};

type ResultProps = {
	text: string;
};
const Result = (props: ResultProps) => {
	const { text } = props;

	const {
		wordCount,
		charCount,
		charCountNoSpaces,
		sentenceCount,
		paragraphCount,
		readingTimeMinutes,
	} = getTextStats(text);

	return (
		<Box className="grid grid-cols-2 md:grid-cols-6">
			<ResultItem title="Words" data={wordCount} />
			<ResultItem title="Characters" data={charCount} />
			<ResultItem title="No Spaces" data={charCountNoSpaces} />
			<ResultItem title="Sentences" data={sentenceCount} />
			<ResultItem title="Paragraphs" data={paragraphCount} />
			<ResultItem title="Min Read" data={readingTimeMinutes} />
		</Box>
	);
};

type InputTextProps = {
	text: string;
	setText: (value: string) => void;
};
const InputText = (props: InputTextProps) => {
	const { text, setText } = props;

	return (
		<Box>
			<textarea
				className="bg-muted border border-accent w-full rounded-lg h-80 p-8"
				value={text}
				onChange={(e) => setText(e.target.value)}
			/>
		</Box>
	);
};

const WordCounter = () => {
	const [text, setText] = React.useState("");

	return (
		<Box className="flex flex-col gap-10">
			<Box>
				<Result text={text} />
			</Box>

			<Box>
				<InputText text={text} setText={setText} />
			</Box>
		</Box>
	);
};

const Page = () => {
	return (
		<Container>
			<Box className="flex flex-col gap-4">
				<H1_6 className="relative font-extrabold font-montserrat">{tool.name}</H1_6>
				<H2 className="font-semibold text-muted-foreground font-montserrat">{tool.subtitle}</H2>
			</Box>

			<Separator className="bg-accent my-10" />

			<Box>
				<WordCounter />
			</Box>
		</Container>
	);
};

export default Page;
