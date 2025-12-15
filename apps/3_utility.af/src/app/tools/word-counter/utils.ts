interface TextStats {
	wordCount: number;
	charCount: number;
	charCountNoSpaces: number;
	sentenceCount: number;
	paragraphCount: number;
	readingTimeMinutes: number;
}

const getTextStats = (text: string): TextStats => {
	const trimmed = text.trim();

	// Words (split by any whitespace)
	const words = trimmed.length ? trimmed.split(/\s+/) : [];
	const wordCount = words.filter(Boolean).length;

	// Characters
	const charCount = text.length;
	const charCountNoSpaces = text.replace(/\s/g, "").length;

	// Sentences (split on . ! ? followed by optional space)
	const sentences = trimmed.length
		? trimmed.split(/[.!?]+/).filter((s) => s.trim().length > 0)
		: [];
	const sentenceCount = sentences.length;

	// Paragraphs (split on blank lines / new lines)
	const paragraphs = trimmed.length ? trimmed.split(/\n+/).filter((p) => p.trim().length > 0) : [];
	const paragraphCount = paragraphs.length;

	// Reading time (average 200 WPM)
	const readingTimeMinutes = wordCount > 0 ? wordCount / 200 : 0;

	return {
		wordCount,
		charCount,
		charCountNoSpaces,
		sentenceCount,
		paragraphCount,
		readingTimeMinutes,
	};
};

export { getTextStats };
