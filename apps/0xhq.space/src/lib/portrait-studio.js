import { hairlineCore as HL } from "./hairline-drawings";
import {
	createPortraitCursor,
	drawPortraitForeground,
	drawPortraitFrame,
} from "./portrait-frame";
import { drawPortraitObjects } from "./portrait-objects";

/** A studio or library composed for the available height of the side column. */
export function mountPortraitStudio(stage, height, scene = "workbench") {
	const motionPreference = window.matchMedia(
		"(prefers-reduced-motion: reduce)",
	);
	HL.setReducedMotion(motionPreference.matches);
	const {
		Cam,
		facing,
		fit,
		mk,
		prism,
		proj,
		put,
		rings,
		solid,
		spring,
		stepS,
		register,
		disposer,
		reducedMotion,
		clamp,
	} = HL;
	const bag = disposer(),
		C = Cam(45, 0.5, 2.65);
	const span = Math.max(100, (height - 180) / (2.65 * Math.sqrt(0.75)));
	fit(
		C,
		[
			[-53, -33, -8],
			[53, 33, span + 12],
		],
		scene === "curated" ? 212 : 200,
		height / 2 - (scene === "curated" ? 8 : 0),
	);
	const P = proj(C),
		front = facing(C);
	HL.inject(document);
	const svg = mk(
		"svg",
		{ viewBox: `0 0 400 ${height}`, "aria-hidden": "true" },
		stage,
	);
	const g = mk("g", {}, svg);
	function block(parent, x0, y0, x1, y1, z0, z1, r = 2, project = P) {
		const [ring, inner] = rings(x0, y0, x1, y1, r, Math.min(0.8, r / 2));
		const part = solid(parent);
		put(part, prism(project, front, ring, inner, z0, z1));
		return part;
	}
	const mounts = drawPortraitFrame({ scene, span, P, g, block });
	const tiers = mounts.map(({ z, offset, accent, hitZ, book, clip }, i) => {
		return {
			i,
			z,
			book,
			clip,
			shelf: accent,
			project: (x, y, v) =>
				scene === "curated"
					? P(x * 1.05, y * 1.05 + 5, z + 4 + (v - z - 4) * 1.05)
					: P(x + offset, y + (scene === "glossary" && i === 1 ? 28 : 0), v),
			group: mk("g", { "data-portrait-level": i }, g),
			parts: [],
			spring: spring(0),
			last: NaN,
			center: P(offset, 0, z + (hitZ ?? 17)),
		};
	});
	drawPortraitForeground({ scene, span, g, block });
	const cursor = createPortraitCursor({ scene, span, P, g });
	function draw(tier, amount) {
		const P = tier.project;
		let parent = tier.group;
		let index = 0;
		let lineIndex = 0;
		const z = tier.z + 4;
		function form(ring, inner, z0, z1, project = P, paths = null) {
			tier.parts[index] ??= solid(parent);
			const item = tier.parts[index];
			put(item, paths ?? prism(project, front, ring, inner, z0, z1));
			index++;
		}
		function part(x0, y0, x1, y1, z0, z1, r = 2, project = P) {
			const [ring, inner] = rings(x0, y0, x1, y1, r, Math.min(0.8, r / 2));
			form(ring, inner, z0, z1, project);
		}
		function line(d) {
			tier.lines ??= [];
			tier.lines[lineIndex] ??= mk("path", { class: "nf lo" }, tier.group);
			tier.lines[lineIndex].setAttribute("d", d);
			lineIndex++;
		}
		function foreground(name) {
			tier.foreground ??= mk("g", { "data-portrait-foreground": name }, svg);
			parent = tier.foreground;
		}
		if (
			drawPortraitObjects(scene, {
				tier,
				amount,
				z,
				part,
				form,
				line,
				foreground,
				P,
				front,
			})
		)
			return;
		if (tier.i === 0) {
			// Music: pads press into a controller, rather than lifting the device.
			part(-34, -22, 34, 22, z, z + 5, 4);
			for (let row = 0; row < 2; row++) {
				for (let col = 0; col < 4; col++) {
					const x = -29 + col * 15,
						y = -7 + row * 13;
					const press = amount * (0.5 + 0.5 * Math.sin(col * 0.9 + row)) * 1.5;
					part(x, y, x + 11, y + 10, z + 5 - press, z + 7 - press, 2);
				}
			}
			part(-29, -17, -21, -11, z + 5, z + 9, 3);
			part(21, -17, 29, -11, z + 5, z + 9, 3);
		} else if (tier.i === 1) {
			// Making notes: three leaves lift from their binding, in a small fan.
			part(-40, -24, 40, 24, z, z + 2.5, 3);
			part(-37, -22, -2, 22, z + 2.5, z + 4, 2.5);
			part(-2, -23, 2, 23, z + 2, z + 5, 1.5);
			for (let i = 0; i < 3; i++) {
				const angle = 0.035 + i * 0.04 + amount * (i + 1) * 0.055;
				const Q = (x, y, v) =>
					P(x * Math.cos(angle), y, v + x * Math.sin(angle));
				part(2, -22, 37, 22, z + 3 + i * 0.6, z + 3.6 + i * 0.6, 2, Q);
			}
			if (scene === "glossary") {
				// A ribbon follows the page and drops over the shelf's near edge.
				const angle = 0.115 + amount * 0.165;
				const Q = (x, y, v) =>
					P(
						x * Math.cos(angle),
						y,
						v + x * Math.sin(angle) - Math.max(0, y - 22) * 0.6,
					);
				part(24, 4, 29, 35, z + 4.8, z + 5.4, 1, Q);
			} else {
				// A pencil is set diagonally beside the book.
				const Q = (x, y, v) => P(x + y * 0.15, y, v);
				part(-38, 27, 33, 30, z, z + 2, 1, Q);
			}
		} else {
			// A small object in progress: the bridge comes down onto its supports.
			part(-25, -15, 25, 15, z, z + 2, 3);
			part(-19, -9, -10, 9, z + 2, z + 27, 2.5);
			part(10, -9, 19, 9, z + 2, z + 27, 2.5);
			const gap = 8 * (1 - amount);
			part(-19, -9, 19, 9, z + 27 + gap, z + 33 + gap, 3);
		}
	}
	let pointer = null,
		active = -1;
	const loop = register(stage, (dt, now) => {
		const still = reducedMotion();
		let moving = false;
		active = -1;
		if (pointer) {
			let distance = Infinity;
			tiers.forEach((tier) => {
				const d = Math.hypot(
					pointer[0] - tier.center[0],
					pointer[1] - tier.center[1],
				);
				if (d < distance && d < 170) {
					active = tier.i;
					distance = d;
				}
			});
		}
		tiers.forEach((tier) => {
			const wave = still ? 0 : (Math.sin(now / 2300 - tier.i * 1.5) + 1) / 2;
			tier.spring.t = active === tier.i ? 1 : 0.12 + wave * 0.45;
			if (stepS(tier.spring, dt)) moving = true;
			const amount = clamp(tier.spring.x, 0, 1);
			if (Math.abs(amount - tier.last) > 0.0002 || Number.isNaN(tier.last)) {
				draw(tier, amount);
				tier.last = amount;
			}
			const resting =
				scene === "ideas"
					? Math.floor(tiers.length / 2)
					: scene === "curated"
						? 0
						: scene === "learn"
							? tiers.length - 1
							: 1;
			const highlighted = tier.i === (active < 0 ? resting : active);
			if (scene === "ideas") {
				for (const part of tier.parts)
					part.sil.classList.toggle("hi", highlighted);
			} else if (scene === "learn") {
				tier.parts[tier.book.open ? 5 : 3]?.sil.classList.toggle(
					"hi",
					highlighted,
				);
			} else if (scene === "curated") {
				tier.parts[
					tier.i === 0 ? 3 : tier.i === 2 ? 7 : 1
				]?.sil.classList.toggle("hi", highlighted);
			} else {
				(tier.shelf ?? tier.parts[0])?.sil.classList.toggle("hi", highlighted);
			}
		});
		const selected = active >= 0 && scene === "content" ? tiers[active] : null;
		if (
			cursor?.update(
				dt,
				now,
				still,
				selected ? selected.z + 4 + selected.clip.height / 2 : null,
			)
		)
			moving = true;
		return !still || moving;
	});
	bag.add(loop.unregister);
	const updateMotionPreference = () => {
		HL.setReducedMotion(motionPreference.matches);
		loop.wake();
	};
	motionPreference.addEventListener("change", updateMotionPreference);
	bag.add(() =>
		motionPreference.removeEventListener("change", updateMotionPreference),
	);
	bag.add(() => svg.remove());
	return {
		move(point) {
			pointer = point;
			loop.wake();
		},
		leave() {
			pointer = null;
			loop.wake();
		},
		destroy: bag.dispose,
	};
}
