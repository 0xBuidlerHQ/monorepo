"use client";

import type { CSSProperties, PointerEvent } from "react";
import styles from "./main-page-drawing.module.css";

export type MainPageScene =
	| "studio"
	| "notebook"
	| "idea"
	| "book"
	| "collectible"
	| "media";

// Original line drawings, composed on the same 240 × 200 drafting canvas.
// Each group describes a physical part so its motion belongs to the object.
const scenes: Record<
	MainPageScene,
	{ base: string; moving: string; detail: string; accent: string }
> = {
	studio: {
		base: "M28 132 120 180 212 132 120 84ZM28 132v10l92 48 92-48v-10M120 180v10M46 151v23M194 151v23",
		moving:
			"M52 117 104 90 151 115 99 143ZM67 117l35-18 32 17-35 18Z M87 116a12 6 0 1 0 24 0a12 6 0 1 0-24 0M105 120l17-9 10 5",
		detail:
			"M153 111V65l26-10v45M153 65l26-10v8l-26 10M140 114c0-5 13-10 13-4s-13 10-13 4ZM166 104c0-5 13-10 13-4s-13 10-13 4Z",
		accent:
			"M65 81 83 47l7 4-18 34-8 6ZM83 47l3-5 7 4-3 5M65 81l7 4M188 75v12M182 81h12",
	},
	notebook: {
		base: "M48 64 142 40 190 123 96 153 48 64ZM48 64v10l48 90 94-30v-11M96 153v11M56 64l44 78M63 61l44 78",
		moving:
			"M140 100 172 46l9 5-32 54-12 8ZM172 46l4-7 9 5-4 7M140 100l9 5M137 113l5-2",
		detail: "M82 76l48-13M88 87l44-12M94 98l32-9M100 109l22-6M106 120l43-12",
		accent:
			"M40 121c-15 1-14 15 0 15s22-16 10-21-22 18-8 28M165 153h24M177 141v24",
	},
	idea: {
		base: "M66 146 120 174 174 146 120 118ZM66 146v8l54 28 54-28v-8M120 174v8M120 145V99M120 124 76 101M120 124l44-24",
		moving:
			"M96 53 120 39 144 53v29l-24 14-24-14ZM96 53l24 14 24-14M120 67v29M96 82l24-14 24 14",
		detail:
			"M61 88 76 80 91 88v17l-15 8-15-8ZM61 88l15 8 15-8M76 96v17M150 87l14-8 15 8v17l-15 8-14-8ZM150 87l14 8 15-8M164 95v17",
		accent:
			"M120 20v9M82 37l7 6M151 42l8-6M75 65h-9M165 64h9M115 109h10M120 104v10",
	},
	book: {
		base: "M29 108 81 80l40 22 39-22 51 28-90 49ZM29 108v8l92 49 90-49v-8M121 157v8M121 102v55",
		moving:
			"M121 102C101 83 75 71 48 70v45c25 2 51 15 73 34 22-19 48-32 73-34V70c-27 1-53 13-73 32ZM121 102v47",
		detail:
			"M60 86c18 4 34 12 48 23M60 97c18 4 34 12 48 23M60 108c15 4 27 10 38 18M134 109c15-12 30-19 47-23M134 120c15-12 30-19 47-23",
		accent:
			"M90 58h18V46h18V34h18M98 58v8M117 46v8M135 34v8M144 34l-5-5M144 34l-5 5",
	},
	collectible: {
		base: "M49 129 120 166 191 129 120 92ZM49 129v15l71 37 71-37v-15M120 166v15M65 142l55 28 55-28",
		moving:
			"M89 88 102 60h36l13 28-31 29ZM89 88h62M102 60l18 28 18-28M120 88v29M102 60l-13 28 31 29 31-29-13-28",
		detail:
			"M75 110V55l45-24 45 24v55M75 55l45 24 45-24M120 31v17M75 110l14 8M165 110l-14 8",
		accent: "M170 48v16M162 56h16M58 89v10M53 94h10M108 137l9 5 16-9",
	},
	media: {
		base: "M46 53 164 34v91L46 144ZM46 144v8l118-19v-8M94 144v17l30-5v-17M79 164l60-10M54 61l102-16v68L54 130Z",
		moving:
			"M94 76v35l30-23-30-12ZM185 69c13 7 13 28 0 37M193 60c22 12 22 42 0 55",
		detail:
			"M60 138l28-4M136 126l20-3M68 172v-11M76 175v-22M84 173v-30M92 172v-15M100 170v-22M108 169v-12M116 167v-7",
		accent: "M172 139h27M177 148h17M182 157h7M28 80v14M21 87h14",
	},
};

export function MainPageDrawing({ scene }: { scene: MainPageScene }) {
	const drawing = scenes[scene];
	function followPointer(event: PointerEvent<HTMLDivElement>) {
		const bounds = event.currentTarget.getBoundingClientRect();
		event.currentTarget.style.setProperty(
			"--turn",
			`${((event.clientX - bounds.left) / bounds.width - 0.5) * 12}deg`,
		);
		event.currentTarget.style.setProperty(
			"--tilt",
			`${(0.5 - (event.clientY - bounds.top) / bounds.height) * 10}deg`,
		);
	}
	return (
		<div
			className={styles.scene}
			data-scene={scene}
			onPointerMove={followPointer}
			onPointerLeave={(event) => {
				event.currentTarget.style.setProperty("--turn", "0deg");
				event.currentTarget.style.setProperty("--tilt", "0deg");
			}}
			style={{ "--turn": "0deg", "--tilt": "0deg" } as CSSProperties}
		>
			<svg viewBox="0 0 240 200" fill="none" aria-hidden="true">
				<g className={styles.base}>
					<path d={drawing.base} />
				</g>
				<g className={styles.moving}>
					<path d={drawing.moving} />
				</g>
				<g className={styles.detail}>
					<path d={drawing.detail} />
				</g>
				<g className={styles.accent}>
					<path d={drawing.accent} />
				</g>
			</svg>
		</div>
	);
}
