import type { Metadata } from "next";

export type PageMetadata = {
	/**
	 * Next Metadata.
	 */
	metadata?: Metadata;

	/**
	 * Extra Metadata.
	 */
	name: string;
	description: string;
	href: string;

	submenu?: {
		image?: string;
		items: PageMetadata[];
	};
};
