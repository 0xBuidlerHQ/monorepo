import { SettingsIcon } from "@/components/icons/settings-icon";
import { SideDrawer } from "@/components/side-drawer";

export function SettingsDrawer() {
	return (
		<SideDrawer
			title="Settings"
			trigger={<SettingsIcon className="size-[calc(var(--cell)*0.5)]" />}
			triggerClassName="grid place-items-center border-l border-white/20 text-brand-accent"
		/>
	);
}
