import { svgDrawing } from "./svg-drawing";

const plate = `<path d="M 25 140 120 185 215 140 120 95 Z" opacity=".13"/><path d="M 25 140 V 146 L 120 191 215 146 V 140 M 120 185 V 191" opacity=".1"/>`;
const phone = `<rect class="wa-surface" x="-22" y="-37" width="44" height="74" rx="5"/><path d="M -8 -29 H 8 M -7 29 H 7" opacity=".4"/><rect x="-14" y="-18" width="28" height="29" rx="2" opacity=".3"/>`;
const record = `<path class="wa-surface" d="M -21 -28 H 21 V 28 H -21 Z"/><path d="M -12 -14 H 12 M -12 -4 H 12 M -12 6 H 4 M -12 16 H 9" opacity=".4"/>`;
const key = `<circle class="wa-key-face" r="9"/><circle r="3" opacity=".4"/><path d="M -6 7 -25 26 M -19 20 -13 26 M -24 25 -18 31"/>`;
const check = `<path class="wa-check" d="M -6 0 -1 5 8 -6"/>`;
const browser = `<rect class="wa-surface" x="-32" y="-27" width="64" height="54" rx="3"/><path d="M -32 -15 H 32" opacity=".3"/><circle cx="-24" cy="-21" r="1"/><circle cx="-18" cy="-21" r="1"/>`;
const number = (value: string) =>
	`<text y="5" text-anchor="middle" font-family="monospace" font-size="12" fill="currentColor" stroke="none">${value}</text>`;

