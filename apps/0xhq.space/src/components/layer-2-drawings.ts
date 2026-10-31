import { svgDrawing } from "./svg-drawing";

const plate = `<path d="M 25 140 120 185 215 140 120 95 Z" opacity=".13"/><path d="M 25 140 V 146 L 120 191 215 146 V 140 M 120 185 V 191" opacity=".1"/>`;
const coin = `<ellipse rx="15" ry="7" cy="5"/><path d="M -15 0 V 5 M 15 0 V 5"/><ellipse class="l2-asset" rx="15" ry="7"/><path d="M -5 -2 H 5 M -5 2 H 5 M 0 -4 V 4" opacity=".5"/>`;
const tile = `<path class="l2-surface" d="M -23 -11 0 -22 23 -11 0 0 Z"/><path d="M -23 -11 V 8 L 0 19 23 8 V -11 M 0 0 V 19"/>`;
const document = `<path class="l2-surface" d="M -17 -22 H 17 V 22 H -17 Z"/><path d="M -9 -11 H 9 M -9 -2 H 9 M -9 7 H 3" opacity=".4"/>`;
const check = `<path class="l2-check" d="M -6 0 -1 5 8 -6"/>`;
const number = (value: string) =>
	`<text y="5" text-anchor="middle" font-family="monospace" font-size="13" fill="currentColor" stroke="none">${value}</text>`;

