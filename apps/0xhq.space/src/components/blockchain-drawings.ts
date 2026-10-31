import { svgDrawing } from "./svg-drawing";

const plate = `<path d="M 25 140 120 185 215 140 120 95 Z" opacity=".13"/><path d="M 25 140 V 146 L 120 191 215 146 V 140 M 120 185 V 191" opacity=".1"/>`;
const block = `<path class="bc-block-face" d="M -22 -11 0 -22 22 -11 0 0 Z" fill="var(--background)"/><path d="M -22 -11 V 16 L 0 27 22 16 V -11 M 0 0 V 27"/>`;
const ticket = `<path class="bc-ticket-face" d="M -26 -16 H 26 V -5 A 5 5 0 0 0 26 5 V 16 H -26 V 5 A 5 5 0 0 0 -26 -5 Z" fill="var(--background)"/><path d="M 12 -13 V 13" stroke-dasharray="2 3" opacity=".4"/><text x="-6" y="5" text-anchor="middle" font-family="monospace" font-size="14" fill="currentColor" stroke="none">42</text>`;
const record = `<path class="bc-record-face" d="M -24 -28 H 15 L 24 -19 V 28 H -24 Z" fill="var(--background)"/><path d="M 15 -28 V -19 H 24 M -15 -12 H 14 M -15 -3 H 14 M -15 6 H 3 M -15 15 H 8" opacity=".45"/>`;
const check = `<path class="bc-check-mark" d="M -6 0 -1 5 8 -6"/>`;
const node = `<path d="M -17 -15 H 17 V 8 H -17 Z" fill="var(--background)"/><path d="M 0 8 V 15 M -10 15 H 10" opacity=".5"/>`;

const scenes = {
	"blockchain-history": `${plate}
		<path d="M 58 120 120 91 182 120" opacity=".25"/>
		<g transform="translate(58 118)"><g class="bc-history-block">${block}</g></g>
		<g transform="translate(120 88)"><g class="bc-history-block" style="animation-delay:.4s">${block}</g></g>
		<g transform="translate(182 118)"><g class="bc-history-block" style="animation-delay:.8s">${block}</g></g>
		<path class="bc-history-link" d="M 80 108 98 99 M 142 99 160 108" stroke-dasharray="5 4"/>`,
	"blockchain-record": `${plate}
		<path d="M 65 130 120 155 175 130 M 120 155 V 110" opacity=".25"/>
		<g transform="translate(65 110) scale(.75)"><g class="bc-record-copy">${record}</g></g>
		<g transform="translate(175 110) scale(.75)"><g class="bc-record-copy" style="animation-delay:.6s">${record}</g></g>
		<g transform="translate(120 68)"><g class="bc-record-ticket">${ticket}</g></g>
		<circle class="bc-record-pulse" cx="120" cy="155" r="5" fill="var(--background)"/>`,
	"blockchain-signature": `${plate}
		<g transform="translate(108 99)">${record}
		<path class="bc-signature-stroke" d="M -15 20 Q -8 0 -5 15 T 3 14 Q 8 4 11 16 L 17 12" stroke-dasharray="70"/></g>
		<g transform="translate(165 76)"><g class="bc-signature-key"><circle r="10"/><path d="M -7 7 -31 31 M -23 23 -17 29 M -29 29 -23 35"/><circle r="3" opacity=".35"/></g></g>
		<circle cx="143" cy="133" r="13" fill="var(--background)"/><g class="bc-signature-check" transform="translate(143 133)">${check}</g>`,
	"blockchain-rules": `${plate}
		<path d="M 120 92 62 132 M 120 92 178 132 M 120 92 V 155" opacity=".25"/>
		<g transform="translate(120 63)">${record}<path d="M -8 -4 -15 2 -8 8 M 8 -4 15 2 8 8"/></g>
		<g transform="translate(62 133)">${node}<g class="bc-rule-check">${check}</g></g>
		<g transform="translate(178 133)">${node}<g class="bc-rule-check" style="animation-delay:.4s">${check}</g></g>
		<g transform="translate(120 162) scale(.8)">${node}<g class="bc-rule-check" style="animation-delay:.8s">${check}</g></g>`,
	"blockchain-hashes": `${plate}
		<g transform="translate(55 103) scale(.8)"><g class="bc-hash-source">${block}</g></g>
		<g transform="translate(120 103) scale(.8)">${block}</g>
		<g transform="translate(185 103) scale(.8)">${block}</g>
		<g class="bc-hash-link"><path d="M 75 104 H 100 M 140 104 H 165"/><circle cx="87" cy="104" r="4" fill="var(--background)"/><circle cx="152" cy="104" r="4" fill="var(--background)"/></g>
		<path class="bc-hash-fingerprint" d="M 43 144 V 153 M 48 140 V 153 M 53 143 V 153 M 60 140 V 153 M 65 144 V 153 M 108 144 V 153 M 114 140 V 153 M 119 144 V 153 M 125 140 V 153 M 131 143 V 153 M 173 140 V 153 M 178 144 V 153 M 184 140 V 153 M 190 143 V 153 M 196 140 V 153"/>`,
	"blockchain-consensus": `${plate}
		<g transform="translate(49 111) scale(.7)">${block}</g>
		<path d="M 66 111 102 79 M 66 111 102 140" opacity=".25"/>
		<g transform="translate(119 77) scale(.7)"><g class="bc-consensus-accepted">${block}</g></g>
		<g transform="translate(119 139) scale(.7)"><g class="bc-consensus-alternative">${block}</g></g>
		<path class="bc-consensus-path" d="M 136 77 H 167" stroke-dasharray="4 3"/>
		<g transform="translate(184 77) scale(.7)"><g class="bc-consensus-final">${block}</g></g>
		<g class="bc-consensus-final" transform="translate(184 121)"><circle r="13" fill="var(--background)"/>${check}</g>`,
	"blockchain-lifecycle": `${plate}
		<path d="M 51 112 Q 84 58 120 80 T 188 111" opacity=".25"/>
		<g transform="translate(51 112) scale(.65)">${record}</g>
		<g transform="translate(120 80) scale(.8)">${node}${check}</g>
		<g transform="translate(188 111) scale(.8)">${block}</g>
		<g class="bc-lifecycle-request"><rect x="-5" y="-4" width="10" height="8" rx="2" fill="var(--background)"/></g>
		<path d="M 70 147 H 171 M 165 142 171 147 165 152" opacity=".3"/>`,
	"blockchain-layers": `${plate}
		<g transform="translate(107 141)"><path d="M -51 -15 0 -38 51 -15 0 8 Z" fill="var(--background)"/><path d="M -25 -15 0 -26 25 -15 0 -4 Z" opacity=".35"/></g>
		<g transform="translate(107 112)"><g class="bc-layer-rules"><path d="M -51 -15 0 -38 51 -15 0 8 Z" fill="var(--background)"/><path d="M -14 -15 -6 -20 M -14 -15 -6 -10 M 14 -15 6 -20 M 14 -15 6 -10"/></g></g>
		<g transform="translate(107 83)"><g class="bc-layer-interface"><path d="M -51 -15 0 -38 51 -15 0 8 Z" fill="var(--background)"/><path d="M -26 -15 0 -27 26 -15" opacity=".4"/></g></g>
		<path d="M 174 57 V 151" stroke-dasharray="3 5" opacity=".3"/>
		<path d="M 189 136 V 101 H 211 V 136 M 186 136 H 214 M 197 136 V 110 H 203 V 136" opacity=".5"/>`,
	"blockchain-together": `${plate}
		<path d="M 120 99 62 77 M 120 99 178 77 M 120 99 V 152" opacity=".25"/>
		<g transform="translate(120 98)"><g class="bc-whole-ticket">${ticket}</g></g>
		<g transform="translate(62 69)"><circle r="17" fill="var(--background)"/><g class="bc-whole-check">${check}</g></g>
		<g transform="translate(178 69)"><circle r="17" fill="var(--background)"/><g class="bc-whole-check" style="animation-delay:.4s">${check}</g></g>
		<g transform="translate(120 151) scale(.65)"><g class="bc-whole-block">${block}</g></g>
		<path class="bc-whole-links" d="M 120 99 62 77 M 120 99 178 77 M 120 99 V 136" stroke-dasharray="3 65"/>`,
} as const;

