import { svgDrawing } from "./svg-drawing";

const plate = `<path d="M 25 140 120 185 215 140 120 95 Z" opacity=".13"/><path d="M 25 140 V 146 L 120 191 215 146 V 140 M 120 185 V 191" opacity=".1"/>`;
const record = `<path class="or-surface" d="M -22 -29 H 22 V 29 H -22 Z"/><path d="M -13 -15 H 13 M -13 -4 H 13 M -13 7 H 4 M -13 18 H 10" opacity=".35"/>`;
const market = `<rect class="or-surface" x="-25" y="-21" width="50" height="42" rx="3"/><path d="M -17 12 V -13 M -17 12 H 17" opacity=".25"/><path class="or-chart" d="M -13 6 -5 -4 2 1 11 -11 17 -6"/>`;
const diamond = `<path class="or-asset" d="M 0 -23 14 0 0 8 -14 0 Z"/><path class="or-secondary" d="M -14 4 0 24 14 4 0 12 Z"/><path d="M 0 -23 V 8" opacity=".3"/>`;
const check = `<path class="or-check" d="M -6 0 -1 5 8 -6"/>`;
const number = (value: string) =>
	`<text y="5" text-anchor="middle" font-family="monospace" font-size="12" fill="currentColor" stroke="none">${value}</text>`;

const scenes = {
	"oracle-data": `${plate}
		<g transform="translate(62 108)"><g class="or-data-market">${market}</g></g>
		<g transform="translate(178 108)">${record}</g>
		<path d="M 88 108 H 155" opacity=".25"/>
		<g transform="translate(120 73)"><g class="or-data-eye"><path class="or-surface" d="M -23 0 Q 0 -25 23 0 Q 0 25 -23 0 Z"/><circle r="7"/></g></g>
		<path class="or-data-flow" d="M 88 108 120 82 155 108" stroke-dasharray="4 40"/>`,
	"oracle-boundary": `${plate}
		<g transform="translate(65 96)">${market}</g>
		<g transform="translate(177 96)">${record}<path d="M -8 -8 -15 -2 -8 4 M 8 -8 15 -2 8 4"/></g>
		<path d="M 120 47 V 151" stroke-dasharray="3 5" opacity=".3"/>
		<path d="M 91 111 H 153" opacity=".25"/>
		<circle class="or-boundary-input" cx="107" cy="111" r="5"/>
		<path class="or-boundary-gate" d="M 115 100 H 125 V 122 H 115 Z"/>`,
	"oracle-sources": `${plate}
		<g transform="translate(56 65)"><rect class="or-surface" x="-23" y="-14" width="46" height="28" rx="3"/>${number("2490")}</g>
		<g transform="translate(120 47)"><rect class="or-surface" x="-23" y="-14" width="46" height="28" rx="3"/>${number("2500")}</g>
		<g transform="translate(184 65)"><rect class="or-surface" x="-23" y="-14" width="46" height="28" rx="3"/>${number("2510")}</g>
		<path d="M 56 80 120 119 184 80 M 120 62 V 119" opacity=".3"/>
		<g transform="translate(120 139)"><g class="or-source-result"><rect class="or-surface" x="-30" y="-18" width="60" height="36" rx="4"/>${number("2500")}</g></g>
		<path class="or-source-flow" d="M 56 80 120 119 184 80 M 120 62 V 119" stroke-dasharray="4 50"/>`,
	"oracle-report": `${plate}
		<g transform="translate(68 89)">${record}<path class="or-report-sign" d="M -13 21 Q -5 2 -1 15 T 12 14" stroke-dasharray="50"/></g>
		<path d="M 94 99 H 148 M 141 94 148 99 141 104" opacity=".3"/>
		<g transform="translate(176 99)"><path class="or-surface" d="M -24 -30 H 24 V 30 H -24 Z"/><g transform="translate(0 -6)">${number("2500")}</g><path d="M -15 9 H 15 M -15 20 H 5" opacity=".3"/></g>
		<g transform="translate(121 137)"><circle class="or-surface" r="13"/><g class="or-report-auth">${check}</g></g>`,
	"oracle-freshness": `${plate}
		<g transform="translate(76 95)"><circle class="or-surface" r="32"/><circle r="25" opacity=".2"/><path d="M 0 -26 V -22 M 26 0 H 22 M 0 26 V 22 M -26 0 H -22" opacity=".35"/><g class="or-clock-hand"><path d="M 0 3 V -20"/></g><circle r="3" fill="var(--background)"/></g>
		<g transform="translate(177 98)">${record}</g>
		<path class="or-fresh-route" d="M 109 95 H 151" stroke-dasharray="4 5"/>
		<circle class="or-fresh-indicator" cx="177" cy="112" r="5"/>`,
	"oracle-loan": `${plate}
		<g transform="translate(69 76)"><g class="or-loan-asset">${diamond}</g></g>
		<g transform="translate(169 80)"><rect class="or-surface" x="-27" y="-21" width="54" height="42" rx="3"/>${number("400")}</g>
		<path d="M 69 108 V 131 H 169 V 107" opacity=".3"/>
		<path d="M 61 152 H 179" opacity=".2"/>
		<path class="or-loan-threshold" d="M 135 143 V 161"/>
		<g class="or-loan-marker"><path class="or-secondary" d="M 116 140 122 133 128 140 Z"/><path d="M 122 140 V 151"/></g>
		<g transform="translate(74 155) scale(.8)">${number("384")}</g>`,
	"oracle-trust": `${plate}
		<g transform="translate(57 109) scale(.75)">${market}</g>
		<g transform="translate(183 109) scale(.75)">${record}</g>
		<path d="M 77 109 120 78 163 109 M 77 109 120 148 163 109" opacity=".25"/>
		<g transform="translate(120 77)"><g class="or-trust-lens"><circle class="or-surface" r="19"/><circle r="12" opacity=".3"/><path d="M 14 14 27 27"/></g></g>
		<g transform="translate(120 148)"><path class="or-trust-question" d="M -5 -5 Q -5 -13 3 -11 T 5 -1 L 0 4 V 7 M 0 12 V 13"/></g>
		<path class="or-trust-flow" d="M 77 109 120 78 163 109" stroke-dasharray="4 45"/>`,
} as const;

