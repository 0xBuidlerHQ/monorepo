import { svgDrawing } from "./svg-drawing";

const plate = `<path d="M 25 140 120 185 215 140 120 95 Z" opacity=".13"/><path d="M 25 140 V 146 L 120 191 215 146 V 140 M 120 185 V 191" opacity=".1"/>`;
const coin = `<ellipse rx="15" ry="7" cy="5"/><path d="M -15 0 V 5 M 15 0 V 5"/><ellipse class="df-asset" rx="15" ry="7" fill="var(--background)"/><path d="M -5 0 H 5 M 0 -3 V 3" opacity=".55"/>`;
const diamond = `<g class="df-eth"><path d="M 0 -22 13 0 0 8 -13 0 Z"/><path d="M -13 4 0 23 13 4 0 12 Z"/><path d="M 0 -22 V 8" opacity=".4"/></g>`;
const vault = `<path class="df-surface" d="M -25 -26 H 25 V 26 H -25 Z"/><path d="M -20 -21 H 20 V 21 H -20 Z" opacity=".3"/><circle r="12"/><path d="M -8 -8 8 8 M -8 8 8 -8 M 0 -12 V -18" opacity=".5"/>`;
const check = `<path class="df-check" d="M -6 0 -1 5 9 -6" stroke-width="1.5"/>`;
const person = `<circle cy="-10" r="6"/><path d="M -12 13 V 6 Q -12 -1 0 -1 T 12 6 V 13"/>`;