const scenes = {
	"layer2-networks": `${plate}
		<path d="M 66 117 120 84 174 117" opacity=".25"/>
		<g transform="translate(66 118)">${tile}<g transform="translate(0 -28)"><g class="l2-network-coin">${coin}</g></g></g>
		<g transform="translate(174 118)">${tile}<g transform="translate(0 -28)"><g class="l2-network-coin" style="animation-delay:.6s">${coin}</g></g></g>
		<g transform="translate(120 71)"><g class="l2-network-hub">${document}</g></g>
		<path class="l2-network-flow" d="M 66 117 120 84 174 117" stroke-dasharray="4 50"/>`,
	"layer2-capacity": `${plate}
		<path d="M 49 66 H 103 M 49 95 H 103 M 49 124 H 103 M 140 95 H 187" opacity=".25"/>
		<g transform="translate(55 66)"><g class="l2-capacity-request"><rect class="l2-surface" x="-7" y="-5" width="14" height="10" rx="2"/></g></g>
		<g transform="translate(55 95)"><g class="l2-capacity-request" style="animation-delay:.4s"><rect class="l2-surface" x="-7" y="-5" width="14" height="10" rx="2"/></g></g>
		<g transform="translate(55 124)"><g class="l2-capacity-request" style="animation-delay:.8s"><rect class="l2-surface" x="-7" y="-5" width="14" height="10" rx="2"/></g></g>
		<path class="l2-surface" d="M 103 53 H 140 V 137 H 103 Z"/>
		<path d="M 112 69 H 131 M 112 82 H 131 M 112 95 H 131 M 112 108 H 131 M 112 121 H 131" opacity=".4"/>
		<g transform="translate(182 95)"><g class="l2-capacity-batch">${tile}</g></g>`,
	"layer2-rollup": `${plate}
		<g transform="translate(71 67) scale(.65)"><g class="l2-rollup-record">${document}</g></g>
		<g transform="translate(120 49) scale(.65)"><g class="l2-rollup-record" style="animation-delay:.4s">${document}</g></g>
		<g transform="translate(169 67) scale(.65)"><g class="l2-rollup-record" style="animation-delay:.8s">${document}</g></g>
		<path d="M 71 84 120 105 169 84 M 120 105 V 132" opacity=".3"/>
		<g transform="translate(120 142)">${tile}<g class="l2-rollup-proof" transform="translate(0 -10)">${check}</g></g>
		<path class="l2-rollup-flow" d="M 71 84 120 105 169 84 M 120 105 V 132" stroke-dasharray="4 45"/>`,
	"layer2-balances": `${plate}
		<g transform="translate(66 98)"><path class="l2-surface" d="M -29 -34 H 29 V 34 H -29 Z"/><path d="M -21 -23 H 21" opacity=".3"/><g class="l2-balance-first">${number("200")}</g><g transform="translate(0 22) scale(.65)">${coin}</g></g>
		<g transform="translate(174 98)"><path class="l2-surface" d="M -29 -34 H 29 V 34 H -29 Z"/><path d="M -21 -23 H 21" opacity=".3"/><g class="l2-balance-second">${number("0")}</g><circle cx="0" cy="23" r="5" opacity=".3"/></g>
		<path d="M 120 54 V 144" stroke-dasharray="3 6" opacity=".25"/>
		<path class="l2-balance-focus" d="M 32 145 H 100 M 140 145 H 208"/>`,
	"layer2-bridge": `${plate}
		<g transform="translate(56 132)">${tile}</g><g transform="translate(184 132)">${tile}</g>
		<path class="l2-bridge-arch" d="M 56 118 V 99 Q 120 42 184 99 V 118 M 56 107 Q 120 50 184 107"/>
		<path d="M 80 85 V 98 M 105 73 V 85 M 135 73 V 85 M 160 85 V 98" opacity=".3"/>
		<g transform="translate(56 105)"><g class="l2-bridge-source">${coin}</g></g>
		<g transform="translate(184 105)"><g class="l2-bridge-destination">${coin}</g></g>
		<g class="l2-bridge-message"><rect class="l2-surface" x="-5" y="-4" width="10" height="8" rx="2"/></g>`,
	"layer2-versions": `${plate}
		<g transform="translate(67 86)"><g class="l2-version-native"><circle class="l2-surface" r="24"/><circle r="18" opacity=".25"/>${number("USDC")}</g></g>
		<g transform="translate(175 86)"><g class="l2-version-bridged"><circle class="l2-asset" r="24"/><path d="M -17 -8 H 17 M -17 8 H 17" opacity=".25"/>${number("USDC.e")}</g></g>
		<path d="M 67 111 V 133 M 175 111 V 133" opacity=".3"/>
		<g transform="translate(67 143) scale(.7)">${document}</g>
		<g transform="translate(175 143) scale(.7)">${document}</g>
		<path d="M 112 82 H 128 M 112 91 H 128 M 124 76 116 97" opacity=".3"/>`,
	"layer2-settlement": `${plate}
		<path d="M 57 69 120 102 183 135" opacity=".3"/>
		<g transform="translate(57 69)"><circle class="l2-surface" r="17"/><path class="l2-fast" d="M 3 -10 -6 1 H 2 L -3 11 8 -2 H 0 Z"/></g>
		<g transform="translate(120 102) scale(.75)"><g class="l2-settlement-batch">${document}</g></g>
		<g transform="translate(183 135)"><circle class="l2-surface" r="18"/><g class="l2-settlement-check">${check}</g></g>
		<path class="l2-settlement-flow" d="M 75 78 103 92 M 137 112 166 126" stroke-dasharray="4 5"/>`,
} as const;

