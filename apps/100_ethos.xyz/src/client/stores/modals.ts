import React from "react";
import { create, type StateCreator } from "zustand";
import { devtools, type PersistOptions, persist } from "zustand/middleware";

type ToggleState = {
	isOn: boolean;
	isOff: boolean;
	turnOn: () => void;
	turnOff: () => void;
	toggle: () => void;
	set: (on: boolean) => void;
};

export const createToggleSlice =
	<T extends Record<string, unknown> = {}>(
		customSlice?: StateCreator<ToggleState & T, [], [], T>,
	): StateCreator<ToggleState & T, [], []> =>
	(set, get, api) => {
		const baseSlice = {
			isOn: false,
			isOff: true,
			turnOn: () => set((s) => ({ ...s, isOn: true, isOff: false })),
			turnOff: () => set((s) => ({ ...s, isOn: false, isOff: true })),
			toggle: () => set((s) => ({ ...s, isOn: !s.isOn, isOff: !s.isOff })),
			set: (open: boolean) => set((s) => ({ ...s, isOn: open, isOff: !open })),
		};

		// Return combined slice if custom slice is provided, otherwise just return base slice
		return customSlice
			? { ...baseSlice, ...customSlice(set, get, api) }
			: ({ ...baseSlice } as ToggleState & T);
	};

// Type for the hydrated version of the store
type HydratedStore<T> = T & { hydrated: boolean };

export function createHydratedToggleStore<T extends Record<string, unknown> = {}>(
	persistOptions?: PersistOptions<ToggleState & T>,
	customState?: StateCreator<ToggleState & T, [], [], T>,
) {
	// Create the store with optional custom state
	const toggleSlice = createToggleSlice<T>(customState);

	// Apply persistence if options are provided
	const storeCreator = persistOptions
		? create<ToggleState & T>()(devtools(persist(toggleSlice, persistOptions)))
		: create<ToggleState & T>()(devtools(toggleSlice));

	// Create and return the hook that includes hydration state
	return function useHydratedStore(): HydratedStore<ToggleState & T> {
		const state = storeCreator();

		// Track hydration state
		const [hydrated, setHydrated] = React.useState(false);

		React.useEffect(() => {
			// Set hydrated to true on client-side after mounting
			setHydrated(true);
		}, []);

		// Return store with hydration state
		return {
			...state,
			hydrated,
		};
	};
}

/**
 * @dev Toggle Announcement.
 */
const useToggleAnnouncementBar = createHydratedToggleStore<{}>();

/**
 * @dev Toggle CmdK.
 */
const useToggleCmdK = createHydratedToggleStore<{}>();

/**
 * @dev Toggle DevMode.
 */
const useToggleDevMode = createHydratedToggleStore<{}>();

export { useToggleAnnouncementBar, useToggleCmdK, useToggleDevMode };