const styles = `
.or-scene { --or-accent:#688f81; --or-secondary:#8a77b3; --or-warm:#b3863c; }
@media(prefers-color-scheme:dark) { .or-scene { --or-accent:#99c8b7; --or-secondary:#bca6e5; --or-warm:#d8b36f; } }
.or-scene .or-surface { stroke:var(--or-accent); fill:color-mix(in srgb,var(--or-accent) 8%,var(--background)); }
.or-scene .or-asset { stroke:var(--or-secondary); fill:color-mix(in srgb,var(--or-secondary) 10%,var(--background)); }
.or-scene .or-secondary { stroke:var(--or-secondary); }
.or-scene .or-chart,.or-scene .or-data-flow,.or-scene .or-source-flow,.or-scene .or-report-sign,.or-scene .or-trust-flow { stroke:var(--or-secondary); }
.or-scene .or-check,.or-scene .or-boundary-gate { stroke:var(--or-accent); }
.or-scene .or-boundary-input { stroke:var(--or-secondary); fill:var(--background); }
.or-scene .or-clock-hand,.or-scene .or-fresh-indicator,.or-scene .or-loan-threshold,.or-scene .or-trust-question { stroke:var(--or-warm); }
.or-scene * { animation-play-state:inherit; }
.or-data-market { animation:or-lift 5s ease-in-out infinite; }
.or-data-eye { animation:or-inspect 6s ease-in-out infinite; }
.or-data-flow { animation:or-flow 6s linear infinite; }
.or-boundary-input { animation:or-input 5s ease-in-out infinite; }
.or-boundary-gate { animation:or-confirm 5s ease-in-out infinite; }
.or-source-flow { animation:or-flow 5s linear infinite; }
.or-source-result { animation:or-lift 4s ease-in-out infinite; }
.or-report-sign { animation:or-sign 5s ease-in-out infinite; }
.or-report-auth { animation:or-confirm 5s ease-in-out infinite; }
.or-clock-hand { animation:or-clock 8s linear infinite; }
.or-fresh-route { animation:or-flow 6s linear infinite; }
.or-fresh-indicator { animation:or-pulse 4s ease-in-out infinite; transform-box:fill-box; transform-origin:center; }
.or-loan-asset { animation:or-lift 5s ease-in-out infinite; }
.or-loan-marker { animation:or-threshold 6s ease-in-out infinite; }
.or-trust-lens { animation:or-inspect 6s ease-in-out infinite; }
.or-trust-question { animation:or-confirm 5s ease-in-out infinite; }
.or-trust-flow { animation:or-flow 6s linear infinite; }
.or-scene[data-playing="false"] * { animation-play-state:paused; }
@media(prefers-reduced-motion:reduce) { .or-scene * { animation:none !important; } }
@keyframes or-lift { 0%,100% {transform:translateY(0)} 50% {transform:translateY(-7px)} }
@keyframes or-flow { to {stroke-dashoffset:-270} }
@keyframes or-inspect { 0%,100% {transform:translateX(-5px)} 50% {transform:translateX(5px)} }
@keyframes or-input { 0%,100% {transform:translateX(-7px);opacity:.4} 50%,75% {transform:translateX(32px);opacity:1} }
@keyframes or-confirm { 0%,15%,100% {opacity:.3} 45%,80% {opacity:1} }
@keyframes or-sign { 0%,10%,100% {stroke-dashoffset:50;opacity:.4} 50%,85% {stroke-dashoffset:0;opacity:1} }
@keyframes or-clock { to {transform:rotate(360deg)} }
@keyframes or-pulse { 0%,100% {opacity:.35;transform:scale(.8)} 50% {opacity:1;transform:scale(1.1)} }
@keyframes or-threshold { 0%,100% {transform:translateX(-20px)} 50%,75% {transform:translateX(28px)} }
`;

export const oracleDrawings = {
	"oracle-data": svgDrawing(scenes["oracle-data"], styles, "or-scene"),
	"oracle-boundary": svgDrawing(scenes["oracle-boundary"], styles, "or-scene"),
	"oracle-sources": svgDrawing(scenes["oracle-sources"], styles, "or-scene"),
	"oracle-report": svgDrawing(scenes["oracle-report"], styles, "or-scene"),
	"oracle-freshness": svgDrawing(
		scenes["oracle-freshness"],
		styles,
		"or-scene",
	),
	"oracle-loan": svgDrawing(scenes["oracle-loan"], styles, "or-scene"),
	"oracle-trust": svgDrawing(scenes["oracle-trust"], styles, "or-scene"),
};
