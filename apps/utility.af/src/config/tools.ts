import type { IconType } from "@icons-pack/react-simple-icons";

import {
	AlarmClock,
	Binary,
	BookOpen,
	CalendarClock,
	CaseUpper,
	Clock,
	CodeXml,
	Coins,
	CopyMinus,
	Crop,
	Dice6,
	Diff,
	FileArchive,
	FileCode,
	FileImage,
	FileJson,
	FileMinus,
	FilePlus,
	FileSpreadsheet,
	FileText,
	Fingerprint,
	Globe,
	Hourglass,
	Image,
	Keyboard,
	KeyRound,
	Link,
	Link2,
	Mic,
	MonitorSmartphone,
	MousePointer2,
	Palette,
	PenLine,
	QrCode,
	Regex,
	Ruler,
	Scale,
	ShieldCheck,
	Sigma,
	SlidersHorizontal,
	Sparkles,
	Terminal,
	Timer,
	Webcam,
	WholeWord,
	WrapText,
} from "lucide-react";

const categoryStyles: Record<ToolCategory, { label: string; bg: string; text: string }> = {
	text: {
		label: "Text",
		bg: "bg-blue-950 border-blue-600",
		text: "text-blue-400",
	},
	time: {
		label: "Time",
		bg: "bg-orange-950 border-orange-600",
		text: "text-orange-400",
	},
	dev: {
		label: "Dev",
		bg: "bg-emerald-950 border-emerald-600",
		text: "text-emerald-400",
	},
	media: {
		label: "Media",
		bg: "bg-purple-950 border-purple-600",
		text: "text-purple-400",
	},
	system: {
		label: "System",
		bg: "bg-rose-950 border-rose-600",
		text: "text-rose-400",
	},
};

const ToolCategory = ["text", "time", "dev", "media", "system"] as const satisfies string[];
type ToolCategory = (typeof ToolCategory)[number];
const ToolCategories: ToolCategory[] = [...ToolCategory];

type Tool = {
	name: string;
	subtitle: string;
	icon: IconType;
	href: string;
	available: boolean;
	category: ToolCategory;
};

