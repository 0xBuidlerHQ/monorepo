import { OriginLogo } from "@/components/origin-logo";
import { SideDrawer } from "@/components/side-drawer";

export function MenuDrawer() {
	return (
		<SideDrawer
			side="left"
			title="Menu"
			trigger={<OriginLogo className="size-[calc(var(--cell)*0.5)]" />}
			triggerClassName="grid place-items-center border-r border-white/20 text-brand-accent"
		/>
	);
}
