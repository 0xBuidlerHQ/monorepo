"use client";

import { useToggleCmdK } from "@client/stores/modals";
import * as ReactUse from "react-use";

const KeyboardEvents = () => {
	const toggleCmdK = useToggleCmdK();

	ReactUse.useKey(
		(event) => (event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "k",
		(event) => {
			event.preventDefault();

			toggleCmdK.toggle();
			console.log("Cmd+K pressed!");
			// your logic here, e.g. open a command palette
		},
	);

	return null;
};

export { KeyboardEvents };