const Tools = {
	"word-counter": {
		name: "Word Counter",
		subtitle: "Count words, characters, and text length.",
		icon: WholeWord,
		href: "word-counter",
		available: true,
		category: "text",
	},

	"text-case-converter": {
		name: "Text Case Converter",
		subtitle: "Convert text to upper, lower, or title case.",
		icon: CaseUpper,
		href: "text-case-converter",
		available: false,
		category: "text",
	},

	"line-break-remover": {
		name: "Line Break Remover",
		subtitle: "Remove line breaks and tidy text.",
		icon: WrapText,
		href: "line-break-remover",
		available: false,
		category: "text",
	},

	"duplicate-line-remover": {
		name: "Duplicate Line Remover",
		subtitle: "Remove duplicate lines from text.",
		icon: CopyMinus,
		href: "duplicate-line-remover",
		available: false,
		category: "text",
	},

	"lorem-ipsum-generator": {
		name: "Lorem Ipsum Generator",
		subtitle: "Generate placeholder dummy text.",
		icon: FileText,
		href: "lorem-ipsum-generator",
		available: false,
		category: "text",
	},

	"random-number-generator": {
		name: "Random Number Generator",
		subtitle: "Generate random numbers easily.",
		icon: Sigma,
		href: "random-number-generator",
		available: false,
		category: "system",
	},

	"coin-flip": {
		name: "Coin Flip",
		subtitle: "Flip a virtual coin: heads or tails.",
		icon: Coins,
		href: "coin-flip",
		available: false,
		category: "system",
	},

	"dice-roller": {
		name: "Dice Roller",
		subtitle: "Roll virtual dice.",
		icon: Dice6,
		href: "dice-roller",
		available: false,
		category: "system",
	},

	stopwatch: {
		name: "Stopwatch",
		subtitle: "Track elapsed time with precision.",
		icon: Hourglass,
		href: "stopwatch",
		available: false,
		category: "time",
	},

	"countdown-timer": {
		name: "Countdown Timer",
		subtitle: "Simple countdown timer for tasks.",
		icon: Timer,
		href: "countdown-timer",
		available: false,
		category: "time",
	},

	"pomodoro-timer": {
		name: "Pomodoro Timer",
		subtitle: "Time your work and break intervals.",
		icon: Clock,
		href: "pomodoro-timer",
		available: false,
		category: "time",
	},

	"alarm-clock": {
		name: "Alarm Clock",
		subtitle: "Set browser alarms and alerts.",
		icon: AlarmClock,
		href: "alarm-clock",
		available: false,
		category: "time",
	},

	"password-generator": {
		name: "Password Generator",
		subtitle: "Generate secure custom passwords.",
		icon: KeyRound,
		href: "password-generator",
		available: false,
		category: "dev",
	},

	"uuid-generator": {
		name: "UUID Generator",
		subtitle: "Generate unique UUID identifiers.",
		icon: Fingerprint,
		href: "uuid-generator",
		available: false,
		category: "dev",
	},

	"qr-code-generator": {
		name: "QR Code Generator",
		subtitle: "Generate QR codes from any text.",
		icon: QrCode,
		href: "qr-code-generator",
		available: false,
		category: "dev",
	},

	"unit-converter": {
		name: "Unit Converter",
		subtitle: "Convert length, weight, temp, and more.",
		icon: Ruler,
		href: "unit-converter",
		available: false,
		category: "system",
	},

	"color-picker": {
		name: "Color Picker",
		subtitle: "Convert HEX, RGB, and HSL colors.",
		icon: Palette,
		href: "color-picker",
		available: false,
		category: "media",
	},

	"image-compressor": {
		name: "Image Compressor",
		subtitle: "Compress images without losing quality.",
		icon: Crop,
		href: "image-compressor",
		available: false,
		category: "media",
	},

	"image-resizer": {
		name: "Image Resizer",
		subtitle: "Resize images to custom sizes.",
		icon: Image,
		href: "image-resizer",
		available: false,
		category: "media",
	},

	"image-to-base64": {
		name: "Image to Base64",
		subtitle: "Convert images to Base64 strings.",
		icon: FileImage,
		href: "image-to-base64",
		available: false,
		category: "media",
	},

	"base64-to-image": {
		name: "Base64 to Image",
		subtitle: "Convert Base64 back into an image.",
		icon: FileImage,
		href: "base64-to-image",
		available: false,
		category: "media",
	},

	"markdown-to-html": {
		name: "Markdown to HTML",
		subtitle: "Convert Markdown text into HTML.",
		icon: FileCode,
		href: "markdown-to-html",
		available: false,
		category: "dev",
	},

	"html-to-markdown": {
		name: "HTML to Markdown",
		subtitle: "Turn HTML into Markdown files.",
		icon: CodeXml,
		href: "html-to-markdown",
		available: false,
		category: "dev",
	},

	"json-formatter": {
		name: "JSON Formatter",
		subtitle: "Format and validate JSON.",
		icon: FileJson,
		href: "json-formatter",
		available: false,
		category: "dev",
	},

	"yaml-to-json": {
		name: "YAML to JSON",
		subtitle: "Convert YAML data to JSON.",
		icon: FileSpreadsheet,
		href: "yaml-to-json",
		available: false,
		category: "dev",
	},

	"json-to-yaml": {
		name: "JSON to YAML",
		subtitle: "Convert JSON data into YAML.",
		icon: FileSpreadsheet,
		href: "json-to-yaml",
		available: false,
		category: "dev",
	},

	"csv-to-json": {
		name: "CSV to JSON",
		subtitle: "Convert CSV files into JSON format.",
		icon: FileSpreadsheet,
		href: "csv-to-json",
		available: false,
		category: "dev",
	},

	"json-to-csv": {
		name: "JSON to CSV",
		subtitle: "Convert JSON objects into CSV.",
		icon: FileSpreadsheet,
		href: "json-to-csv",
		available: false,
		category: "dev",
	},

	"url-encoder": {
		name: "URL Encoder",
		subtitle: "Encode URLs for safe usage.",
		icon: Link,
		href: "url-encoder",
		available: false,
		category: "dev",
	},

	"url-decoder": {
		name: "URL Decoder",
		subtitle: "Decode encoded URLs.",
		icon: Link2,
		href: "url-decoder",
		available: false,
		category: "dev",
	},

	"base64-encoder": {
		name: "Base64 Encoder",
		subtitle: "Encode text into Base64.",
		icon: Binary,
		href: "base64-encoder",
		available: false,
		category: "dev",
	},

	"base64-decoder": {
		name: "Base64 Decoder",
		subtitle: "Decode Base64 text.",
		icon: Binary,
		href: "base64-decoder",
		available: false,
		category: "dev",
	},

	"hash-generator": {
		name: "Hash Generator",
		subtitle: "Generate MD5, SHA-1, and SHA-256.",
		icon: ShieldCheck,
		href: "hash-generator",
		available: false,
		category: "dev",
	},

	"regex-tester": {
		name: "Regex Tester",
		subtitle: "Test regular expressions online.",
		icon: Regex,
		href: "regex-tester",
		available: false,
		category: "dev",
	},

	"text-diff": {
		name: "Text Diff Checker",
		subtitle: "Compare two blocks of text.",
		icon: Diff,
		href: "text-diff",
		available: false,
		category: "text",
	},

	"epoch-converter": {
		name: "Epoch Converter",
		subtitle: "Convert timestamps to readable dates.",
		icon: CalendarClock,
		href: "epoch-converter",
		available: false,
		category: "time",
	},

	"ip-lookup": {
		name: "IP Lookup",
		subtitle: "Look up IP and location info.",
		icon: Globe,
		href: "ip-lookup",
		available: false,
		category: "system",
	},

	"screen-size-checker": {
		name: "Screen Size Checker",
		subtitle: "Check resolution, DPR, and viewport size.",
		icon: MonitorSmartphone,
		href: "screen-size-checker",
		available: false,
		category: "dev",
	},

	"keyboard-tester": {
		name: "Keyboard Tester",
		subtitle: "Check if all keyboard keys work.",
		icon: Keyboard,
		href: "keyboard-tester",
		available: false,
		category: "system",
	},

	"webcam-test": {
		name: "Webcam Test",
		subtitle: "Test your webcam quickly.",
		icon: Webcam,
		href: "webcam-test",
		available: false,
		category: "system",
	},

	"mic-test": {
		name: "Microphone Test",
		subtitle: "Analyze your mic input.",
		icon: Mic,
		href: "mic-test",
		available: false,
		category: "system",
	},

	"pdf-merger": {
		name: "PDF Merger",
		subtitle: "Merge multiple PDF files.",
		icon: FilePlus,
		href: "pdf-merger",
		available: false,
		category: "media",
	},

	"pdf-splitter": {
		name: "PDF Splitter",
		subtitle: "Split PDFs into several files.",
		icon: FileMinus,
		href: "pdf-splitter",
		available: false,
		category: "media",
	},

	"pdf-compressor": {
		name: "PDF Compressor",
		subtitle: "Compress PDF file sizes.",
		icon: FileArchive,
		href: "pdf-compressor",
		available: false,
		category: "media",
	},

	"mouse-tester": {
		name: "Mouse Tester",
		subtitle: "Test clicks, double clicks, and tracking.",
		icon: MousePointer2,
		href: "mouse-tester",
		available: false,
		category: "system",
	},

	"scale-converter": {
		name: "Scale Converter",
		subtitle: "Convert ratios and scale values.",
		icon: Scale,
		href: "scale-converter",
		available: false,
		category: "system",
	},

	"reading-time-calculator": {
		name: "Reading Time Calculator",
		subtitle: "Estimate how long text will take to read.",
		icon: BookOpen,
		href: "reading-time-calculator",
		available: false,
		category: "text",
	},

	"text-reverser": {
		name: "Text Reverser",
		subtitle: "Reverse any piece of text.",
		icon: PenLine,
		href: "text-reverser",
		available: false,
		category: "text",
	},

	"terminal-converter": {
		name: "Terminal Commands Formatter",
		subtitle: "Format or clean terminal outputs.",
		icon: Terminal,
		href: "terminal-converter",
		available: false,
		category: "dev",
	},

	"string-sanitizer": {
		name: "String Sanitizer",
		subtitle: "Clean and sanitize strings safely.",
		icon: Sparkles,
		href: "string-sanitizer",
		available: false,
		category: "dev",
	},

	"settings-json-generator": {
		name: "Settings JSON Builder",
		subtitle: "Create structured JSON configs easily.",
		icon: SlidersHorizontal,
		href: "settings-json-generator",
		available: false,
		category: "dev",
	},
} as const satisfies { [toolName: string]: Tool };

export { type Tool, Tools, categoryStyles, ToolCategories, ToolCategory };