const styles = `
.l2-scene { --l2-accent:#a1b2e6; --l2-secondary:#7bc0b3; --l2-warm:#d8b36f; }

.l2-scene .l2-surface { stroke:var(--l2-accent); fill:color-mix(in srgb,var(--l2-accent) 8%,var(--background)); }
.l2-scene .l2-asset { stroke:var(--l2-secondary); fill:color-mix(in srgb,var(--l2-secondary) 10%,var(--background)); }
.l2-scene .l2-network-flow,.l2-scene .l2-rollup-flow,.l2-scene .l2-bridge-arch,.l2-scene .l2-settlement-flow { stroke:var(--l2-accent); }
.l2-scene .l2-check { stroke:var(--l2-secondary); }
.l2-scene .l2-fast,.l2-scene .l2-balance-focus { stroke:var(--l2-warm); }
.l2-scene * { animation-play-state:inherit; }
.l2-network-coin { animation:l2-lift 5s ease-in-out infinite; }
.l2-network-hub { animation:l2-lift 4s ease-in-out infinite; }
.l2-network-flow { animation:l2-flow 6s linear infinite; }
.l2-capacity-request { animation:l2-request 4s ease-in-out infinite; }
.l2-capacity-batch { animation:l2-batch 4s ease-in-out infinite; }
.l2-rollup-record { animation:l2-lift 4s ease-in-out infinite; }
.l2-rollup-proof { animation:l2-confirm 4s ease-in-out infinite; }
.l2-rollup-flow { animation:l2-flow 5s linear infinite; }
.l2-balance-first { animation:l2-focus 5s ease-in-out infinite; }
.l2-balance-second { animation:l2-focus 5s ease-in-out infinite; animation-delay:2.5s; }
.l2-balance-focus { animation:l2-focus 5s ease-in-out infinite; }
.l2-bridge-source { animation:l2-source 5s ease-in-out infinite; }
.l2-bridge-destination { animation:l2-destination 5s ease-in-out infinite; }
.l2-bridge-message { animation:l2-crossing 5s ease-in-out infinite; }
.l2-version-native { animation:l2-lift 5s ease-in-out infinite; }
.l2-version-bridged { animation:l2-lift 5s ease-in-out infinite; animation-delay:.8s; }
.l2-fast { animation:l2-focus 3s ease-in-out infinite; }
.l2-settlement-batch { animation:l2-lift 5s ease-in-out infinite; }
.l2-settlement-check { animation:l2-confirm 5s ease-in-out infinite; }
.l2-settlement-flow { animation:l2-flow 6s linear infinite; }
.l2-scene[data-playing="false"] * { animation-play-state:paused; }
@media(prefers-reduced-motion:reduce) { .l2-scene * { animation:none !important; } }
@keyframes l2-lift { 0%,100% {transform:translateY(0)} 50% {transform:translateY(-7px)} }
@keyframes l2-flow { to {stroke-dashoffset:-270} }
@keyframes l2-request { 0%,100% {transform:translateX(0);opacity:.4} 50%,75% {transform:translateX(36px);opacity:1} }
@keyframes l2-batch { 0%,100% {opacity:.4;transform:translateY(0)} 50%,75% {opacity:1;transform:translateY(-6px)} }
@keyframes l2-confirm { 0%,15%,100% {opacity:.3} 50%,80% {opacity:1} }
@keyframes l2-focus { 0%,100% {opacity:.45} 50% {opacity:1} }
@keyframes l2-source { 0%,100% {opacity:1} 45%,80% {opacity:.2} }
@keyframes l2-destination { 0%,100% {opacity:.2} 55%,85% {opacity:1} }
@keyframes l2-crossing { 0%,100% {transform:translate(56px,99px);opacity:.3} 20% {opacity:1} 50% {transform:translate(120px,70px)} 80% {transform:translate(184px,99px);opacity:1} 90% {transform:translate(184px,99px);opacity:.3} }
`;

export const layer2Drawings = {
	"layer2-networks": svgDrawing(scenes["layer2-networks"], styles, "l2-scene"),
	"layer2-capacity": svgDrawing(scenes["layer2-capacity"], styles, "l2-scene"),
	"layer2-rollup": svgDrawing(scenes["layer2-rollup"], styles, "l2-scene"),
	"layer2-balances": svgDrawing(scenes["layer2-balances"], styles, "l2-scene"),
	"layer2-bridge": svgDrawing(scenes["layer2-bridge"], styles, "l2-scene"),
	"layer2-versions": svgDrawing(scenes["layer2-versions"], styles, "l2-scene"),
	"layer2-settlement": svgDrawing(
		scenes["layer2-settlement"],
		styles,
		"l2-scene",
	),
};