const styles = `
.bc-scene {
 --bc-accent:#7c6bba;
 --bc-warm:#b3863c;
 --bc-success:#438e86;
}
@media(prefers-color-scheme:dark) {
 .bc-scene { --bc-accent:#b4a1ed; --bc-warm:#d8b36f; --bc-success:#7bc0b3; }
}
.bc-scene .bc-block-face,.bc-scene .bc-ticket-face,.bc-scene .bc-record-face {
 stroke:var(--bc-accent);
 fill:color-mix(in srgb,var(--bc-accent) 9%,var(--background));
}
.bc-scene .bc-history-link,.bc-scene .bc-record-pulse,
.bc-scene .bc-signature-stroke,.bc-scene .bc-hash-link,
.bc-scene .bc-consensus-path,.bc-scene .bc-whole-links { stroke:var(--bc-accent); }
.bc-scene .bc-signature-key,.bc-scene .bc-hash-fingerprint { stroke:var(--bc-warm); }
.bc-scene .bc-check-mark { stroke:var(--bc-success); }
.bc-scene .bc-lifecycle-request rect {
 stroke:var(--bc-accent);
 fill:color-mix(in srgb,var(--bc-accent) 18%,var(--background));
}
.bc-scene .bc-layer-interface > path:first-child {
 stroke:var(--bc-accent);
 fill:color-mix(in srgb,var(--bc-accent) 9%,var(--background));
}
.bc-scene .bc-layer-rules > path:first-child {
 stroke:var(--bc-warm);
 fill:color-mix(in srgb,var(--bc-warm) 7%,var(--background));
}

.bc-scene * { animation-play-state:inherit; }
.bc-history-block { animation:bc-lift 4s ease-in-out infinite; }
.bc-history-link { animation:bc-link 3s linear infinite; }
.bc-record-copy { animation:bc-copy 4s ease-in-out infinite; }
.bc-record-ticket { animation:bc-lift 4s ease-in-out infinite; }
.bc-record-pulse { animation:bc-pulse 3s ease-in-out infinite; transform-box:fill-box; transform-origin:center; }
.bc-signature-key { animation:bc-key 4.5s ease-in-out infinite; }
.bc-signature-stroke { animation:bc-sign 4.5s ease-in-out infinite; }
.bc-signature-check { animation:bc-verify 4.5s ease-in-out infinite; }
.bc-rule-check { animation:bc-verify 3.5s ease-in-out infinite; }
.bc-hash-source { animation:bc-change 5s ease-in-out infinite; }
.bc-hash-link { animation:bc-hash-link 5s ease-in-out infinite; }
.bc-hash-fingerprint { animation:bc-fingerprint 5s ease-in-out infinite; }
.bc-consensus-accepted { animation:bc-accept 5s ease-in-out infinite; }
.bc-consensus-alternative { animation:bc-alternative 5s ease-in-out infinite; }
.bc-consensus-path { animation:bc-link 3s linear infinite; }
.bc-consensus-final { animation:bc-final 5s ease-in-out infinite; }
.bc-lifecycle-request { animation:bc-request 5s linear infinite; }
.bc-layer-interface { animation:bc-layer-top 5s ease-in-out infinite; }
.bc-layer-rules { animation:bc-layer-middle 5s ease-in-out infinite; }
.bc-whole-ticket { animation:bc-lift 4s ease-in-out infinite; }
.bc-whole-check { animation:bc-verify 4s ease-in-out infinite; }
.bc-whole-block { animation:bc-copy 4s ease-in-out infinite; }
.bc-whole-links { animation:bc-link 5s linear infinite; }
.bc-scene[data-playing="false"] * { animation-play-state:paused; }
@media(prefers-reduced-motion:reduce) { .bc-scene * { animation:none !important; } }
@keyframes bc-lift { 0%,100% {transform:translateY(0)} 50% {transform:translateY(-8px)} }
@keyframes bc-link { to {stroke-dashoffset:-136} }
@keyframes bc-copy { 0%,100% {opacity:.5;transform:translateY(0)} 50% {opacity:1;transform:translateY(-5px)} }
@keyframes bc-pulse { 0%,100% {transform:scale(.8);opacity:.4} 50% {transform:scale(1.15);opacity:1} }
@keyframes bc-key { 0%,100% {transform:translate(0,0)} 40%,65% {transform:translate(-7px,7px)} }
@keyframes bc-sign { 0%,10%,100% {stroke-dashoffset:70;opacity:.4} 50%,85% {stroke-dashoffset:0;opacity:1} }
@keyframes bc-verify { 0%,15%,100% {opacity:.25} 45%,80% {opacity:1} }
@keyframes bc-change { 0%,100% {transform:translateY(0)} 35%,65% {transform:translateY(-9px)} }
@keyframes bc-hash-link { 0%,100% {opacity:.8} 40%,65% {opacity:.2} }
@keyframes bc-fingerprint { 0%,100% {opacity:.3} 45%,75% {opacity:1} }
@keyframes bc-accept { 0%,100% {opacity:.5;transform:translateY(0)} 35%,80% {opacity:1;transform:translateY(-5px)} }
@keyframes bc-alternative { 0%,100% {opacity:.55} 40%,80% {opacity:.18} }
@keyframes bc-final { 0%,15%,100% {opacity:.25} 50%,85% {opacity:1} }
@keyframes bc-request { 0%,100% {transform:translate(51px,112px);opacity:.3} 10% {opacity:1} 45% {transform:translate(120px,80px)} 85% {transform:translate(188px,111px);opacity:1} 95% {transform:translate(188px,111px);opacity:.2} }
@keyframes bc-layer-top { 0%,100% {transform:translateY(0)} 50% {transform:translateY(-13px)} }
@keyframes bc-layer-middle { 0%,100% {transform:translateY(0)} 50% {transform:translateY(-6px)} }
`;

export const blockchainDrawings = {
	"blockchain-history": svgDrawing(
		scenes["blockchain-history"],
		styles,
		"bc-scene",
	),
	"blockchain-record": svgDrawing(
		scenes["blockchain-record"],
		styles,
		"bc-scene",
	),
	"blockchain-signature": svgDrawing(
		scenes["blockchain-signature"],
		styles,
		"bc-scene",
	),
	"blockchain-rules": svgDrawing(
		scenes["blockchain-rules"],
		styles,
		"bc-scene",
	),
	"blockchain-hashes": svgDrawing(
		scenes["blockchain-hashes"],
		styles,
		"bc-scene",
	),
	"blockchain-consensus": svgDrawing(
		scenes["blockchain-consensus"],
		styles,
		"bc-scene",
	),
	"blockchain-lifecycle": svgDrawing(
		scenes["blockchain-lifecycle"],
		styles,
		"bc-scene",
	),
	"blockchain-layers": svgDrawing(
		scenes["blockchain-layers"],
		styles,
		"bc-scene",
	),
	"blockchain-together": svgDrawing(
		scenes["blockchain-together"],
		styles,
		"bc-scene",
	),
};
