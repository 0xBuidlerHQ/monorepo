import type { Figure, HairlineOptions } from "@lucasmarkes/hairline";

export function svgDrawing(markup: string, styles: string, sceneClass: string) {
	return (host: HTMLElement, options: HairlineOptions = {}): Figure => {
		const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
		svg.setAttribute("viewBox", "0 0 240 200");
		svg.setAttribute("class", sceneClass);
		// The visible figcaption supplies the description; avoid announcing it twice.
		svg.setAttribute("aria-hidden", "true");
		svg.setAttribute("fill", "none");
		svg.setAttribute("stroke", "currentColor");
		svg.setAttribute("stroke-width", "1");
		svg.setAttribute("stroke-linecap", "round");
		svg.setAttribute("stroke-linejoin", "round");
		svg.style.cssText = "display:block;width:100%;height:100%;overflow:visible";
		// Markup is composed only from the fixed drawings above; labels use DOM attributes.
		svg.innerHTML = `<style>${styles}</style>${markup}`;
		host.appendChild(svg);
		function update(next: HairlineOptions) {
			if (next.label !== undefined) svg.setAttribute("aria-label", next.label);
			if (next.play !== undefined) svg.dataset.playing = String(next.play);
		}
		svg.dataset.playing = "false";
		update(options);
		return { update, destroy: () => svg.remove() };
	};
}
