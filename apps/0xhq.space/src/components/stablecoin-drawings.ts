import { svgDrawing } from "./svg-drawing";

const plate = `<path d="M 25 140 120 185 215 140 120 95 Z" opacity=".13"/><path d="M 25 140 V 146 L 120 191 215 146 V 140 M 120 185 V 191" opacity=".1"/>`;
const coin = `<ellipse rx="17" ry="8" cy="6"/><path d="M -17 0 V 6 M 17 0 V 6"/><ellipse class="st-asset" rx="17" ry="8"/><path d="M -5 -2 H 5 M -5 2 H 5 M 0 -5 V 5" opacity=".55"/>`;
const dollar = `<g class="st-dollar"><circle class="st-surface" r="17"/><path d="M 5 -8 H -2 Q -8 -8 -8 -3 T -1 1 H 1 Q 8 1 8 6 T 2 10 H -5 M 0 -13 V 13"/></g>`;
const bank = `<path class="st-surface" d="M -27 -14 0 -29 27 -14 Z"/><path d="M -24 -9 H 24 M -24 19 H 24 M -28 25 H 28 M -18 -8 V 18 M -6 -8 V 18 M 6 -8 V 18 M 18 -8 V 18"/>`;
const diamond = `<g class="st-crypto"><path d="M 0 -23 14 0 0 8 -14 0 Z"/><path d="M -14 4 0 24 14 4 0 12 Z"/><path d="M 0 -23 V 8" opacity=".4"/></g>`;
const ledger = `<path class="st-surface" d="M -23 -27 H 23 V 27 H -23 Z"/><path d="M -13 -13 H 13 M -13 -3 H 13 M -13 7 H 4 M -13 17 H 10" opacity=".45"/>`;
const number = (value: string) =>
	`<text y="5" text-anchor="middle" font-family="monospace" font-size="14" fill="currentColor" stroke="none">${value}</text>`;

