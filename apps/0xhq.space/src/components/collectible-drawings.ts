import { svgDrawing } from "./svg-drawing";

const styles = `
.id-scene { --id-gold:#dfbb7b; --id-green:#98c4b2; --id-violet:#baa5dc; }

.id-scene .id-paper { fill:var(--background);stroke:var(--id-violet); }
.id-scene .id-gold { stroke:var(--id-gold); }
.id-scene .id-green { stroke:var(--id-green); }
.id-scene .id-violet { stroke:var(--id-violet); }
.id-scene .id-flow,.id-scene .id-orbit { stroke:var(--id-gold);animation:id-flow 10s linear infinite; }
.id-scene * { animation-play-state:inherit; }
.id-scene .id-float { animation:id-float 6s ease-in-out infinite; }
.id-scene .id-pulse { animation:id-pulse 5s ease-in-out infinite; }
.id-scene .id-delayed { animation:id-pulse 5s ease-in-out -2.5s infinite; }
.id-scene .id-scan { animation:id-scan 7s ease-in-out infinite; }
.id-scene .id-stamp { animation:id-stamp 5s ease-in-out infinite; }
.id-scene .id-shield { animation:id-pulse 5s ease-in-out infinite; }
.id-scene .id-door { transform-box:fill-box;transform-origin:left;animation:id-door 6s ease-in-out infinite; }
.id-scene .id-write { animation:id-write 6s ease-in-out infinite; }
.id-scene .id-ink { animation:id-ink 6s ease-in-out infinite; }
.id-scene[data-playing="false"] * { animation-play-state:paused; }
@media(prefers-reduced-motion:reduce) { .id-scene * { animation:none !important; } }
@keyframes id-float { 0%,100% {transform:translateY(0)} 50% {transform:translateY(-7px)} }
@keyframes id-flow { to {stroke-dashoffset:-120} }
@keyframes id-pulse { 0%,100% {opacity:.35} 50% {opacity:1} }
@keyframes id-scan { 0%,100% {transform:translate(-9px,5px)} 50% {transform:translate(9px,-5px)} }
@keyframes id-stamp { 0%,100% {transform:translateY(-12px)} 40%,65% {transform:translateY(5px)} }
@keyframes id-door { 0%,100% {transform:scaleX(1)} 50% {transform:scaleX(.4)} }
@keyframes id-write { 0%,100% {transform:translate(-18px,0)} 65% {transform:translate(7px,4px)} }
@keyframes id-ink { 0%,100% {stroke-dashoffset:100;opacity:.3} 65%,85% {stroke-dashoffset:0;opacity:1} }
`;