const scenes = {
	"defi-network": `${plate}
		<path d="M 120 80 59 130 M 120 80 V 151 M 120 80 181 130" opacity=".3"/>
		<g transform="translate(120 69)"><g class="df-network-vault">${coin}</g></g>
		<g transform="translate(59 130) scale(.7)">${diamond}</g>
		<g transform="translate(120 151)">${coin}</g>
		<g transform="translate(181 130)"><circle class="df-surface" r="17"/><path d="M 0 -9 3 -3 10 -2 5 3 6 10 0 7 -6 10 -5 3 -10 -2 -3 -3 Z"/></g>
		<path class="df-network-flow" d="M 59 130 120 80 181 130 M 120 80 V 151" stroke-dasharray="5 65"/>`,
	"defi-allocation": `${plate}
		<g transform="translate(120 59)"><circle class="df-surface" r="23"/><text y="5" text-anchor="middle" font-family="monospace" font-size="13" fill="currentColor" stroke="none">0.6</text></g>
		<path d="M 120 82 V 102 M 56 128 V 102 H 184 V 128 M 120 102 V 143" opacity=".35"/>
		<g transform="translate(56 139)"><g class="df-allocation-part"><circle class="df-surface" r="18"/><text y="5" text-anchor="middle" font-family="monospace" font-size="12" fill="currentColor" stroke="none">0.2</text></g></g>
		<g transform="translate(120 155)"><g class="df-allocation-part" style="animation-delay:.4s"><circle class="df-surface" r="18"/><text y="5" text-anchor="middle" font-family="monospace" font-size="12" fill="currentColor" stroke="none">0.2</text></g></g>
		<g transform="translate(184 139)"><g class="df-allocation-part" style="animation-delay:.8s"><circle class="df-surface" r="18"/><text y="5" text-anchor="middle" font-family="monospace" font-size="12" fill="currentColor" stroke="none">0.2</text></g></g>`,
	"defi-staking": `${plate}
		<g transform="translate(73 78)"><g class="df-stake-eth">${diamond}</g></g>
		<path d="M 89 80 H 151 M 143 75 151 80 143 85 M 120 116 V 142" opacity=".35"/>
		<g transform="translate(173 82)"><path class="df-surface" d="M -20 -23 H 20 V 23 H -20 Z"/><path d="M -12 -13 H 12 M -12 -5 H 12 M -12 3 H 3" opacity=".3"/><g class="df-stake-check" transform="translate(3 14)">${check}</g></g>
		<path d="M 73 109 120 132 173 109" opacity=".25"/>
		<g transform="translate(120 149)"><g class="df-stake-reward">${coin}</g></g>
		<circle class="df-stake-signal" cx="121" cy="80" r="4"/>`,
	"defi-project": `${plate}
		<g transform="translate(91 90)"><g class="df-project-token"><path class="df-surface" d="M 0 -32 28 -16 V 16 L 0 32 -28 16 V -16 Z"/><path d="M 0 -17 5 -6 17 -4 9 5 11 18 0 12 -11 18 -9 5 -17 -4 -5 -6 Z"/></g></g>
		<path d="M 138 65 V 140 H 200" opacity=".25"/>
		<path class="df-project-price" d="M 144 124 155 111 165 119 177 95 189 104 199 84" stroke-dasharray="100"/>
		<path d="M 66 143 91 155 116 143" opacity=".3"/>`,
	"defi-protocol": `${plate}
		<path d="M 120 91 57 137 M 120 91 183 137" opacity=".25"/>
		<g class="df-protocol-rules"><path class="df-surface" d="M 87 42 H 153 V 113 H 87 Z"/><path d="M 99 58 H 141 M 99 69 H 131 M 99 80 H 141 M 99 91 H 124" opacity=".4"/><g transform="translate(138 100)">${check}</g></g>
		<g transform="translate(57 137)">${person}</g><g transform="translate(183 137)">${person}</g>
		<circle class="df-protocol-pulse" cx="81" cy="120" r="4"/><circle class="df-protocol-pulse" style="animation-delay:.7s" cx="159" cy="120" r="4"/>`,
	"defi-swap": `${plate}
		<path class="df-surface" d="M 61 97 Q 61 77 120 77 T 179 97 V 130 Q 179 151 120 151 T 61 130 Z"/>
		<ellipse cx="120" cy="97" rx="59" ry="20" opacity=".4"/>
		<path d="M 120 79 V 149" opacity=".2"/>
		<g transform="translate(88 87) scale(.65)"><g class="df-swap-input">${diamond}</g></g>
		<g transform="translate(150 104) scale(.8)"><g class="df-swap-output">${coin}</g></g>
		<path class="df-swap-path" d="M 67 65 Q 120 33 173 65 M 163 55 173 65 160 67" stroke-dasharray="7 6"/>`,
	"defi-permission": `${plate}
		<path class="df-surface" d="M 66 51 H 144 V 143 H 66 Z"/>
		<path d="M 78 67 H 132 M 78 79 H 119" opacity=".35"/>
		<rect x="79" y="94" width="51" height="31" rx="4" opacity=".35"/>
		<text x="104" y="114" text-anchor="middle" font-family="monospace" font-size="13" fill="currentColor" stroke="none">49.5</text>
		<g transform="translate(176 89)"><g class="df-permission-key"><circle r="11"/><circle r="3" opacity=".4"/><path d="M -8 8 -31 31 M -23 23 -17 29 M -29 29 -23 35"/></g></g>
		<g transform="translate(144 137)"><circle class="df-surface" r="14"/><g class="df-permission-check">${check}</g></g>`,
	"defi-lending": `${plate}
		<g transform="translate(120 109)">${vault}</g>
		<g transform="translate(49 89)">${person}</g><g transform="translate(191 89)">${person}</g>
		<path d="M 57 126 H 91 M 149 126 H 184 M 85 121 91 126 85 131 M 178 121 184 126 178 131" opacity=".35"/>
		<g transform="translate(61 124) scale(.6)"><g class="df-lend-deposit">${coin}</g></g>
		<g transform="translate(153 124) scale(.6)"><g class="df-lend-borrow">${coin}</g></g>
		<g transform="translate(185 54) scale(.55)"><g class="df-lend-collateral">${diamond}</g></g>`,
	"defi-liquidation": `${plate}
		<path class="df-surface" d="M 62 55 H 177 V 147 H 62 Z"/>
		<path d="M 76 68 V 132 H 163" opacity=".25"/>
		<path class="df-threshold" d="M 77 110 H 163" stroke-dasharray="3 4"/>
		<path class="df-price-line" d="M 79 78 96 84 112 78 129 98 145 104 160 119"/>
		<circle class="df-price-point" cx="160" cy="119" r="4" fill="var(--background)"/>
		<g transform="translate(184 145)"><g class="df-liquidation-warning"><path class="df-warning-face" d="M 0 -17 17 13 H -17 Z"/><path d="M 0 -6 V 3 M 0 8 V 9"/></g></g>`,
	"defi-returns": `${plate}
		<path d="M 66 85 120 115 174 85 M 120 115 V 155" opacity=".3"/>
		<g transform="translate(66 76)"><g class="df-return-fee">${coin}</g></g>
		<g transform="translate(174 76)"><g class="df-return-interest">${coin}</g></g>
		<g transform="translate(120 133)"><g class="df-return-balance">${coin}</g></g>
		<g transform="translate(120 145)">${coin}</g>
		<path class="df-return-flow" d="M 66 85 120 115 174 85" stroke-dasharray="4 60"/>
		<path class="df-variable-rate" d="M 72 54 83 49 94 53 105 43 116 47 128 39 140 43 151 36" opacity=".6"/>`,
	"defi-together": `${plate}
		<path d="M 57 108 120 74 183 108 120 149 57 108" opacity=".25"/>
		<g transform="translate(57 108) scale(.7)">${person}</g>
		<g transform="translate(183 108) scale(.7)">${person}</g>
		<g transform="translate(120 73) scale(.65)">${vault}</g>
		<g transform="translate(120 149)"><g class="df-together-coin">${coin}</g></g>
		<path class="df-together-flow" d="M 57 108 120 74 183 108 120 149 57 108" stroke-dasharray="6 70"/>
		<g transform="translate(120 111)"><circle class="df-surface" r="13"/><g class="df-together-check">${check}</g></g>`,
} as const;