const scenes = {
	"stablecoin-value": `${plate}
		<path d="M 64 132 120 154 176 132" opacity=".3"/>
		<g transform="translate(120 86)"><g class="st-value-token"><circle class="st-surface" r="31"/><circle r="25" opacity=".2"/>${number("500")}</g></g>
		<g transform="translate(64 132) scale(.8)">${coin}</g>
		<g transform="translate(176 132) scale(.8)">${dollar}</g>
		<ellipse class="st-value-anchor" cx="120" cy="153" rx="24" ry="8"/>
		<path d="M 120 117 V 145" stroke-dasharray="3 4" opacity=".3"/>`,
	"stablecoin-peg": `${plate}
		<path d="M 120 81 V 150 M 96 161 120 150 144 161" opacity=".55"/>
		<g transform="translate(120 82)"><g class="st-peg-beam"><path d="M -65 0 H 65 M -52 0 -65 36 H -39 Z M 52 0 39 36 H 65 Z"/><g transform="translate(-52 36) scale(.7)">${coin}</g><g transform="translate(52 29) scale(.65)">${dollar}</g></g></g>
		<circle class="st-surface" cx="120" cy="82" r="5"/>
		<path class="st-peg-reference" d="M 55 57 H 185" stroke-dasharray="3 5"/>`,
	"stablecoin-reserves": `${plate}
		<g transform="translate(76 98)">${bank}</g>
		<g transform="translate(167 98)">${ledger}</g>
		<path d="M 102 69 Q 122 49 145 69 M 137 59 145 69 132 69 M 145 134 Q 123 154 101 134 M 114 135 101 134 109 145" opacity=".4"/>
		<g transform="translate(117 65) scale(.55)"><g class="st-reserve-issue">${coin}</g></g>
		<g transform="translate(129 141) scale(.55)"><g class="st-reserve-redeem">${coin}</g></g>
		<path class="st-reserve-lines" d="M 56 138 H 96 M 147 138 H 187" stroke-dasharray="4 5"/>`,
	"stablecoin-arbitrage": `${plate}
		<path d="M 51 130 H 189" opacity=".3"/>
		<path class="st-surface" d="M 57 130 V 93 H 86 V 130 M 106 130 V 73 H 135 V 130 M 155 130 V 53 H 184 V 130"/>
		<path class="st-market-target" d="M 45 73 H 195" stroke-dasharray="3 4"/>
		<g transform="translate(71 72) scale(.65)"><g class="st-arbitrage-low">${coin}</g></g>
		<g transform="translate(169 34) scale(.65)"><g class="st-arbitrage-high">${coin}</g></g>
		<path class="st-arbitrage-flow" d="M 79 53 Q 120 13 162 53 M 86 156 Q 120 178 155 156" stroke-dasharray="6 6"/>`,
	"stablecoin-models": `${plate}
		<path d="M 65 115 120 144 175 115" opacity=".25"/>
		<g transform="translate(65 101) scale(.8)">${bank}</g>
		<g transform="translate(175 97)"><g class="st-model-collateral">${diamond}</g></g>
		<g transform="translate(120 60)"><g class="st-model-cycle"><path d="M -17 0 A 17 17 0 1 1 0 17 M -5 11 0 17 -7 21"/><path d="M -17 0 -22 -6 M -17 0 -11 -5"/></g></g>
		<g transform="translate(120 145)"><g class="st-model-token">${coin}</g></g>
		<path d="M 77 84 105 66 M 163 79 135 66" stroke-dasharray="3 5" opacity=".3"/>`,
	"stablecoin-depeg": `${plate}
		<path class="st-surface" d="M 51 49 H 184 V 142 H 51 Z"/>
		<path d="M 64 62 V 129 H 170" opacity=".2"/>
		<path class="st-depeg-reference" d="M 65 77 H 170" stroke-dasharray="3 4"/>
		<path class="st-depeg-price" d="M 66 78 86 76 102 80 116 77 132 92 148 111 168 119" stroke-dasharray="125"/>
		<g transform="translate(83 158)">${number("500")}</g>
		<path d="M 108 154 H 134 M 128 149 134 154 128 159" opacity=".4"/>
		<g class="st-depeg-value" transform="translate(159 158)">${number("450")}</g>`,
	"stablecoin-together": `${plate}
		<path d="M 63 124 120 72 177 124 120 154 63 124" opacity=".25"/>
		<g transform="translate(63 120) scale(.8)">${ledger}</g>
		<g transform="translate(177 120) scale(.8)">${bank}</g>
		<g transform="translate(120 65)"><g class="st-together-token">${coin}</g></g>
		<g transform="translate(120 127)"><g class="st-together-lens"><circle class="st-surface" r="16"/><circle r="10" opacity=".35"/><path d="M 12 12 24 24"/></g></g>
		<path class="st-together-flow" d="M 63 124 120 72 177 124 120 154 63 124" stroke-dasharray="5 65"/>`,
} as const;

