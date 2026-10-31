import { Children, cloneElement, isValidElement, type ReactNode } from "react";
import { getTitleHue } from "@/lib/title-colors";

export function TitleText({ children }: { children: ReactNode }) {
	return Children.map(children, (child) => {
		if (typeof child === "string") {
			const parts: ReactNode[] = [];
			let start = 0;
			for (const match of child.matchAll(/\[[^\]\r\n]+\]/g)) {
				const topic = match[0].slice(1, -1);
				const hue = getTitleHue(topic);
				parts.push(child.slice(start, match.index));
				parts.push(
					<span
						key={`marker-${match.index}`}
						className="title-marker px-2"
						style={{
							colorScheme: "light dark",
							color: `light-dark(hsl(${hue} 65% 28%), hsl(${hue} 75% 78%))`,
							backgroundColor: `light-dark(hsl(${hue} 75% 50% / 0.12), hsl(${hue} 75% 65% / 0.15))`,
						}}
					>
						{match[0]}
					</span>,
				);
				start = match.index + match[0].length;
			}
			parts.push(child.slice(start));
			return parts;
		}
		if (
			isValidElement<{ children?: ReactNode }>(child) &&
			child.props.children !== undefined
		) {
			return cloneElement(
				child,
				undefined,
				<TitleText>{child.props.children}</TitleText>,
			);
		}
		return child;
	});
}
