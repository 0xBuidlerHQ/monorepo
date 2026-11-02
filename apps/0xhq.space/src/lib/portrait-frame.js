import { hairlineCore as HL } from "./hairline-drawings";

/** Different physical structures, composed within the same narrow viewport. */
export function drawPortraitFrame({ scene, span, P, g, block }) {
	const { mk, open } = HL;
	const levels = [span - 53, span * 0.47, 0];
	const offsets = {
		sketchbook: [-14, 18, -8],
		learn: [-5, 14, -10],
		ideas: [0, 0, 0],
		curated: [-18, 20, -8],
		content: [0, 0, 0],
		glossary: [0, 12, 0],
	}[scene] ?? [0, 0, 0];
	if (scene === "workbench") {
		for (const x of [-43, 43]) {
			block(g, x - 2, -26, x + 2, -22, 0, span, 1.7);
			block(g, x - 7, -31, x + 7, -17, -5, 1, 3);
			block(g, x - 3, -27, x + 3, -21, span, span + 3, 2);
		}
		return [0.77, 0.45, 0.13].map((ratio) => {
			const z = span * ratio;
			return {
				z,
				offset: 0,
				accent: block(g, -51, -31, 51, 33, z, z + 3.5, 4),
			};
		});
	}
	if (scene === "sketchbook") {
		// One continuous manuscript grows upward from a typewriter, above a narrow desk.
		const step = (span - 76) / 4;
		const pages = Array.from({ length: 4 }, (_, i) => ({
			z: span - (i + 1) * step - 4,
			offset: 0,
			accent: null,
			hitZ: step / 2,
			clip: { height: step },
		}));
		pages.push({ z: -4, offset: 0, accent: null, hitZ: 57 });
		return pages;
	} else if (scene === "learn") {
		// A tall library behind a small reading table, all in one narrow corner.
		block(g, -36, -27, 36, -24, 3, span, 2);
		for (const x of [-37, 34]) block(g, x, -27, x + 3, 0, 0, span, 1);
		block(g, -38, -28, 38, 1, span - 3, span + 1, 1.5);
		block(g, -38, -28, 38, 1, 0, 5, 1.5);
		const bottom = Math.min(85, span * 0.34);
		const step = (span - bottom - 8) / 5;
		const rows = Array.from({ length: 5 }, (_, i) => {
			const floor = bottom + i * step;
			block(g, -34, -25, 34, 0, floor - 3, floor, 1);
			return {
				z: floor - 4,
				offset: 0,
				accent: null,
				hitZ: step * 0.4,
				book: { shelf: true, height: Math.min(43, step - 7) },
			};
		});
		rows.push({
			z: -4,
			offset: 0,
			accent: null,
			hitZ: 55,
			book: { open: true },
		});
		return rows;
	} else if (scene === "ideas") {
		// A single workshop wall rises behind a compact drafting bench.
		block(g, -37, -26, 37, -23, 87, span, 2);
		for (let h = 95; h < span - 6; h += 12) {
			for (let x = -29; x <= 30; x += 12) {
				mk(
					"path",
					{
						class: "nf lo",
						d: open([P(x - 0.6, -22.8, h), P(x + 0.6, -22.8, h)]),
					},
					g,
				);
			}
		}
		block(g, -38, -26, 38, -22, span - 3, span + 1, 1.5);
		block(g, -36, -24, 36, 1, 86, 90, 1.5);
		return [span - 48, (span + 90) / 2 - 15, 90, 0].map((height, i) => ({
			z: height - 4,
			offset: 0,
			accent: null,
			hitZ: i === 3 ? 42 : 18,
		}));
	} else if (scene === "curated") {
		const caseHeight = span - 30;
		// One rounded display cabinet: a solid back, glazed sides and recessed bays.
		block(g, -45, -27, 45, -24, 0, caseHeight, 3);
		block(g, -49, -30, 49, 35, 0, 5, 4);
		block(g, -49, -30, 49, 35, caseHeight - 3, caseHeight + 2, 4);
		for (const x of [-45, 45]) {
			mk(
				"path",
				{
					class: "nf lo",
					d: open([
						P(x, -25, 1),
						P(x, 32, 1),
						P(x, 32, caseHeight - 2),
						P(x, -25, caseHeight - 2),
					]),
				},
				g,
			);
		}
		const floors = [caseHeight * 0.76, caseHeight * 0.4, 8];
		const exhibits = floors.map((z, i) => {
			block(g, -43, -24, 43, 32, z - 3, z, 3);
			return {
				z: z - 4,
				offset: 0,
				accent: null,
				hitZ: i === 0 ? 8.3 : i === 1 ? 22 : 28,
			};
		});
		exhibits.push({ z: caseHeight - 2, offset: 0, accent: null, hitZ: 15 });
		return exhibits;
	} else if (scene === "content") {
		// A time ruler and two editing tracks replace the filmstrip and display objects.
		mk(
			"path",
			{ class: "nf lo", d: open([P(-44, -18, 0), P(-44, -18, span)]) },
			g,
		);
		for (let i = 0; i <= Math.floor(span / 16); i++) {
			const z = i * 16;
			mk(
				"path",
				{
					class: "nf lo",
					d: open([P(-44, -18, z), P(i % 4 === 0 ? -34 : -39, -18, z)]),
				},
				g,
			);
		}
		for (const x of [-25, 25])
			mk(
				"path",
				{ class: "nf dash lo", d: open([P(x, -18, 0), P(x, -18, span)]) },
				g,
			);
		const step = (span - 12) / 8;
		return Array.from({ length: 8 }, (_, i) => {
			const h = step * [0.72, 0.84, 0.65, 0.78][i % 4];
			return {
				z: span - 8 - i * step - h - 4,
				offset: i % 2 === 0 ? -10 : 13,
				accent: null,
				hitZ: 4 + h / 2,
				clip: {
					height: h,
					width: i % 3 === 0 ? 24 : 21,
					type: ["video", "audio", "article"][i % 3],
				},
			};
		});
	} else if (scene === "glossary") {
		// A tall card-index cabinet, with many small drawers and actual pulls.
		const top = span - 53;
		block(g, -29, -20, 29, 20, 0, top, 3);
		const count = Math.max(4, Math.min(10, Math.round(top / 36))),
			step = top / count;
		for (let i = 0; i < count; i++) {
			const z = i * step;
			block(g, -26, 20, 26, 23, z + 2, z + step - 2, 2);
			block(g, -7, 23, 7, 26, z + step * 0.5 - 1, z + step * 0.5 + 1, 1);
		}
	}
	return levels.map((z, i) => ({
		z,
		offset: offsets[i],
		accent: null,
	}));
}

/** The front posts sit in front of the exhibits, rather than showing through them. */
export function drawPortraitForeground({ scene, span, g, block }) {
	if (scene !== "curated") return;
	for (const x of [-45, 45])
		block(g, x - 1.5, 30, x + 1.5, 33, 1, span - 32, 1.3);
}

/** The editing cursor runs independently from the selected clip's spring. */
export function createPortraitCursor({ scene, span, P, g }) {
	if (scene !== "content") return null;
	const { mk, open, place, spring, stepS } = HL;
	const group = mk("g", { "data-content-playhead": "" }, g);
	const path = mk("path", { class: "nf sil" }, group);
	const handle = mk("circle", { r: 2.2, class: "dot m" }, group);
	const position = spring(span / 2);
	let last = NaN;
	return {
		update(dt, now, still, selected) {
			position.t =
				selected ??
				(still
					? span / 2
					: 12 + ((span - 24) * (Math.sin(now / 4500) + 1)) / 2);
			const moving = stepS(position, dt);
			if (position.x !== last) {
				last = position.x;
				path.setAttribute("d", open([P(-45, -6, last), P(43, -6, last)]));
				place(handle, P(-45, -6, last));
			}
			return moving;
		},
	};
}