const styles = `
.st-scene { --st-accent:#83bfcd; --st-secondary:#b4a1ed; --st-warm:#d8b36f; }

.st-scene .st-surface { stroke:var(--st-accent); fill:color-mix(in srgb,var(--st-accent) 8%,var(--background)); }
.st-scene .st-asset { stroke:var(--st-secondary); fill:color-mix(in srgb,var(--st-secondary) 10%,var(--background)); }
.st-scene .st-dollar,.st-scene .st-value-anchor,.st-scene .st-reserve-lines,.st-scene .st-together-flow { stroke:var(--st-accent); }
.st-scene .st-crypto { stroke:var(--st-secondary); fill:color-mix(in srgb,var(--st-secondary) 10%,var(--background)); }
.st-scene .st-market-target,.st-scene .st-peg-reference,.st-scene .st-depeg-reference { stroke:var(--st-accent); opacity:.5; }
.st-scene .st-depeg-price,.st-scene .st-model-cycle { stroke:var(--st-warm); }
.st-scene .st-arbitrage-flow { stroke:var(--st-secondary); }
.st-scene * { animation-play-state:inherit; }
.st-value-token { animation:st-lift 5s ease-in-out infinite; }
.st-value-anchor { animation:st-pulse 5s ease-in-out infinite; transform-box:fill-box; transform-origin:center; }
.st-peg-beam { animation:st-balance 6s ease-in-out infinite; }
.st-reserve-issue { animation:st-issue 5s ease-in-out infinite; }
.st-reserve-redeem { animation:st-redeem 5s ease-in-out infinite; }
.st-reserve-lines { animation:st-flow 5s linear infinite; }
.st-arbitrage-low { animation:st-low 5s ease-in-out infinite; }
.st-arbitrage-high { animation:st-high 5s ease-in-out infinite; }
.st-arbitrage-flow { animation:st-flow 6s linear infinite; }
.st-model-collateral { animation:st-lift 5s ease-in-out infinite; }
.st-model-cycle { animation:st-cycle 8s linear infinite; }
.st-model-token { animation:st-lift 4s ease-in-out infinite; }
.st-depeg-price { animation:st-price 5s ease-in-out infinite; }
.st-depeg-value { animation:st-value 5s ease-in-out infinite; }
.st-together-token { animation:st-lift 5s ease-in-out infinite; }
.st-together-lens { animation:st-inspect 6s ease-in-out infinite; }
.st-together-flow { animation:st-flow 6s linear infinite; }
.st-scene[data-playing="false"] * { animation-play-state:paused; }
@media(prefers-reduced-motion:reduce) { .st-scene * { animation:none !important; } }
@keyframes st-lift { 0%,100% {transform:translateY(0)} 50% {transform:translateY(-7px)} }
@keyframes st-pulse { 0%,100% {opacity:.3;transform:scale(.9)} 50% {opacity:.8;transform:scale(1.1)} }
@keyframes st-balance { 0%,100% {transform:rotate(-4deg)} 35%,65% {transform:rotate(0deg)} 80% {transform:rotate(3deg)} }
@keyframes st-flow { to {stroke-dashoffset:-280} }
@keyframes st-issue { 0%,100% {transform:translateX(-15px);opacity:.3} 45%,70% {transform:translateX(28px);opacity:1} }
@keyframes st-redeem { 0%,100% {transform:translateX(15px);opacity:.3} 45%,70% {transform:translateX(-28px);opacity:1} }
@keyframes st-low { 0%,100% {transform:translateY(0)} 50% {transform:translateY(-14px)} }
@keyframes st-high { 0%,100% {transform:translateY(0)} 50% {transform:translateY(14px)} }
@keyframes st-cycle { to {transform:rotate(360deg)} }
@keyframes st-price { 0%,10%,100% {stroke-dashoffset:125;opacity:.4} 60%,85% {stroke-dashoffset:0;opacity:1} }
@keyframes st-value { 0%,100% {opacity:.4} 60%,85% {opacity:1} }
@keyframes st-inspect { 0%,100% {transform:translateX(-6px)} 50% {transform:translateX(6px)} }
`;

export const stablecoinDrawings = {
	"stablecoin-value": svgDrawing(
		scenes["stablecoin-value"],
		styles,
		"st-scene",
	),
	"stablecoin-peg": svgDrawing(scenes["stablecoin-peg"], styles, "st-scene"),
	"stablecoin-reserves": svgDrawing(
		scenes["stablecoin-reserves"],
		styles,
		"st-scene",
	),
	"stablecoin-arbitrage": svgDrawing(
		scenes["stablecoin-arbitrage"],
		styles,
		"st-scene",
	),
	"stablecoin-models": svgDrawing(
		scenes["stablecoin-models"],
		styles,
		"st-scene",
	),
	"stablecoin-depeg": svgDrawing(
		scenes["stablecoin-depeg"],
		styles,
		"st-scene",
	),
	"stablecoin-together": svgDrawing(
		scenes["stablecoin-together"],
		styles,
		"st-scene",
	),
};
