import { Children, cloneElement, isValidElement, type ReactNode } from "react";
import { getTitleMarkerColors } from "@/lib/title-colors";

export function TitleText({
	children,
	theme,
}: {
	children: ReactNode;
	theme?: "light" | "dark";
}) {
	return renderTitleText(children, theme);
}

// ImageResponse needs arrays as host-element children, rather than as the
// return value of a nested React component in development.
export function renderTitleText(children: ReactNode, theme?: "light" | "dark") {
	return Children.map(children, (child) => {
		if (typeof child === "string") {
			const parts: ReactNode[] = [];
			let start = 0;
			for (const match of child.matchAll(/\[[^\]\r\n]+\]/g)) {
				const topic = match[0].slice(1, -1);
				const light = getTitleMarkerColors(topic, "light");
				const dark = getTitleMarkerColors(topic, "dark");
				parts.push(child.slice(start, match.index));
				parts.push(
					<span
						key={`marker-${match.index}`}
						className="title-marker px-2"
						style={
							theme
								? { ...getTitleMarkerColors(topic, theme), padding: "0 8px" }
								: {
										colorScheme: "light dark",
										color: `light-dark(${light.color}, ${dark.color})`,
										backgroundColor: `light-dark(${light.backgroundColor}, ${dark.backgroundColor})`,
									}
						}
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
				<TitleText theme={theme}>{child.props.children}</TitleText>,
			);
		}
		return child;
	});
}
