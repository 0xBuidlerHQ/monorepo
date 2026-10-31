import { svgDrawing } from "./svg-drawing";

const diamond = `<g class="eth-diamond"><path d="M 0 -29 18 0 0 11 -18 0 Z"/><path d="M -18 5 0 30 18 5 0 16 Z"/><path d="M 0 -29 V 11 M -18 0 0 -8 18 0" opacity=".4"/></g>`;
const ticket = `<path class="eth-ticket-face" d="M -28 -18 H 28 V -6 A 6 6 0 0 0 28 6 V 18 H -28 V 6 A 6 6 0 0 0 -28 -6 Z" fill="var(--background)"/><path d="M 13 -15 V 15" stroke-dasharray="2 3" opacity=".45"/><text x="-7" y="5" fill="currentColor" stroke="none" text-anchor="middle" font-size="14" font-family="monospace">42</text>`;
const coin = `<ellipse rx="15" ry="7" cy="5"/><path d="M -15 0 V 5 M 15 0 V 5"/><ellipse class="eth-coin-face" rx="15" ry="7" fill="var(--background)"/><path d="M 0 -4 5 0 0 4 -5 0 Z"/>`;
const plate = `<path d="M 25 140 120 185 215 140 120 95 Z" opacity=".13"/><path d="M 25 140 V 146 L 120 191 215 146 V 140 M 120 185 V 191" opacity=".1"/>`;

const scenes = {
	"ethereum-network": `${plate}
		<path d="M 55 122 120 92 185 122 M 120 92 V 153" opacity=".3"/>
		<g transform="translate(120 76)"><g class="eth-float">${diamond}</g></g>
		<g transform="translate(55 122) scale(.65)">${ticket}</g>
		<g transform="translate(185 122)">${coin}</g>
		<circle class="eth-network-pulse" cx="120" cy="151" r="4" fill="var(--background)"/>
		<path class="eth-network-trace" d="M 55 122 120 92 185 122" stroke-dasharray="7 140"/>`,
	"ethereum-program": `${plate}
		<path d="M 46 129 120 158 194 129" opacity=".3"/>
		<g class="eth-program-lift"><path d="M 68 43 166 62 V 135 L 68 116 Z" fill="var(--background)"/><path d="M 68 58 166 77" opacity=".3"/>
		<circle cx="77" cy="52" r="1"/><circle cx="83" cy="53" r="1"/>
		<path d="M 93 77 84 83 93 92 M 143 87 152 96 143 102 M 124 78 112 105"/>
		<path class="eth-program-scan" d="M 81 108 149 121" stroke-width="2"/></g>
		<circle class="eth-program-node" cx="46" cy="129" r="5" fill="var(--background)"/><circle class="eth-program-node" style="animation-delay:.6s" cx="194" cy="129" r="5" fill="var(--background)"/>`,
	"ethereum-ether": `${plate}
		<ellipse cx="120" cy="151" rx="39" ry="12" opacity=".2"/>
		<ellipse class="eth-ether-ring" cx="120" cy="151" rx="54" ry="18" opacity=".2"/>
		<g transform="translate(120 90)"><g class="eth-ether-hover" stroke-width="1.2">${diamond}</g></g>
		<g transform="translate(66 128) scale(.7)">${coin}</g>
		<g transform="translate(174 128) scale(.7)">${coin}</g>`,
	"ethereum-tokens": `${plate}
		<g transform="translate(83 83) rotate(-12)"><g class="eth-ticket-rise">${ticket}</g></g>
		<path d="M 48 133 105 152 M 137 152 190 133" opacity=".25"/>
		<g transform="translate(159 123)"><g class="eth-coin-stack">${coin}</g></g>
		<g transform="translate(159 112)"><g class="eth-coin-stack" style="animation-delay:.25s">${coin}</g></g>
		<g transform="translate(159 101)"><g class="eth-coin-stack" style="animation-delay:.5s">${coin}</g></g>`,
	"ethereum-exchange": `${plate}
		<path d="M 59 70 Q 120 22 181 70 M 174 59 181 70 169 71 M 181 139 Q 120 185 59 139 M 71 138 59 139 65 151" opacity=".35"/>
		<g transform="translate(69 94)"><g class="eth-exchange-ticket">${ticket}</g></g>
		<g transform="translate(171 113)"><g class="eth-exchange-coin">${coin}</g></g>
		<rect x="111" y="94" width="18" height="18" rx="4" fill="var(--background)"/>
		<path class="eth-exchange-lock" d="M 116 94 V 89 A 4 4 0 0 1 124 89 V 94 M 120 101 V 106"/>`,
	"ethereum-gas": `${plate}
		<path d="M 59 139 V 65 L 174 87 V 161 Z" fill="var(--background)"/>
		<path d="M 74 119 V 90 M 94 123 V 94 M 114 127 V 98 M 134 131 V 102 M 154 135 V 106" opacity=".18" stroke-width="7"/>
		<path class="eth-gas-step" d="M 74 119 V 90" stroke-width="4"/>
		<path class="eth-gas-step" style="animation-delay:.35s" d="M 94 123 V 94" stroke-width="4"/>
		<path class="eth-gas-step" style="animation-delay:.7s" d="M 114 127 V 98" stroke-width="4"/>
		<path class="eth-gas-step" style="animation-delay:1.05s" d="M 134 131 V 102" stroke-width="4"/>
		<path class="eth-gas-step" style="animation-delay:1.4s" d="M 154 135 V 106" stroke-width="4"/>
		<path d="M 70 76 162 94 M 70 133 162 151" opacity=".3"/>`,
	"ethereum-fees": `${plate}
		<g class="eth-fee-input" transform="translate(65 75)"><path d="M -18 12 V -2 H -10 V 12 M -4 12 V -10 H 4 V 12 M 10 12 V -20 H 18 V 12"/><path d="M -22 16 H 22" opacity=".4"/></g>
		<g transform="translate(169 75) scale(.65)">${diamond}</g>
		<path d="M 107 69 119 81 M 119 69 107 81 M 65 96 V 124 H 101 M 169 101 V 124 H 139" opacity=".35"/>
		<rect x="101" y="112" width="38" height="24" rx="4" fill="var(--background)"/>
		<path class="eth-fee-total" d="M 110 121 H 130 M 110 127 H 130"/>
		<path d="M 120 136 V 151" opacity=".35"/>
		<g transform="translate(120 159)"><g class="eth-fee-coin">${coin}</g></g>`,
	"ethereum-settlement": `${plate}
		<g transform="translate(66 112)"><g class="eth-settle-ticket">${ticket}</g></g>
		<g transform="translate(174 112)"><g class="eth-settle-coin">${coin}</g></g>
		<path d="M 66 137 120 160 174 137" opacity=".3"/>
		<circle cx="120" cy="74" r="23" fill="var(--background)"/>
		<path class="eth-settle-check" d="M 109 74 117 82 132 66" stroke-width="2"/>
		<circle class="eth-settle-ring" cx="120" cy="74" r="30" opacity=".2"/>`,
} as const;