export const collectibleDrawings = {
	"collectible-identity": svgDrawing(
		`<path d="M 27 145 120 187 213 145 120 103 Z" opacity=".12"/><g transform="translate(120 92) scale(1)"><g class="id-float"><rect class="id-paper" x="-22" y="-31" width="44" height="62" rx="4"/><path class="id-gold" d="M 0 -20 11 -5 0 10 -11 -5 Z"/><path d="M -12 20 H 12 M -7 25 H 7" opacity=".4"/></g></g><g transform="translate(177 127) scale(0.65)"><g class="id-pulse"><circle class="id-gold" r="23"/><circle r="17" opacity=".3"/><path class="id-green" d="M -9 0 -2 7 11 -9"/><path d="M -15 19 -20 36 -8 31 0 38 4 24 M 9 22 15 37 20 29 29 30 21 11"/></g></g><ellipse class="id-orbit" cx="120" cy="105" rx="76" ry="30" stroke-dasharray="3 10"/>`,
		styles,
		"id-scene",
	),
	"collectible-vision": svgDrawing(
		`<path d="M 27 145 120 187 213 145 120 103 Z" opacity=".12"/><g transform="translate(120 90) scale(1)"><g class="id-float"><rect class="id-paper" x="-22" y="-31" width="44" height="62" rx="4"/><path class="id-gold" d="M 0 -20 11 -5 0 10 -11 -5 Z"/><path d="M -12 20 H 12 M -7 25 H 7" opacity=".4"/></g></g><g transform="translate(48 121) scale(0.7)"><g class="id-pulse"><path class="id-paper" d="M 0 -19 18 -9 V 12 L 0 23 -18 12 V -9 Z"/><path d="M -18 -9 0 2 18 -9 M 0 2 V 23"/></g></g><g transform="translate(193 122) scale(0.65)"><g class=""><path class="id-paper" d="M -30 -10 0 -31 30 -10 V 28 H -30 Z"/><path class="id-gold" d="M -37 -9 0 -36 37 -9 M -9 28 V 3 H 9 V 28"/><path d="M -21 -4 V 14 M 21 -4 V 14"/></g></g><path class="id-flow" d="M 68 116 96 101 M 143 101 172 115" stroke-dasharray="3 7"/>`,
		styles,
		"id-scene",
	),
	"collectible-process": svgDrawing(
		`<path d="M 27 145 120 187 213 145 120 103 Z" opacity=".12"/><g transform="translate(62 95) scale(1)"><g class=""><rect class="id-paper" x="-22" y="-31" width="44" height="62" rx="4"/><path class="id-gold" d="M 0 -20 11 -5 0 10 -11 -5 Z"/><path d="M -12 20 H 12 M -7 25 H 7" opacity=".4"/></g></g><g transform="translate(180 95) scale(1)"><g class="id-pulse"><path class="id-paper" d="M 0 -19 18 -9 V 12 L 0 23 -18 12 V -9 Z"/><path d="M -18 -9 0 2 18 -9 M 0 2 V 23"/></g></g><path class="id-flow" d="M 65 110 Q 120 155 175 110" stroke-dasharray="4 9"/><g transform="translate(120 65) scale(0.65)"><g class="id-scan"><circle class="id-paper" r="24"/><circle class="id-gold" r="16"/><path d="M 17 17 36 36" stroke-width="3"/></g></g>`,
		styles,
		"id-scene",
	),
	"collectible-pillars": svgDrawing(
		`<path d="M 27 145 120 187 213 145 120 103 Z" opacity=".12"/><path d="M 35 67 H 205 L 120 34 Z" class="id-gold"/><path d="M 35 151 H 205 M 45 159 H 195"/><g class="id-pulse"><path class="id-green" d="M 55 77 V 143 M 65 77 V 143"/></g><g class="id-delayed"><path class="id-gold" d="M 115 77 V 143 M 125 77 V 143"/></g><path class="id-violet" d="M 175 77 V 143 M 185 77 V 143"/>`,
		styles,
		"id-scene",
	),
	"collectible-grading": svgDrawing(
		`<path d="M 27 145 120 187 213 145 120 103 Z" opacity=".12"/><g transform="translate(100 103) scale(1)"><g class=""><rect class="id-paper" x="-22" y="-31" width="44" height="62" rx="4"/><path class="id-gold" d="M 0 -20 11 -5 0 10 -11 -5 Z"/><path d="M -12 20 H 12 M -7 25 H 7" opacity=".4"/></g></g><rect class="id-green" x="70" y="62" width="60" height="83" rx="7"/><g transform="translate(154 83) scale(0.8)"><g class="id-scan"><circle class="id-paper" r="24"/><circle class="id-gold" r="16"/><path d="M 17 17 36 36" stroke-width="3"/></g></g>`,
		styles,
		"id-scene",
	),
	"collectible-provenance": svgDrawing(
		`<path d="M 27 145 120 187 213 145 120 103 Z" opacity=".12"/><g transform="translate(58 94) scale(0.8)"><g class="id-float"><rect class="id-paper" x="-22" y="-31" width="44" height="62" rx="4"/><path class="id-gold" d="M 0 -20 11 -5 0 10 -11 -5 Z"/><path d="M -12 20 H 12 M -7 25 H 7" opacity=".4"/></g></g><g transform="translate(123 114) scale(0.8)"><g class="id-pulse"><path class="id-paper" d="M 0 -19 18 -9 V 12 L 0 23 -18 12 V -9 Z"/><path d="M -18 -9 0 2 18 -9 M 0 2 V 23"/></g></g><g transform="translate(184 94) scale(0.8)"><g class="id-delayed"><circle class="id-gold" r="23"/><circle r="17" opacity=".3"/><path class="id-green" d="M -9 0 -2 7 11 -9"/><path d="M -15 19 -20 36 -8 31 0 38 4 24 M 9 22 15 37 20 29 29 30 21 11"/></g></g><path class="id-flow" d="M 79 99 104 110 M 142 110 163 99" stroke-dasharray="3 7"/>`,
		styles,
		"id-scene",
	),
	"collectible-community": svgDrawing(
		`<path d="M 27 145 120 187 213 145 120 103 Z" opacity=".12"/><g transform="translate(120 83) scale(1)"><g class="id-float"><path class="id-paper" d="M -30 -10 0 -31 30 -10 V 28 H -30 Z"/><path class="id-gold" d="M -37 -9 0 -36 37 -9 M -9 28 V 3 H 9 V 28"/><path d="M -21 -4 V 14 M 21 -4 V 14"/></g></g><g transform="translate(57 130) scale(0.8)"><g class="id-pulse"><circle class="id-paper" cy="-12" r="9"/><path class="id-paper" d="M -17 23 V 14 Q -17 1 0 1 T 17 14 V 23 Z"/></g></g><g transform="translate(183 130) scale(0.8)"><g class="id-delayed"><circle class="id-paper" cy="-12" r="9"/><path class="id-paper" d="M -17 23 V 14 Q -17 1 0 1 T 17 14 V 23 Z"/></g></g><path class="id-flow" d="M 65 110 Q 120 155 175 110" stroke-dasharray="4 9"/>`,
		styles,
		"id-scene",
	),
	"collectible-ownership": svgDrawing(
		`<path d="M 27 145 120 187 213 145 120 103 Z" opacity=".12"/><g transform="translate(120 97) scale(1)"><g class=""><rect class="id-paper" x="-22" y="-31" width="44" height="62" rx="4"/><path class="id-gold" d="M 0 -20 11 -5 0 10 -11 -5 Z"/><path d="M -12 20 H 12 M -7 25 H 7" opacity=".4"/></g></g><path class="id-green id-shield" d="M 120 42 166 61 V 105 Q 166 140 120 159 Q 74 140 74 105 V 61 Z"/><g transform="translate(173 126) scale(0.65)"><g class="id-pulse"><circle class="id-gold" r="23"/><circle r="17" opacity=".3"/><path class="id-green" d="M -9 0 -2 7 11 -9"/><path d="M -15 19 -20 36 -8 31 0 38 4 24 M 9 22 15 37 20 29 29 30 21 11"/></g></g>`,
		styles,
		"id-scene",
	),
	"collectible-passport": svgDrawing(
		`<path d="M 27 145 120 187 213 145 120 103 Z" opacity=".12"/><g transform="translate(112 105) scale(1.35)"><g class="id-float"><path class="id-paper" d="M -31 -25 Q -15 -30 0 -21 Q 15 -30 31 -25 V 25 Q 15 20 0 29 Q -15 20 -31 25 Z"/><path d="M 0 -21 V 29 M -23 -15 -8 -13 M -23 -5 -8 -3 M 8 -13 23 -15 M 8 -3 23 -5" opacity=".4"/></g></g><g transform="translate(176 133) scale(0.6)"><g class="id-pulse"><circle class="id-gold" r="23"/><circle r="17" opacity=".3"/><path class="id-green" d="M -9 0 -2 7 11 -9"/><path d="M -15 19 -20 36 -8 31 0 38 4 24 M 9 22 15 37 20 29 29 30 21 11"/></g></g>`,
		styles,
		"id-scene",
	),
	"collectible-hub": svgDrawing(
		`<path d="M 27 145 120 187 213 145 120 103 Z" opacity=".12"/><g transform="translate(120 94) scale(1)"><g class=""><path class="id-paper" d="M -30 -10 0 -31 30 -10 V 28 H -30 Z"/><path class="id-gold" d="M -37 -9 0 -36 37 -9 M -9 28 V 3 H 9 V 28"/><path d="M -21 -4 V 14 M 21 -4 V 14"/></g></g><path class="id-gold id-door" d="M 111 122 V 97 H 129 V 122"/><g transform="translate(58 131) scale(0.5)"><g class="id-float"><rect class="id-paper" x="-22" y="-31" width="44" height="62" rx="4"/><path class="id-gold" d="M 0 -20 11 -5 0 10 -11 -5 Z"/><path d="M -12 20 H 12 M -7 25 H 7" opacity=".4"/></g></g><g transform="translate(183 132) scale(0.65)"><g class="id-delayed"><circle class="id-paper" cy="-12" r="9"/><path class="id-paper" d="M -17 23 V 14 Q -17 1 0 1 T 17 14 V 23 Z"/></g></g>`,
		styles,
		"id-scene",
	),
	"collectible-ecosystem": svgDrawing(
		`<path d="M 27 145 120 187 213 145 120 103 Z" opacity=".12"/><g transform="translate(64 63) scale(0.65)"><g class=""><rect class="id-paper" x="-22" y="-31" width="44" height="62" rx="4"/><path class="id-gold" d="M 0 -20 11 -5 0 10 -11 -5 Z"/><path d="M -12 20 H 12 M -7 25 H 7" opacity=".4"/></g></g><g transform="translate(176 63) scale(0.8)"><g class="id-pulse"><path class="id-paper" d="M 0 -19 18 -9 V 12 L 0 23 -18 12 V -9 Z"/><path d="M -18 -9 0 2 18 -9 M 0 2 V 23"/></g></g><g transform="translate(176 139) scale(0.65)"><g class=""><path class="id-paper" d="M -30 -10 0 -31 30 -10 V 28 H -30 Z"/><path class="id-gold" d="M -37 -9 0 -36 37 -9 M -9 28 V 3 H 9 V 28"/><path d="M -21 -4 V 14 M 21 -4 V 14"/></g></g><g transform="translate(64 139) scale(0.8)"><g class="id-delayed"><circle class="id-paper" cy="-12" r="9"/><path class="id-paper" d="M -17 23 V 14 Q -17 1 0 1 T 17 14 V 23 Z"/></g></g><path class="id-flow" d="M 86 63 H 155 M 176 84 V 113 M 153 139 H 84 M 64 113 V 86" stroke-dasharray="4 8"/>`,
		styles,
		"id-scene",
	),
	"collectible-business": svgDrawing(
		`<path d="M 27 145 120 187 213 145 120 103 Z" opacity=".12"/><g transform="translate(64 87) scale(0.85)"><g class="id-float"><rect class="id-paper" x="-22" y="-31" width="44" height="62" rx="4"/><path class="id-gold" d="M 0 -20 11 -5 0 10 -11 -5 Z"/><path d="M -12 20 H 12 M -7 25 H 7" opacity=".4"/></g></g><g transform="translate(176 103) scale(1)"><g class="id-pulse"><ellipse class="id-gold" rx="25" ry="12"/><path class="id-gold" d="M -25 0 V 10 A 25 12 0 0 0 25 10 V 0 M -25 10 V 20 A 25 12 0 0 0 25 20 V 10"/><path d="M -15 -2 H 15 M -8 3 H 8" opacity=".4"/></g></g><path class="id-flow" d="M 65 110 Q 120 155 175 110" stroke-dasharray="4 9"/><path class="id-green" d="M 110 68 120 78 137 57"/>`,
		styles,
		"id-scene",
	),
	"collectible-standard": svgDrawing(
		`<path d="M 27 145 120 187 213 145 120 103 Z" opacity=".12"/><g transform="translate(76 105) scale(1)"><g class=""><rect class="id-paper" x="-22" y="-31" width="44" height="62" rx="4"/><path class="id-gold" d="M 0 -20 11 -5 0 10 -11 -5 Z"/><path d="M -12 20 H 12 M -7 25 H 7" opacity=".4"/></g></g><g transform="translate(163 96) scale(1)"><g class="id-stamp"><circle class="id-gold" r="23"/><circle r="17" opacity=".3"/><path class="id-green" d="M -9 0 -2 7 11 -9"/><path d="M -15 19 -20 36 -8 31 0 38 4 24 M 9 22 15 37 20 29 29 30 21 11"/></g></g><path class="id-green id-pulse" d="M 139 151 H 190 M 145 158 H 184"/>`,
		styles,
		"id-scene",
	),
	"collectible-expansion": svgDrawing(
		`<path d="M 27 145 120 187 213 145 120 103 Z" opacity=".12"/><g transform="translate(120 97) scale(1)"><g class="id-float"><rect class="id-paper" x="-22" y="-31" width="44" height="62" rx="4"/><path class="id-gold" d="M 0 -20 11 -5 0 10 -11 -5 Z"/><path d="M -12 20 H 12 M -7 25 H 7" opacity=".4"/></g></g><g transform="translate(50 69) scale(0.75)"><g class="id-pulse"><path class="id-paper" d="M 0 -19 18 -9 V 12 L 0 23 -18 12 V -9 Z"/><path d="M -18 -9 0 2 18 -9 M 0 2 V 23"/></g></g><g transform="translate(190 69) scale(0.75)"><g class="id-delayed"><path class="id-paper" d="M 0 -19 18 -9 V 12 L 0 23 -18 12 V -9 Z"/><path d="M -18 -9 0 2 18 -9 M 0 2 V 23"/></g></g><g transform="translate(50 142) scale(0.75)"><g class="id-delayed"><path class="id-paper" d="M 0 -19 18 -9 V 12 L 0 23 -18 12 V -9 Z"/><path d="M -18 -9 0 2 18 -9 M 0 2 V 23"/></g></g><g transform="translate(190 142) scale(0.75)"><g class="id-pulse"><path class="id-paper" d="M 0 -19 18 -9 V 12 L 0 23 -18 12 V -9 Z"/><path d="M -18 -9 0 2 18 -9 M 0 2 V 23"/></g></g><path class="id-flow" d="M 70 74 96 86 M 144 86 170 74 M 70 137 96 113 M 144 113 170 137" stroke-dasharray="3 8"/>`,
		styles,
		"id-scene",
	),
	"collectible-network": svgDrawing(
		`<path d="M 27 145 120 187 213 145 120 103 Z" opacity=".12"/><g transform="translate(51 87) scale(0.7)"><g class="id-delayed"><circle class="id-paper" cy="-12" r="9"/><path class="id-paper" d="M -17 23 V 14 Q -17 1 0 1 T 17 14 V 23 Z"/></g></g><g transform="translate(120 48) scale(0.7)"><g class="id-pulse"><circle class="id-paper" cy="-12" r="9"/><path class="id-paper" d="M -17 23 V 14 Q -17 1 0 1 T 17 14 V 23 Z"/></g></g><g transform="translate(189 87) scale(0.7)"><g class="id-delayed"><circle class="id-paper" cy="-12" r="9"/><path class="id-paper" d="M -17 23 V 14 Q -17 1 0 1 T 17 14 V 23 Z"/></g></g><g transform="translate(161 147) scale(0.7)"><g class="id-pulse"><circle class="id-paper" cy="-12" r="9"/><path class="id-paper" d="M -17 23 V 14 Q -17 1 0 1 T 17 14 V 23 Z"/></g></g><g transform="translate(79 147) scale(0.7)"><g class="id-delayed"><circle class="id-paper" cy="-12" r="9"/><path class="id-paper" d="M -17 23 V 14 Q -17 1 0 1 T 17 14 V 23 Z"/></g></g><path class="id-flow" d="M 51 87 120 48 189 87 161 147 H 79 Z" stroke-dasharray="3 9"/>`,
		styles,
		"id-scene",
	),
	"collectible-ambition": svgDrawing(
		`<path d="M 27 145 120 187 213 145 120 103 Z" opacity=".12"/><g transform="translate(120 90) scale(1.3)"><g class="id-float"><circle class="id-gold" r="23"/><circle r="17" opacity=".3"/><path class="id-green" d="M -9 0 -2 7 11 -9"/><path d="M -15 19 -20 36 -8 31 0 38 4 24 M 9 22 15 37 20 29 29 30 21 11"/></g></g><path class="id-green id-pulse" d="M 44 145 63 132 82 145 M 158 145 177 132 196 145"/><path class="id-gold id-flow" d="M 120 145 V 177 M 78 86 H 40 M 162 86 H 200" stroke-dasharray="3 7"/>`,
		styles,
		"id-scene",
	),
	"collectible-names": svgDrawing(
		`<path d="M 27 145 120 187 213 145 120 103 Z" opacity=".12"/><g transform="translate(157 83) scale(1)"><g class="id-write"><path class="id-gold" d="M -17 21 -12 7 18 -23 27 -14 -3 16 Z"/><path d="M -12 7 -3 16 M 13 -18 22 -9"/></g></g><path class="id-paper" d="M 47 71 H 180 V 143 H 47 Z"/><path class="id-gold id-ink" d="M 66 99 Q 77 76 87 98 T 111 98 T 137 98" stroke-dasharray="100"/><path d="M 66 120 H 150 M 66 130 H 123" opacity=".3"/>`,
		styles,
		"id-scene",
	),
};