const scenes = {
	"wallet-access": `${plate}
		<path d="M 73 111 120 140 171 112" opacity=".25"/>
		<g transform="translate(73 96)"><g class="wa-access-phone">${phone}${number("0.6")}</g></g>
		<g transform="translate(171 96)">${record}</g>
		<g transform="translate(126 59) scale(.7)"><g class="wa-access-key">${key}</g></g>
		<path class="wa-access-flow" d="M 95 96 H 150" stroke-dasharray="4 6"/>`,
	"wallet-account": `${plate}
		<g transform="translate(120 61)"><g class="wa-account-record">${record}</g></g>
		<path d="M 120 90 66 119 M 120 90 174 119" opacity=".3"/>
		<g transform="translate(66 131) scale(.65)">${phone}</g>
		<g transform="translate(174 131) scale(.65)">${phone}</g>
		<circle class="wa-account-read" cx="91" cy="106" r="4"/><circle class="wa-account-read" style="animation-delay:.7s" cx="149" cy="106" r="4"/>`,
	"wallet-connection": `${plate}
		<g transform="translate(66 91)">${browser}<circle cx="0" cy="6" r="8" opacity=".3"/></g>
		<g transform="translate(176 98) scale(.8)">${phone}</g>
		<path d="M 99 98 H 158" opacity=".25"/>
		<g class="wa-connect-link"><path class="wa-link-color" d="M 112 93 H 119 A 5 5 0 0 1 119 103 H 112 A 5 5 0 0 1 112 93 M 121 93 H 128 A 5 5 0 0 1 128 103 H 121"/></g>
		<g transform="translate(188 58) scale(.55)">${key}</g>`,
	"wallet-signature": `${plate}
		<g transform="translate(71 84)">${record}<path class="wa-message-sign" d="M -12 18 Q -4 -1 0 12 T 12 11" stroke-dasharray="50"/></g>
		<g transform="translate(174 87)">${record}<path class="wa-transaction-arrow" d="M -11 16 H 11 M 4 9 11 16 4 23"/></g>
		<path d="M 120 48 V 147" stroke-dasharray="3 5" opacity=".2"/>
		<circle class="wa-surface" cx="71" cy="144" r="12"/><path d="M 65 144 H 77 M 71 138 V 150" opacity=".4"/>
		<g transform="translate(174 144)"><rect class="wa-surface" x="-14" y="-11" width="28" height="22" rx="2"/><g class="wa-transaction-confirm">${check}</g></g>`,
	"wallet-permissions": `${plate}
		<g transform="translate(66 88)">${phone}<g transform="translate(0 -2)">${number("100")}</g></g>
		<path class="wa-permission-gate" d="M 114 143 V 66 H 143 V 143 M 121 76 V 132 M 136 76 V 132"/>
		<path d="M 89 110 H 111 M 146 110 H 183 M 177 105 183 110 177 115" opacity=".3"/>
		<g transform="translate(183 94) scale(.7)">${record}</g>
		<circle class="wa-permission-token" cx="99" cy="110" r="5"/>`,
	"wallet-recovery": `${plate}
		<g transform="translate(67 103) scale(.8)">${phone}</g>
		<g transform="translate(174 100)"><path class="wa-surface" d="M -29 -38 H 29 V 38 H -29 Z"/>
		<path class="wa-recovery-words" d="M -20 -25 H -10 M 0 -25 H 10 M -20 -10 H -10 M 0 -10 H 10 M -20 5 H -10 M 0 5 H 10 M -20 20 H -10 M 0 20 H 10" stroke-width="3"/></g>
		<path class="wa-recovery-route" d="M 157 151 Q 108 183 65 145 M 66 157 65 145 77 147" stroke-dasharray="4 5"/>
		<g transform="translate(114 69) scale(.55)"><g class="wa-recovery-key">${key}</g></g>`,
	"wallet-custody": `${plate}
		<g transform="translate(60 94) scale(.7)">${phone}</g>
		<g transform="translate(120 126)"><rect class="wa-surface" x="-12" y="-33" width="24" height="66" rx="5"/><rect x="-7" y="-17" width="14" height="15" rx="2" opacity=".35"/><circle class="wa-device-confirm" cy="15" r="4"/></g>
		<g transform="translate(183 88)"><path class="wa-surface" d="M -24 -25 H 24 V 25 H -24 Z"/><circle r="12"/><path d="M -8 -8 8 8 M -8 8 8 -8" opacity=".4"/></g>
		<path d="M 60 126 96 146 M 144 146 183 120" opacity=".25"/>
		<g transform="translate(122 66) scale(.55)"><g class="wa-custody-key">${key}</g></g>`,
	"wallet-authority": `${plate}
		<path d="M 64 84 120 114 176 84 M 120 114 V 146" opacity=".3"/>
		<g transform="translate(64 73) scale(.7)">${browser}<g class="wa-authority-step">${check}</g></g>
		<g transform="translate(176 73) scale(.7)">${record}<g class="wa-authority-step" style="animation-delay:.6s">${check}</g></g>
		<g transform="translate(120 147)"><circle class="wa-surface" r="18"/><g class="wa-authority-step" style="animation-delay:1.2s">${check}</g></g>
		<path class="wa-authority-flow" d="M 64 84 120 114 176 84 M 120 114 V 129" stroke-dasharray="4 50"/>`,
} as const;