const styles = `
.df-scene { --df-accent:#438e86; --df-asset:#7c6bba; --df-warm:#b3863c; }
@media(prefers-color-scheme:dark) { .df-scene { --df-accent:#7bc0b3; --df-asset:#b4a1ed; --df-warm:#d8b36f; } }
.df-scene .df-surface { stroke:var(--df-accent); fill:color-mix(in srgb,var(--df-accent) 8%,var(--background)); }
.df-scene .df-asset { stroke:var(--df-asset); fill:color-mix(in srgb,var(--df-asset) 10%,var(--background)); }
.df-scene .df-eth { stroke:var(--df-asset); fill:color-mix(in srgb,var(--df-asset) 8%,var(--background)); }
.df-scene .df-check { stroke:var(--df-accent); }
.df-scene .df-threshold,.df-scene .df-permission-key,.df-scene .df-liquidation-warning { stroke:var(--df-warm); }
.df-scene .df-warning-face { fill:color-mix(in srgb,var(--df-warm) 10%,var(--background)); }
.df-scene .df-price-line,.df-scene .df-price-point { stroke:var(--df-asset); }
.df-scene .df-network-flow,.df-scene .df-protocol-pulse,.df-scene .df-swap-path,
.df-scene .df-return-flow,.df-scene .df-together-flow,.df-scene .df-variable-rate { stroke:var(--df-accent); }
.df-allocation-part { animation:df-pulse 4s ease-in-out infinite; transform-box:fill-box; transform-origin:center; }
.df-stake-eth { animation:df-lift 5s ease-in-out infinite; }
.df-stake-reward { animation:df-balance 5s ease-in-out infinite; }
.df-stake-check { animation:df-confirm 4s ease-in-out infinite; }
.df-stake-signal { stroke:var(--df-accent); animation:df-pulse 3s ease-in-out infinite; transform-box:fill-box; transform-origin:center; }
.df-project-token { animation:df-lift 5s ease-in-out infinite; }
.df-project-price { stroke:var(--df-asset); animation:df-project-price 5s ease-in-out infinite; }
@keyframes df-project-price { 0%,100% {stroke-dashoffset:100;opacity:.4} 50%,80% {stroke-dashoffset:0;opacity:1} }
.df-scene * { animation-play-state:inherit; }
.df-network-vault { animation:df-lift 5s ease-in-out infinite; }
.df-network-flow { animation:df-flow 6s linear infinite; }
.df-protocol-rules { animation:df-lift 4s ease-in-out infinite; }
.df-protocol-pulse { animation:df-pulse 3s ease-in-out infinite; transform-box:fill-box; transform-origin:center; }
.df-swap-input { animation:df-swap-in 4.5s ease-in-out infinite; }
.df-swap-output { animation:df-swap-out 4.5s ease-in-out infinite; }
.df-swap-path { animation:df-flow 6s linear infinite; }
.df-permission-key { animation:df-key 4.5s ease-in-out infinite; }
.df-permission-check { animation:df-confirm 4.5s ease-in-out infinite; }
.df-lend-deposit { animation:df-deposit 5s ease-in-out infinite; }
.df-lend-borrow { animation:df-borrow 5s ease-in-out infinite; }
.df-lend-collateral { animation:df-lift 5s ease-in-out infinite; }
.df-price-line { animation:df-chart 5s ease-in-out infinite; stroke-dasharray:110; }
.df-price-point { animation:df-confirm 5s ease-in-out infinite; }
.df-liquidation-warning { animation:df-warning 5s ease-in-out infinite; }
.df-return-fee { animation:df-lift 4s ease-in-out infinite; }
.df-return-interest { animation:df-lift 4s ease-in-out infinite; animation-delay:.6s; }
.df-return-balance { animation:df-balance 4s ease-in-out infinite; }
.df-return-flow { animation:df-flow 5s linear infinite; }
.df-variable-rate { animation:df-rate 5s ease-in-out infinite; }
.df-together-coin { animation:df-lift 4s ease-in-out infinite; }
.df-together-flow { animation:df-flow 6s linear infinite; }
.df-together-check { animation:df-confirm 4s ease-in-out infinite; }
.df-scene[data-playing="false"] * { animation-play-state:paused; }
@media(prefers-reduced-motion:reduce) { .df-scene * { animation:none !important; } }
@keyframes df-lift { 0%,100% {transform:translateY(0)} 50% {transform:translateY(-7px)} }
@keyframes df-flow { to {stroke-dashoffset:-304} }
@keyframes df-pulse { 0%,100% {opacity:.3;transform:scale(.8)} 50% {opacity:1;transform:scale(1.15)} }
@keyframes df-swap-in { 0%,100% {transform:translateY(-7px);opacity:.4} 40%,65% {transform:translateY(4px);opacity:1} }
@keyframes df-swap-out { 0%,100% {transform:translateY(0);opacity:.4} 45%,75% {transform:translateY(-12px);opacity:1} }
@keyframes df-key { 0%,100% {transform:translate(0,0)} 40%,70% {transform:translate(-8px,8px)} }
@keyframes df-confirm { 0%,15%,100% {opacity:.3} 45%,80% {opacity:1} }
@keyframes df-deposit { 0%,100% {transform:translateX(0);opacity:.4} 40%,70% {transform:translateX(38px);opacity:1} }
@keyframes df-borrow { 0%,100% {transform:translateX(0);opacity:.4} 45%,75% {transform:translateX(38px);opacity:1} }
@keyframes df-chart { 0%,10%,100% {stroke-dashoffset:110;opacity:.4} 65%,85% {stroke-dashoffset:0;opacity:1} }
@keyframes df-warning { 0%,25%,100% {opacity:.35} 65%,85% {opacity:1} }
@keyframes df-balance { 0%,100% {transform:translateY(0)} 50% {transform:translateY(-8px)} }
@keyframes df-rate { 0%,100% {opacity:.3} 50% {opacity:1} }
`;

export const defiDrawings = {
	"defi-allocation": svgDrawing(scenes["defi-allocation"], styles, "df-scene"),
	"defi-staking": svgDrawing(scenes["defi-staking"], styles, "df-scene"),
	"defi-project": svgDrawing(scenes["defi-project"], styles, "df-scene"),
	"defi-network": svgDrawing(scenes["defi-network"], styles, "df-scene"),
	"defi-protocol": svgDrawing(scenes["defi-protocol"], styles, "df-scene"),
	"defi-swap": svgDrawing(scenes["defi-swap"], styles, "df-scene"),
	"defi-permission": svgDrawing(scenes["defi-permission"], styles, "df-scene"),
	"defi-lending": svgDrawing(scenes["defi-lending"], styles, "df-scene"),
	"defi-liquidation": svgDrawing(
		scenes["defi-liquidation"],
		styles,
		"df-scene",
	),
	"defi-returns": svgDrawing(scenes["defi-returns"], styles, "df-scene"),
	"defi-together": svgDrawing(scenes["defi-together"], styles, "df-scene"),
};
