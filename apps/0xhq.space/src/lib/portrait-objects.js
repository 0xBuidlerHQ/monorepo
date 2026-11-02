import { hairlineCore as HL } from "./hairline-drawings";

/** The page-specific objects placed on the common portrait frame. */
export function drawPortraitObjects(
	scene,
	{ tier, amount, z, part, form, line, foreground, P, front },
) {
	const { circ, hull, poly, ringAt, run, open } = HL;
	const circle = (x, y, r) =>
		circ(r, 64).map((q) => ({ ...q, u: q.u + x, v: q.v + y }));
	const disk = (x, y, r, lo, hi, Q = P) =>
		form(circle(x, y, r), circle(x, y, r - 0.7), lo, hi, Q);
	const taper = (x, y, r0, r1, lo, hi, Q = P) => {
		const foot = circle(x, y, r0),
			top = circle(x, y, r1),
			inner = circle(x, y, r1 - 0.7);
		form(null, null, lo, hi, Q, {
			sil: poly(hull(ringAt(Q, foot, lo).concat(ringAt(Q, top, hi)))),
			crease: open(ringAt(Q, run(inner, front), hi)),
		});
	};
	if (scene === "glossary") {
		if (tier.i === 1) return false;
		if (tier.i === 0) {
			// Tabbed reference cards: the middle divider rises from the file.
			part(-35, -24, 35, 24, z, z + 3, 3);
			for (let i = 0; i < 4; i++) {
				const y = -16 + i * 10;
				const lift = amount * (i === 1 ? 8 : 2);
				const a = -0.12 + i * 0.025;
				const Q = (u, v, d) =>
					P(u, y + v * Math.sin(a) + d, z + 4 + v * Math.cos(a) + lift);
				part(-29, 0, 29, 32, 0, 0.8, 2, Q);
				const x = -25 + i * 13;
				part(x, 30, x + 11, 37, 0, 0.8, 1.5, Q);
			}
		} else {
			// Two shallow drawers and their real handles make a compact card index.
			part(-33, -23, 33, 23, z, z + 42, 3);
			for (let i = 0; i < 2; i++) {
				const base = z + 4 + i * 19;
				const pull = 0.8 + amount * (i === 1 ? 10 : 3);
				part(-30, 23, 30, 24 + pull, base, base + 15, 1.5);
				part(-30, 24 + pull, 30, 26 + pull, base, base + 16, 2);
				part(-9, 26 + pull, 9, 29 + pull, base + 7, base + 9.5, 1);
			}
		}
		return true;
	}
	if (scene === "sketchbook") {
		if (tier.i < 4) {
			const h = tier.clip.height;
			const page = (u, v, d) =>
				P(
					u + Math.sin((z + v) / 70) * 2,
					-13 + d + Math.sin((v / h) * Math.PI) * amount * 3,
					z + v,
				);
			part(-23, 0, 23, h, 0, 0.6, 0.6, page);
			// Typewritten passages vary in length, with generous pauses between paragraphs.
			const rows = Math.max(5, Math.floor(h / 6));
			for (let j = 1; j < rows; j++) {
				if (j % 6 === 0) continue;
				const v = j * (h / rows);
				const length = 20 + ((j * 7 + tier.i * 11) % 18);
				line(open([page(-18, v, 0.7), page(-18 + length, v, 0.7)]));
				if (j % 7 === 3) {
					line(
						open([page(-19, v - 0.8, 0.8), page(-15 + length, v + 0.8, 0.8)]),
					);
					line(
						open([
							page(20, v - 2, 0.8),
							page(24, v, 0.8),
							page(20, v + 2, 0.8),
						]),
					);
				}
			}
			// Perforated margins make it one unfolding manuscript rather than loose cards.
			for (let v = 3; v < h; v += 8)
				for (const x of [-21, 21])
					line(open([page(x, v, 0.7), page(x, v + 1.2, 0.7)]));
			// A clipped revision sits beside each passage, alternating between margins.
			const side = tier.i % 2 ? -1 : 1;
			const note = (u, v, d) => page(side * 29 + u, h * 0.4 + v, d + 1);
			part(-8, -8, 8, 9, 0, 0.6, 0.8, note);
			for (let j = 0; j < 3; j++)
				line(open([note(-5, -3 + j * 3, 0.7), note(4 - j, -3 + j * 3, 0.7)]));
			part(-1.5, 6, 1.5, 11, 0.6, 1.5, 0.7, note);
		} else {
			// A compact writing desk with a shallow drawer and tapered, rounded legs.
			for (const x of [-37, 33])
				for (const y of [-9, 23]) part(x, y, x + 2.5, y + 2.5, 0, 46, 0.7);
			part(-40, -13, 39, 30, 44, 48, 2.5);
			part(-32, 9, 29, 24, 34, 43, 1.5);
			part(-31, 24, 28, 26, 35, 42, 1);
			part(-7, 26, 5, 28, 37, 39, 0.8);
			// Typewriter body, sloping keyboard, round keycaps, carriage and platen.
			part(-25, -8, 25, 21, 48, 54, 3);
			const keyboard = (x, y, h) => P(x, y, h + (18 - y) * 0.2);
			part(-23, 1, 23, 19, 54, 56, 1.5, keyboard);
			for (let row = 0; row < 3; row++)
				for (let col = 0; col < 10; col++)
					disk(
						-19 + col * 4.1 + (row % 2) * 0.6,
						4 + row * 4.5,
						1.35,
						56,
						57,
						keyboard,
					);
			part(-13, 18, 13, 20, 55, 57, 0.8);
			part(-24, -8, 24, 0, 54, 66, 2);
			const roller = (u, v, d) => P(d, -6 + u, 69 + v);
			disk(0, 0, 3, -26, 26, roller);
			disk(0, 0, 4.2, -29, -26, roller);
			disk(0, 0, 4.2, 26, 29, roller);
			part(-23, -13, 23, -11.5, 65, 77, 0.8);
			line(open([P(-28, -4, 71), P(-32, -4, 74), P(-32, 4, 74)]));
			// A ribbon spool and guide sit above the keyboard.
			for (const x of [-13, 13]) disk(x, -3, 4, 65, 66);
			line(open([P(-9, -3, 66.2), P(0, -5, 67), P(9, -3, 66.2)]));
			// Unsent envelope on a slightly untidy pile of drafts, beside the machine.
			for (let j = 0; j < 3; j++)
				part(
					-38 + j * 0.7,
					-1 + j,
					-27 + j * 0.7,
					22 + j,
					48 + j * 0.6,
					48.5 + j * 0.6,
					0.5,
				);
			line(open([P(-36, 3, 50), P(-31, 11, 50), P(-27, 3, 50)]));
			// Capped ink bottle and a pen stand on the opposite side.
			part(29, 0, 36, 8, 48, 55, 1.3);
			part(30, 1, 35, 7, 55, 58, 0.8);
			part(30, 11, 31.4, 25, 48.2, 49.5, 0.5);
			// A wire wastebasket collects faceted crumpled drafts on the floor.
			const basket = (x, y, h) => P(x + 27, y + 39, h);
			taper(0, 0, 7, 9, 0, 19, basket);
			line(poly(circle(0, 0, 9).map((q) => basket(q.u, q.v, 19))));
			for (let j = 0; j < 8; j++) {
				const a = (j / 8) * Math.PI * 2;
				line(
					open([
						basket(Math.cos(a) * 7, Math.sin(a) * 7, 1),
						basket(Math.cos(a) * 9, Math.sin(a) * 9, 19),
					]),
				);
			}
			for (const [x, y, h] of [
				[-3, 0, 19],
				[3, -2, 21],
				[0, 4, 20],
			]) {
				const pts = [
					[-3, -2, 0],
					[0, -4, 1],
					[3, -1, 0],
					[2, 3, 2],
					[-2, 3, 3],
					[0, 0, 5],
				].map(([u, v, d]) => basket(x + u, y + v, h + d));
				form(null, null, 0, 0, basket, {
					sil: poly(hull(pts)),
					crease: open([pts[0], pts[5], pts[3], pts[1]]),
				});
			}
		}
		return true;
	}
	if (scene === "learn") {
		const book = tier.book;
		if (book.shelf) {
			// Upright volumes have varied heights, visible spines and quiet binding bands.
			let x = -31;
			for (let i = 0; i < 9; i++) {
				const width = [5, 7, 6, 8, 5][(i + tier.i) % 5];
				const height = book.height * [0.88, 1, 0.76, 0.94][(i + tier.i) % 4];
				const pull = i === (tier.i + 3) % 9 ? amount * 6 : 0;
				const B = (u, v, h) => P(u, v + pull, h);
				part(x, -22, x + width - 0.8, -2, z, z + height, 0.7, B);
				for (const h of [3, height - 4])
					line(
						open([B(x + 0.8, -1.8, z + h), B(x + width - 1.6, -1.8, z + h)]),
					);
				if (i % 3 === 1)
					part(
						x + 1,
						-2,
						x + width - 1.8,
						-1.6,
						z + height * 0.45,
						z + height * 0.66,
						0.4,
						B,
					);
				x += width;
			}
		} else {
			// A little table sits in front of the shelves; the chair tucks beside it.
			const T = (x, y, h) => P(x, y + 18, h);
			for (const x of [-29, 9])
				for (const y of [3, 29]) part(x, y, x + 2.5, y + 2.5, 0, 47, 0.7, T);
			part(-33, -1, 16, 34, 45, 49, 3, T);
			// Three books form a slightly uneven pile on the tabletop.
			for (let i = 0; i < 3; i++) {
				const B = (x, y, h) => T(x - 13 + (i % 2) * 2, y + 11, h);
				const h = 49 + i * 4;
				part(-13, -9, 13, 9, h, h + 0.8, 1, B);
				part(-12, -8, 12, 8, h + 0.8, h + 3.2, 0.7, B);
				part(-13, -9, 13, 9, h + 3.2, h + 4, 1, B);
				line(open([B(-10, 8.1, h + 2), B(10, 8.1, h + 2)]));
			}
			// The glasses float over the book pile, rising gently with the pointer.
			// Short rounded tubes keep the lens openings empty rather than filling them.
			const G = (x, y, h) => {
				const angle = 0.18;
				return T(
					-12 + x * Math.cos(angle) - y * Math.sin(angle),
					10 + x * Math.sin(angle) + y * Math.cos(angle),
					76 + h + amount * 3,
				);
			};
			const tube = (points, radius = 0.32) => {
				for (let i = 1; i < points.length; i++) {
					const surface = [];
					for (const [x, y, h] of [points[i - 1], points[i]]) {
						for (let j = 0; j < 12; j++) {
							const a = (j / 12) * Math.PI * 2;
							const c = Math.cos(a) * radius,
								s = Math.sin(a) * radius;
							surface.push(
								G(x + c, y + s, h),
								G(x + c, y, h + s),
								G(x, y + c, h + s),
							);
						}
					}
					form(null, null, 0, 0, T, { sil: poly(hull(surface)), crease: "" });
				}
			};
			// Open temples are roughly twice a lens width, with curved ear tips.
			// Draw them behind the upright frame front for an unmistakable three-quarter view.
			for (const side of [-1, 1]) {
				tube(
					[
						[side * 12.3, 10, 2.5],
						[side * 13, 7, 2.5],
						[side * 13, -8, 2],
						[side * 12.8, -12, 1.5],
						[side * 12, -15, 0],
						[side * 10.8, -16, -1.5],
					],
					0.42,
				);
				part(
					side * 12.3 - 0.65,
					8.5,
					side * 12.3 + 0.65,
					10.5,
					1.7,
					3.1,
					0.4,
					G,
				);
			}
			// Rounded acetate rims stand in the vertical plane; the lenses remain open.
			for (const x of [-6.7, 6.7]) {
				const lens = (u, v, depth) => G(x + u, 10 + depth, v);
				const outer = HL.rrect(-5.6, -4.1, 5.6, 4.1, 2.1, 8);
				const inner = HL.rrect(-4.75, -3.25, 4.75, 3.25, 1.5, 8);
				const project = (ring, d) => ring.map((q) => lens(q.u, q.v, d));
				form(null, null, 0, 0, G, {
					sil: poly(project(outer, 0.6)) + poly(project(inner, 0.6).reverse()),
					crease: poly(project(outer, -0.5)),
				});
			}
			// A short arched bridge joins the inner rims above the nose opening.
			tube(
				[
					[-1.5, 10.3, 1.5],
					[-0.8, 10.3, 2.2],
					[0, 10.3, 2.5],
					[0.8, 10.3, 2.2],
					[1.5, 10.3, 1.5],
				],
				0.4,
			);
			for (const side of [-1, 1]) {
				const pad = (u, v, d) => G(side * 1.8 + u, 9 + d, -0.8 + v);
				part(-0.45, -1.1, 0.45, 1.1, 0, 0.6, 0.4, pad);
			}
			// A simple wooden chair: four legs, seat, tall posts and two back slats.
			for (const x of [22, 38])
				for (const y of [14, 30])
					part(x, y, x + 2, y + 2, 0, y === 14 ? 47 : 25, 0.7, T);
			part(20, 12, 42, 34, 23, 26, 2, T);
			for (const h of [35, 43]) part(22, 14, 40, 16, h, h + 3.5, 1, T);
		}
		return true;
	}
	if (scene === "ideas") {
		const wall = (u, v, d) => P(u, -20 + d + amount * 2, z + v);
		if (tier.i === 0) {
			// Two pinned design studies: an exploded object and its alternate silhouette.
			for (const x of [-17, 16]) {
				const sheet = (u, v, d) => wall(x + u, v, d);
				part(-13, 0, 13, 35, 0, 0.6, 1, sheet);
				disk(0, 32, 1.2, 0.6, 1.6, sheet);
				for (let j = 0; j < 3; j++) {
					const v = 8 + j * 7;
					line(
						poly([
							sheet(-7, v, 0.7),
							sheet(0, v + 3, 0.7),
							sheet(7, v, 0.7),
							sheet(0, v - 3, 0.7),
						]),
					);
				}
				line(open([sheet(-8, 4, 0.7), sheet(5, 4, 0.7)]));
				// Tape tabs, dimension marks and a small folded corner on each study.
				part(-11, 31, -6, 37, 0.6, 0.9, 0.4, sheet);
				line(open([sheet(7, 0, 0.8), sheet(7, 5, 0.8), sheet(13, 5, 0.8)]));
				line(open([sheet(-9, 27, 0.8), sheet(9, 27, 0.8)]));
				for (const u of [-9, 9])
					line(open([sheet(u, 25, 0.8), sheet(u, 29, 0.8)]));
			}
			// Overlapping revision cards hang below the large studies.
			for (let j = 0; j < 3; j++) {
				const a = (j - 1) * 0.09;
				const card = (u, v, d) =>
					wall(
						-22 + j * 5 + u * Math.cos(a) - v * Math.sin(a),
						-22 + j * 2 + u * Math.sin(a) + v * Math.cos(a),
						d + 0.8 + j * 0.5,
					);
				part(-9, -8, 9, 8, 0, 0.5, 0.7, card);
				for (let k = 0; k < 3; k++)
					line(open([card(-6, -3 + k * 3, 0.6), card(5 - k, -3 + k * 3, 0.6)]));
				part(-1, 6, 1, 10, 0.5, 1.2, 0.5, card);
			}
			// A wire mockup hangs next to its paper iterations: two hoops joined by ribs.
			const frontRing = circle(20, -20, 9).map((q) => wall(q.u, q.v, 5));
			const backRing = circle(18, -17, 7).map((q) => wall(q.u, q.v, 1));
			line(poly(backRing));
			line(poly(frontRing));
			for (const j of [0, 16, 32, 48]) line(open([backRing[j], frontRing[j]]));
			line(open([wall(18, -10, 1), wall(18, -6, 1), wall(21, -6, 1)]));
		} else if (tier.i === 1) {
			// Hanging tools: a marked ruler, scissors with real finger loops, two pencils.
			part(-27, 0, -21, 29, 0, 1.2, 0.8, wall);
			for (let j = 0; j < 10; j++)
				line(
					open([
						wall(-21, 2 + j * 2.5, 1.3),
						wall(j % 3 ? -23 : -25, 2 + j * 2.5, 1.3),
					]),
				);
			for (const x of [-7, 3]) {
				form(null, null, 0, 0, wall, {
					sil:
						poly(circle(x, 6, 4).map((q) => wall(q.u, q.v, 1.1))) +
						poly(
							circle(x, 6, 2.5)
								.reverse()
								.map((q) => wall(q.u, q.v, 1.1)),
						),
					crease: "",
				});
			}
			line(
				open([wall(-7, 10, 1), wall(5, 29, 1), wall(0, 12, 1), wall(3, 10, 1)]),
			);
			line(
				open([
					wall(3, 10, 1),
					wall(-9, 29, 1),
					wall(-4, 12, 1),
					wall(-7, 10, 1),
				]),
			);
			disk(-2, 14, 1, 1, 1.7, wall);
			for (const x of [18, 25]) {
				part(x, 4, x + 2, 28, 0, 1.5, 0.6, wall);
				line(open([wall(x, 4, 1.5), wall(x + 1, 0, 1.5), wall(x + 2, 4, 1.5)]));
			}
			// A fan of material samples is bound by a small metal ring.
			for (let j = 0; j < 4; j++) {
				const a = (j - 1.5) * 0.18;
				const swatch = (u, v, d) =>
					wall(
						-23 + u * Math.cos(a) - v * Math.sin(a),
						-9 + u * Math.sin(a) + v * Math.cos(a),
						d + 1 + j * 0.45,
					);
				part(-4.5, -19, 4.5, 0, 0, 0.7, 0.8, swatch);
				for (let k = 0; k < 3; k++)
					line(
						open([
							swatch(-3, -6 - k * 4, 0.8),
							swatch(3, -6 - k * 4 + (j % 2), 0.8),
						]),
					);
			}
			line(poly(circle(-23, -9, 2).map((q) => wall(q.u, q.v, 4))));
			// A hollow set square and its engraved graduations hang on the next hook.
			const square = [
				[4, -30],
				[30, -30],
				[4, -6],
			];
			const hole = [
				[8, -25],
				[20, -25],
				[8, -14],
			];
			form(null, null, 0, 0, wall, {
				sil:
					poly(square.map(([u, v]) => wall(u, v, 1.6))) +
					poly(hole.reverse().map(([u, v]) => wall(u, v, 1.6))),
				crease: open([wall(4, -6, 0.5), wall(4, -30, 0.5), wall(30, -30, 0.5)]),
			});
			for (let j = 0; j < 8; j++)
				line(
					open([
						wall(7 + j * 2.5, -30, 1.7),
						wall(7 + j * 2.5, j % 3 ? -28.5 : -27.5, 1.7),
					]),
				);
		} else if (tier.i === 2) {
			// Physical mockups sit on the shallow shelf, directly below their studies.
			const M = (x, y, h) => P(x, y + amount * 2, h);
			part(-29, -18, -3, -2, z, z + 2, 1, M);
			part(-25, -15, -16, -5, z + 2, z + 24, 1, M);
			part(-14, -15, -6, -5, z + 2, z + 15, 1, M);
			for (let j = 0; j < 3; j++)
				line(open([M(-24, -4.8, z + 6 + j * 6), M(-17, -4.8, z + 6 + j * 6)]));
			part(7, -17, 28, -3, z, z + 2, 1, M);
			part(10, -14, 25, -6, z + 2, z + 10, 2, M);
			part(13, -12, 22, -8, z + 10, z + 16, 1, M);
			// Swatches of wood, card and sheet material sit at the front of the shelf.
			for (let j = 0; j < 4; j++) {
				part(
					-30 + j * 0.8,
					-2 + j * 0.5,
					-17 + j * 0.8,
					6 + j * 0.5,
					z + j * 1.2,
					z + 1 + j * 1.2,
					0.5,
					M,
				);
				line(
					open([
						M(-28 + j * 0.8, 4 + j * 0.5, z + 1.1 + j * 1.2),
						M(-20 + j * 0.8, 4 + j * 0.5, z + 1.1 + j * 1.2),
					]),
				);
			}
			// An exploded component and two washers await the next assembly.
			part(1, -10, 4, -3, z, z + 8, 0.5, M);
			for (const x of [13, 23])
				line(poly(circle(x, 2, 2.2).map((q) => M(q.u, q.v, z + 0.5))));
		} else {
			// A drafting bench with a lower storage tray and a tucked-in round stool.
			for (const x of [-32, 28])
				for (const y of [-5, 25]) part(x, y, x + 2.5, y + 2.5, 0, 48, 0.7);
			part(-35, -8, 34, 30, 46, 50, 2.5);
			part(-30, -5, 29, 26, 13, 16, 1.5);
			for (let j = 0; j < 3; j++)
				part(-25 + j * 14, 0, -14 + j * 14, 19, 16, 23, 1.2);
			// A cutting mat and layered paper explain what this workspace is for.
			part(-29, -3, 13, 25, 50, 50.5, 1);
			for (let j = 0; j < 5; j++)
				line(open([P(-25 + j * 8, -1, 50.6), P(-25 + j * 8, 23, 50.6)]));
			for (let j = 0; j < 4; j++)
				line(open([P(-27, 1 + j * 7, 50.6), P(11, 1 + j * 7, 50.6)]));
			const paper = (x, y, h) => P(x - 5, y + 9, h + amount * 1.5);
			part(-13, -8, 13, 8, 50.7, 51.1, 0.6, paper);
			part(-11, -6, 15, 10, 51.1, 51.5, 0.6, paper);
			line(
				poly([
					paper(-6, 0, 51.6),
					paper(1, -3, 51.6),
					paper(9, 0, 51.6),
					paper(2, 4, 51.6),
				]),
			);
			part(19, -1, 27, 7, 50, 60, 1.3);
			for (const x of [20, 23, 26])
				part(x, 2, x + 0.9, 3, 58, 71 - (x % 3) * 2, 0.4);
			// A jointed task lamp lights the cutting mat from the back-left corner.
			disk(-27, -1, 5, 50, 52);
			part(-28, -2, -26, 0, 52, 67, 0.6);
			const arm = (u, v, h) => P(-27 + (h - 66) * 0.85 + u, -1 + v, h);
			part(-0.7, -0.7, 0.7, 0.7, 66, 78, 0.5, arm);
			disk(-27, -1, 2, 65, 67);
			taper(-16.8, -1, 5, 2.5, 75, 80);
			// Measuring calipers lie beside the paper, with their jaws slightly open.
			part(17, 12, 30, 13.5, 50, 51, 0.4);
			part(18, 12, 19.5, 22, 50, 51.5, 0.4);
			part(25, 11, 27, 22, 50, 52, 0.4);
			for (let j = 0; j < 5; j++)
				line(open([P(20 + j * 2, 12, 51.1), P(20 + j * 2, 13, 51.1)]));
			// Hollow masking-tape roll and a loose strip at the front of the mat.
			const tapeRing = circle(-24, 23, 3.5),
				tapeHole = circle(-24, 23, 2);
			form(null, null, 0, 0, P, {
				sil:
					poly(tapeRing.map((q) => P(q.u, q.v, 53))) +
					poly(tapeHole.reverse().map((q) => P(q.u, q.v, 53))),
				crease: open([P(-27.5, 23, 50.5), P(-27.5, 23, 53)]),
			});
			part(-22, 22, -15, 24, 50.7, 51, 0.4);
			for (const [x, y] of [
				[12, 35],
				[28, 35],
				[20, 46],
			])
				part(x, y, x + 2, y + 2, 0, 27, 0.7);
			disk(21, 39, 12, 26, 29);
		}
		return true;
	}
	if (scene === "curated") {
		const a = (amount - 0.12) * 0.07;
		const Q = (x, y, v) =>
			P(
				x * Math.cos(a) - y * Math.sin(a),
				x * Math.sin(a) + y * Math.cos(a) + amount * 4,
				v,
			);
		if (tier.i === 0) {
			// A closed laptop sits on the board; the phone rests on its lid.
			part(-36, -24, 36, 24, z, z + 1.5, 3, Q);
			part(-36, -24, 36, 24, z + 1.5, z + 2.8, 3, Q);
			part(-27, -24, 27, -22.8, z + 1.2, z + 2.3, 0.6, Q);
			line(
				open([
					Q(-5, 24, z + 1.6),
					Q(-4, 23.4, z + 1.1),
					Q(4, 23.4, z + 1.1),
					Q(5, 24, z + 1.6),
				]),
			);
			const device = (u, v, d) => Q(u, -v * 0.85, z + 2.8 + d);
			part(-14, -24, 14, 24, 0, 3, 3.5, device);
			part(-11, 0, 11, 20, 3, 3.3, 2, device);
			part(-9, 2, 9, 18, 3.3, 3.5, 1.2, device);
			part(-10, -13, -2, -10, 3, 4, 0.7, device);
			part(-7.5, -15.5, -4.5, -7.5, 3, 4, 0.7, device);
			disk(5, -12, 2, 3, 4, device);
			disk(10, -8, 2, 3, 4, device);
			for (let i = 0; i < 3; i++)
				part(2 + i * 3, -20, 3 + i * 3, -17, 3, 3.3, 0.4, device);
			// Three trading cards fan gently across the free side of the laptop.
			for (let i = 0; i < 3; i++) {
				const angle = (i - 1) * 0.16;
				const card = (u, v, h) =>
					Q(
						-26 + i * 2 + u * Math.cos(angle) - v * Math.sin(angle),
						-3 + i * 3 + u * Math.sin(angle) + v * Math.cos(angle),
						z + 2.9 + i * 0.35 + h,
					);
				part(-6.5, -10, 6.5, 10, 0, 0.25, 0.8, card);
				if (i === 2) {
					line(
						poly([
							card(-5, -8.5, 0.3),
							card(5, -8.5, 0.3),
							card(5, 8.5, 0.3),
							card(-5, 8.5, 0.3),
						]),
					);
					// A Poké Ball motif makes the top card recognizable without lettering.
					line(poly(circle(0, 0, 3.5).map((q) => card(q.u, q.v, 0.3))));
					line(open([card(-3.5, 0, 0.3), card(3.5, 0, 0.3)]));
					disk(0, 0, 1.1, 0.3, 0.4, card);
				}
			}
		} else if (tier.i === 1) {
			const cap = (x, y, v) => Q(x - 12, y, v);
			// A cap: a broad elliptical brim, rounded crown and quiet panel seams.
			const ellipse = (rx, ry) =>
				circ(1, 64).map((q) => ({
					...q,
					u: q.u * rx,
					v: 14 + q.v * ry,
				}));
			form(ellipse(25, 17), ellipse(24, 16), z, z + 2, cap);
			const profile = [];
			for (let i = 0; i <= 16; i++) {
				const theta = ((i / 16) * Math.PI) / 2;
				profile.push(
					...ringAt(
						cap,
						circle(0, -3, Math.max(0.1, 21 * Math.cos(theta))),
						z + 3 + 21 * Math.sin(theta),
					),
				);
			}
			form(null, null, z + 3, z + 24, cap, {
				sil: poly(hull(profile)),
				crease: open(ringAt(cap, run(circle(0, -3, 20), front), z + 3.4)),
			});
			for (const azimuth of [0.35, 1.1]) {
				const seam = Array.from({ length: 20 }, (_, i) => {
					const theta = ((i / 19) * Math.PI) / 2;
					return cap(
						21 * Math.cos(theta) * Math.cos(azimuth),
						-3 + 21 * Math.cos(theta) * Math.sin(azimuth),
						z + 3 + 21 * Math.sin(theta),
					);
				});
				line(open(seam));
			}
			disk(0, -3, 2, z + 24, z + 26, cap);
			// A small die-cast car sits alongside the cap, on all four wheels.
			for (const x of [17, 32]) {
				for (const y of [-9, 9]) {
					const wheel = (u, v, d) => Q(x + d, y + u, z + 2.4 + v);
					disk(0, 0, 2.4, 0, 2, wheel);
				}
			}
			part(18, -15, 34, 15, z + 4, z + 7.5, 3, Q);
			const foot = HL.rrect(19, -10, 33, 10, 2.5, 8);
			const roof = HL.rrect(21, -5, 31, 5, 2, 8);
			const inner = HL.rrect(21.8, -4.2, 30.2, 4.2, 1.2, 8);
			form(null, null, z + 7.5, z + 13, Q, {
				sil: poly(
					hull(ringAt(Q, foot, z + 7.5).concat(ringAt(Q, roof, z + 13))),
				),
				crease: open(ringAt(Q, run(inner, front), z + 13)),
			});
			line(open([Q(20, 8, z + 8), Q(32, 8, z + 8)]));
			part(19, 14, 33, 16, z + 4.5, z + 6, 0.8, Q);
			for (const x of [20, 29])
				part(x, 15, x + 3, 15.6, z + 6, z + 7.3, 0.3, Q);
		} else if (tier.i === 3) {
			// A knitted beanie rests on the cabinet roof.
			disk(0, -1, 15, z, z + 4, Q);
			const crown = [];
			for (let i = 0; i <= 14; i++) {
				const theta = ((i / 14) * Math.PI) / 2;
				crown.push(
					...ringAt(
						Q,
						circle(0, -1, Math.max(0.15, 14 * Math.cos(theta))),
						z + 4 + 18 * Math.sin(theta),
					),
				);
			}
			form(null, null, z + 4, z + 22, Q, {
				sil: poly(hull(crown)),
				crease: open(ringAt(Q, run(circle(0, -1, 13.4), front), z + 4.4)),
			});
			line(poly(ringAt(Q, circle(0, -1, 14.9), z + 2.7)));
			for (let i = 0; i < 7; i++) {
				const azimuth = ((i / 6) * Math.PI) / 2;
				line(
					open(
						Array.from({ length: 16 }, (_, j) => {
							const theta = (j / 15) * 1.48;
							return Q(
								14 * Math.cos(theta) * Math.cos(azimuth),
								-1 + 14 * Math.cos(theta) * Math.sin(azimuth),
								z + 4 + 18 * Math.sin(theta),
							);
						}),
					),
				);
			}
		} else {
			// A PS5-style tower: a narrow core between two swept, unequal fins.
			part(-35, -18, -12, 14, z, z + 2, 3, Q);
			part(-28, -15, -21, 10, z + 2, z + 42, 2, Q);
			const leftFin = (u, v, d) =>
				Q(
					-32 + d - 3 * (v / 45) ** 2 + 1.2 * Math.sin((v / 45) * Math.PI),
					u,
					z + 2 + v,
				);
			const rightFin = (u, v, d) =>
				Q(
					-20 + d + 2.8 * (v / 42) ** 2 - 1.2 * Math.sin((v / 42) * Math.PI),
					u,
					z + 2 + v,
				);
			part(-16, 0, 12, 45, 0, 2.5, 2.5, leftFin);
			part(-16, 0, 12, 42, 0, 2.5, 2.5, rightFin);
			part(-26, 10, -24, 11, z + 5, z + 7, 0.6, Q);
			line(open([Q(-24, 10.5, z + 12), Q(-24, 10.5, z + 30)]));
			// The lamp keeps its own space on the right of the shared board.
			const lamp = (x, y, v) =>
				Q(x * 0.78 + 18, y * 0.78 + 6, z + (v - z) * 0.84);
			disk(0, 0, 15, z, z + 3, lamp);
			disk(0, 0, 3, z + 3, z + 35, lamp);
			taper(0, 0, 23, 11, z + 29, z + 49, lamp);
			disk(0, 0, 3.5, z + 49, z + 51, lamp);
			// A controller rests across the console's top, with two rounded grips.
			const controller = (u, v, h) => Q(-24 + u, -2 + v, h);
			const outline = HL.fillet(
				[
					[-12, -6],
					[-7, -8],
					[7, -8],
					[12, -6],
					[15, 6],
					[10, 9],
					[5, 3],
					[-5, 3],
					[-10, 9],
					[-15, 6],
				],
				[3, 2, 2, 3, 3, 2.5, 2, 2, 2.5, 3],
				6,
			);
			for (const h of [z + 47, z + 49.5]) {
				form(null, null, h, h, controller, {
					sil: poly(outline.map(([u, v]) => controller(u, v, h))),
					crease: "",
				});
			}
			part(-4, -5, 4, -0.5, z + 49.5, z + 49.9, 1, controller);
			part(-9, -1.8, -5, -0.2, z + 49.5, z + 50.4, 0.5, controller);
			part(-7.8, -3, -6.2, 1, z + 49.5, z + 50.4, 0.5, controller);
			for (const [u, v] of [
				[7, -3],
				[9, -1],
				[7, 1],
				[5, -1],
			]) {
				disk(u, v, 0.85, z + 49.5, z + 50.2, controller);
			}
			for (const u of [-4, 4]) disk(u, 3, 1.5, z + 49.5, z + 51, controller);
			// A broader popsicle deck, with paired trucks beneath its raised ends.
			foreground("skateboard");
			const board = (x, y, v) => Q(x - 4, y + 44, v - 7.5);
			for (const y of [-9, 7]) {
				for (const x of [-23, 23]) {
					const wheel = (u, v, d) => board(x + u, y + d, z + 3 + v);
					disk(0, 0, 3, 0, 2.8, wheel);
				}
			}
			for (const x of [-23, 23]) {
				part(x - 1.7, -7, x + 1.7, 8.6, z + 4.8, z + 6.2, 1, board);
				part(x - 3, -4, x + 3, 4, z + 5.6, z + 6.2, 1.2, board);
			}
			const deck = (x, y, v) =>
				board(
					x,
					y,
					v +
						Math.max(0, Math.abs(x) - 31) ** 2 * 0.03 +
						(y / 10.8) ** 2 * 0.35,
				);
			part(-43, -10.8, 43, 10.8, z + 6.2, z + 7.6, 10.6, deck);
			part(-41.4, -9.3, 41.4, 9.3, z + 7.6, z + 7.8, 9.2, deck);
			for (const truck of [-23, 23]) {
				for (const x of [truck - 2, truck + 2]) {
					for (const y of [-4, 4]) disk(x, y, 0.8, z + 7.8, z + 8, deck);
				}
			}
		}
		return true;
	}
	if (scene === "content") {
		const { height: h, width: w, type } = tier.clip;
		const Q = (u, v, d) => P(u, -11 + d + amount * 3, z + v);
		part(-w, 0, w, h, 0, 1.1, 3, Q);
		// Small end grips are real clip handles, outside the media preview.
		for (const x of [-w + 2, w - 3])
			part(x, 4, x + 1, h - 4, 1.1, 1.35, 0.4, Q);
		if (type === "audio") {
			const middle = h / 2;
			for (let i = 0; i < 11; i++) {
				const x = -16 + i * 3.2;
				const amplitude =
					(3 + Math.abs(Math.sin(i * 1.9 + tier.i)) * h * 0.23) *
					(0.65 + amount * 0.35);
				line(
					open([Q(x, middle - amplitude, 1.3), Q(x, middle + amplitude, 1.3)]),
				);
			}
		} else if (type === "video") {
			const gap = 3,
				frameHeight = (h - 15) / 2;
			for (let i = 0; i < 2; i++) {
				const v = 6 + i * (frameHeight + gap);
				part(-w + 6, v, w - 6, v + frameHeight, 1.1, 1.35, 1.3, Q);
				const shift = amount * 3;
				line(
					open([
						Q(-w + 9, v + 4, 1.5),
						Q(-5 + shift, v + frameHeight - 5, 1.5),
						Q(4 + shift, v + frameHeight * 0.45, 1.5),
						Q(w - 9, v + frameHeight - 3, 1.5),
					]),
				);
			}
		} else {
			const lengths = [w - 8, w - 13, w - 10, w - 17];
			lengths.forEach((end, i) => {
				const v = h - 9 - (i * (h - 18)) / 4;
				line(open([Q(-w + 8, v, 1.4), Q(end, v, 1.4)]));
			});
		}
		// Equipment follows the vertical edit, like objects pinned beside a work in progress.
		// Alternating sides keeps each station narrow rather than building a wide desk.
		const side = tier.i % 2 === 0 ? 35 : -35;
		const S = (u, v, d) => Q(side + u, h / 2 + v, d + 2);
		if (tier.i === 0) {
			// Preview monitor, raised bezel, foot and tiny transport controls.
			part(-10, -5, 10, 9, 0, 2, 1.5, S);
			part(-8, -3, 8, 7, 2, 2.3, 0.7, S);
			part(-1, -9, 1, -5, 0, 1, 0.5, S);
			part(-6, -10, 6, -9, 0, 1.5, 0.5, S);
			line(open([S(-6, -1, 2.4), S(-1, 4, 2.4), S(2, 1, 2.4), S(6, 5, 2.4)]));
		} else if (tier.i === 1) {
			// Suspended microphone in a shock mount, with a short cable.
			part(-3.5, -3, 3.5, 9, 0, 3, 3, S);
			for (let j = 0; j < 4; j++)
				line(open([S(-2, j * 2, 3.1), S(2, j * 2, 3.1)]));
			line(open([S(-6, 4, 1), S(-6, -5, 1), S(6, -5, 1), S(6, 4, 1)]));
			line(open([S(0, -5, 1), S(0, -9, 1), S(7, -9, 1), S(9, -12, 1)]));
		} else if (tier.i === 2) {
			// A spiral notebook with a pencil tucked against its edge.
			part(-8, -10, 8, 10, 0, 1.2, 1, S);
			for (let j = 0; j < 5; j++) {
				line(open([S(-9, -7 + j * 3.5, 1.3), S(-6, -7 + j * 3.5, 1.3)]));
				line(open([S(-4, -6 + j * 3, 1.3), S(j % 2 ? 3 : 6, -6 + j * 3, 1.3)]));
			}
			part(10, -8, 11.5, 8, 0, 1, 0.5, S);
			line(open([S(10, -8, 1), S(10.75, -11, 1), S(11.5, -8, 1)]));
		} else if (tier.i === 3) {
			// Compact camera: lens rings, viewfinder, shutter and hanging strap.
			part(-10, -6, 10, 6, 0, 4, 1.8, S);
			part(-6, 6, 1, 9, 0, 3, 1, S);
			disk(1, 0, 5, 4, 7, S);
			disk(1, 0, 3.3, 7, 7.5, S);
			part(5, 6, 8, 7.5, 0, 2, 0.7, S);
			line(open([S(-10, 1, 1), S(-13, -5, 1), S(-11, -11, 1), S(-4, -12, 1)]));
		} else if (tier.i === 4) {
			// Over-ear headphones with a doubled headband and padded cups.
			for (const r of [8, 10])
				line(
					open(
						Array.from({ length: 25 }, (_, j) => {
							const t = (j / 24) * Math.PI;
							return S(Math.cos(t) * r, Math.sin(t) * r - 1, 1);
						}),
					),
				);
			for (const x of [-9, 9]) part(x - 2, -7, x + 2, 1, 0, 3, 1.8, S);
			line(open([S(9, -7, 1), S(10, -11, 1), S(5, -12, 1)]));
		} else if (tier.i === 5) {
			// A small editing keypad, with jog wheel and six mechanical keys.
			part(-10, -8, 10, 8, 0, 2, 1.5, S);
			disk(-4, 1, 3.5, 2, 3, S);
			for (let j = 0; j < 6; j++) {
				const x = 2 + (j % 2) * 3.5,
					y = -4 + Math.floor(j / 2) * 4;
				part(x, y, x + 2.5, y + 2.5, 2, 3, 0.5, S);
			}
		} else if (tier.i === 6) {
			// External drive and two memory cards, ready to ingest the next shoot.
			part(-8, -9, 5, 9, 0, 2, 1.5, S);
			part(-6, -7, 3, -5.5, 2, 2.2, 0.5, S);
			for (let j = 0; j < 2; j++) {
				part(7, -7 + j * 9, 12, j * 9, 0, 0.8, 0.7, S);
				for (let k = 0; k < 3; k++)
					line(open([S(8 + k, -5 + j * 9, 0.9), S(8 + k, -3 + j * 9, 0.9)]));
			}
			line(open([S(-1, -9, 1), S(-1, -12, 1), S(6, -12, 1)]));
		} else {
			// A takeaway coffee and a small stack of marked-up index cards.
			part(-10, -8, 2, 5, 0, 0.8, 0.7, S);
			part(-9, -6, 3, 7, 0.8, 1.5, 0.7, S);
			for (let j = 0; j < 3; j++)
				line(open([S(-7, -3 + j * 3, 1.6), S(0, -3 + j * 3, 1.6)]));
			part(5, -5, 12, 4, 0, 4, 2, S);
			part(4, 3, 13, 5, 0, 4.5, 1, S);
			line(open([S(6, -1, 4.1), S(11, -1, 4.1)]));
		}
		return true;
	}

	return false;
}