const styles = `
.wa-scene { --wa-accent:#a57d57; --wa-secondary:#7c6bba; --wa-success:#438e86; }
@media(prefers-color-scheme:dark) { .wa-scene { --wa-accent:#d5b18d; --wa-secondary:#b4a1ed; --wa-success:#7bc0b3; } }
.wa-scene .wa-surface { stroke:var(--wa-accent); fill:color-mix(in srgb,var(--wa-accent) 8%,var(--background)); }
.wa-scene .wa-key-face { stroke:var(--wa-secondary); fill:color-mix(in srgb,var(--wa-secondary) 10%,var(--background)); }
.wa-scene .wa-check,.wa-scene .wa-link-color,.wa-scene .wa-device-confirm { stroke:var(--wa-success); }
.wa-scene .wa-access-flow,.wa-scene .wa-account-read,.wa-scene .wa-message-sign,.wa-scene .wa-permission-token,
.wa-scene .wa-recovery-words,.wa-scene .wa-recovery-route,.wa-scene .wa-authority-flow { stroke:var(--wa-secondary); }
.wa-scene .wa-permission-token { fill:var(--background); }
.wa-scene .wa-permission-gate,.wa-scene .wa-transaction-arrow { stroke:var(--wa-accent); }
.wa-scene * { animation-play-state:inherit; }
.wa-access-phone { animation:wa-lift 5s ease-in-out infinite; }
.wa-access-key { animation:wa-lift 4s ease-in-out infinite; }
.wa-access-flow { animation:wa-flow 5s linear infinite; }
.wa-account-record { animation:wa-lift 5s ease-in-out infinite; }
.wa-account-read { animation:wa-pulse 3s ease-in-out infinite; transform-box:fill-box; transform-origin:center; }
.wa-connect-link { animation:wa-connect 4s ease-in-out infinite; }
.wa-message-sign { animation:wa-sign 5s ease-in-out infinite; }
.wa-transaction-arrow { animation:wa-request 5s ease-in-out infinite; }
.wa-transaction-confirm { animation:wa-confirm 5s ease-in-out infinite; }
.wa-permission-gate { animation:wa-confirm 5s ease-in-out infinite; }
.wa-permission-token { animation:wa-spend 5s ease-in-out infinite; }
.wa-recovery-words { animation:wa-confirm 5s ease-in-out infinite; }
.wa-recovery-route { animation:wa-flow 6s linear infinite; }
.wa-recovery-key { animation:wa-lift 5s ease-in-out infinite; }
.wa-device-confirm { animation:wa-pulse 3s ease-in-out infinite; transform-box:fill-box; transform-origin:center; }
.wa-custody-key { animation:wa-lift 5s ease-in-out infinite; }
.wa-authority-step { animation:wa-confirm 4s ease-in-out infinite; }
.wa-authority-flow { animation:wa-flow 6s linear infinite; }
.wa-scene[data-playing="false"] * { animation-play-state:paused; }
@media(prefers-reduced-motion:reduce) { .wa-scene * { animation:none !important; } }
@keyframes wa-lift { 0%,100% {transform:translateY(0)} 50% {transform:translateY(-7px)} }
@keyframes wa-flow { to {stroke-dashoffset:-216} }
@keyframes wa-pulse { 0%,100% {opacity:.35;transform:scale(.8)} 50% {opacity:1;transform:scale(1.1)} }
@keyframes wa-connect { 0%,100% {opacity:.3} 35%,75% {opacity:1} }
@keyframes wa-sign { 0%,10%,100% {stroke-dashoffset:50;opacity:.4} 50%,85% {stroke-dashoffset:0;opacity:1} }
@keyframes wa-request { 0%,100% {transform:translateX(-3px);opacity:.3} 50% {transform:translateX(3px);opacity:1} }
@keyframes wa-confirm { 0%,15%,100% {opacity:.3} 45%,80% {opacity:1} }
@keyframes wa-spend { 0%,100% {transform:translateX(0);opacity:.3} 45%,75% {transform:translateX(57px);opacity:1} }
`;

export const walletDrawings = {
	"wallet-access": svgDrawing(scenes["wallet-access"], styles, "wa-scene"),
	"wallet-account": svgDrawing(scenes["wallet-account"], styles, "wa-scene"),
	"wallet-connection": svgDrawing(
		scenes["wallet-connection"],
		styles,
		"wa-scene",
	),
	"wallet-signature": svgDrawing(
		scenes["wallet-signature"],
		styles,
		"wa-scene",
	),
	"wallet-permissions": svgDrawing(
		scenes["wallet-permissions"],
		styles,
		"wa-scene",
	),
	"wallet-recovery": svgDrawing(scenes["wallet-recovery"], styles, "wa-scene"),
	"wallet-custody": svgDrawing(scenes["wallet-custody"], styles, "wa-scene"),
	"wallet-authority": svgDrawing(
		scenes["wallet-authority"],
		styles,
		"wa-scene",
	),
};
