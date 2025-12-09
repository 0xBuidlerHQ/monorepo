import { createTrackedSelector } from "react-tracked";
import { create } from "zustand";
import { persist } from "zustand/middleware";

interface Store {
	open: boolean;
	toggle: () => void;
}

export const useStore = createTrackedSelector(
	create<Store>()(
		persist(
			(set) => ({
				open: true,
				toggle: () => set((state) => ({ open: !state.open })),
			}),
			{ name: "Store" },
		),
	),
);