const styles = `
.eth-scene {
 --eth-accent:#7c6bba;
 --eth-warm:#b3863c;
 --eth-success:#438e86;
}
@media(prefers-color-scheme:dark) {
 .eth-scene { --eth-accent:#b4a1ed; --eth-warm:#d8b36f; --eth-success:#7bc0b3; }
}
.eth-scene .eth-diamond { stroke:var(--eth-accent); }
.eth-scene .eth-diamond > path:first-child {
 fill:color-mix(in srgb,var(--eth-accent) 12%,var(--background));
}
.eth-scene .eth-diamond > path:nth-child(2) {
 fill:color-mix(in srgb,var(--eth-accent) 22%,var(--background));
}
.eth-scene .eth-ticket-face,.eth-scene .eth-coin-face {
 stroke:var(--eth-accent);
 fill:color-mix(in srgb,var(--eth-accent) 8%,var(--background));
}
.eth-scene .eth-network-trace,.eth-scene .eth-network-pulse,
.eth-scene .eth-program-scan,.eth-scene .eth-program-node,
.eth-scene .eth-ether-ring,.eth-scene .eth-exchange-lock,
.eth-scene .eth-fee-total { stroke:var(--eth-accent); }
.eth-scene .eth-gas-step,.eth-scene .eth-fee-input { stroke:var(--eth-warm); }
.eth-scene .eth-settle-check,.eth-scene .eth-settle-ring { stroke:var(--eth-success); }

.eth-scene * { animation-play-state: inherit; }
.eth-float { animation: eth-float 4s ease-in-out infinite; }
.eth-network-trace { animation: eth-trace 4s linear infinite; }
.eth-network-pulse { animation: eth-pulse 2s ease-in-out infinite; transform-box:fill-box; transform-origin:center; }
.eth-program-lift { animation: eth-lift 4s ease-in-out infinite; }
.eth-program-scan { animation: eth-scan 3s ease-in-out infinite; }
.eth-program-node { animation: eth-pulse 2.4s ease-in-out infinite; transform-box:fill-box; transform-origin:center; }
.eth-ether-hover { animation: eth-hover 5s ease-in-out infinite; }
.eth-ether-ring { animation: eth-ring 5s ease-in-out infinite; transform-box:fill-box; transform-origin:center; }
.eth-ticket-rise { animation: eth-lift 4s ease-in-out infinite; }
.eth-coin-stack { animation: eth-stack 4s ease-in-out infinite; }
.eth-exchange-ticket { animation: eth-ticket-travel 5s ease-in-out infinite; }
.eth-exchange-coin { animation: eth-coin-travel 5s ease-in-out infinite; }
.eth-exchange-lock { animation: eth-lock 5s ease-in-out infinite; }
.eth-gas-step { animation: eth-meter 3.5s ease-in-out infinite; stroke-dasharray:29; }
.eth-fee-input { animation: eth-fee-input 4s ease-in-out infinite; }
.eth-fee-total { animation: eth-total 4s ease-in-out infinite; }
.eth-fee-coin { animation: eth-fee-output 4s ease-in-out infinite; }
.eth-settle-ticket,.eth-settle-coin { animation: eth-land 4.5s ease-in-out infinite; }
.eth-settle-check { animation: eth-check 4.5s ease-in-out infinite; stroke-dasharray:33; }
.eth-settle-ring { animation: eth-ring 4.5s ease-in-out infinite; transform-box:fill-box; transform-origin:center; }
.eth-scene[data-playing="false"] * { animation-play-state:paused; }
@media(prefers-reduced-motion:reduce) { .eth-scene * { animation:none !important; } }
@keyframes eth-float { 0%,100% {transform:translateY(0)} 50% {transform:translateY(-8px)} }
@keyframes eth-trace { to {stroke-dashoffset:-294} }
@keyframes eth-pulse { 0%,100% {opacity:.35;transform:scale(.85)} 50% {opacity:1;transform:scale(1.15)} }
@keyframes eth-lift { 0%,100% {transform:translateY(0)} 50% {transform:translateY(-10px)} }
@keyframes eth-scan { 0%,100% {transform:translateY(0);opacity:.3} 50% {transform:translateY(-30px);opacity:1} }
@keyframes eth-hover { 0%,100% {transform:translateY(0)} 50% {transform:translateY(-13px)} }
@keyframes eth-ring { 0%,100% {transform:scale(.85);opacity:.15} 50% {transform:scale(1.12);opacity:.5} }
@keyframes eth-stack { 0%,100% {transform:translateY(0)} 50% {transform:translateY(-7px)} }
@keyframes eth-ticket-travel { 0%,15%,100% {transform:translateX(0)} 45%,65% {transform:translateX(25px)} }
@keyframes eth-coin-travel { 0%,15%,100% {transform:translateX(0)} 45%,65% {transform:translateX(-25px)} }
@keyframes eth-lock { 0%,100% {opacity:.3} 40%,70% {opacity:1} }
@keyframes eth-meter { 0%,10%,100% {stroke-dashoffset:29;opacity:.3} 45%,75% {stroke-dashoffset:0;opacity:1} }
@keyframes eth-fee-input { 0%,100% {opacity:.4} 20%,60% {opacity:1} }
@keyframes eth-total { 0%,20%,100% {opacity:.3} 40%,80% {opacity:1} }
@keyframes eth-fee-output { 0%,25%,100% {transform:translateY(0);opacity:.4} 60%,80% {transform:translateY(-8px);opacity:1} }
@keyframes eth-land { 0%,100% {transform:translateY(-5px)} 35%,75% {transform:translateY(0)} }
@keyframes eth-check { 0%,100% {stroke-dashoffset:33;opacity:.3} 35%,80% {stroke-dashoffset:0;opacity:1} }
`;

export const ethereumDrawings = {
	"ethereum-network": svgDrawing(
		scenes["ethereum-network"],
		styles,
		"eth-scene",
	),
	"ethereum-program": svgDrawing(
		scenes["ethereum-program"],
		styles,
		"eth-scene",
	),
	"ethereum-ether": svgDrawing(scenes["ethereum-ether"], styles, "eth-scene"),
	"ethereum-tokens": svgDrawing(scenes["ethereum-tokens"], styles, "eth-scene"),
	"ethereum-exchange": svgDrawing(
		scenes["ethereum-exchange"],
		styles,
		"eth-scene",
	),
	"ethereum-gas": svgDrawing(scenes["ethereum-gas"], styles, "eth-scene"),
	"ethereum-fees": svgDrawing(scenes["ethereum-fees"], styles, "eth-scene"),
	"ethereum-settlement": svgDrawing(
		scenes["ethereum-settlement"],
		styles,
		"eth-scene",
	),
};
