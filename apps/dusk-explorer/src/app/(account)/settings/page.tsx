"use client";

import { Page } from "@components/layouts/page";
import { Tabs, TabsList } from "@radix-ui/react-tabs";
import {
	Row,
	SettingsContent,
	TabTrigger,
} from "src/app/(account)/settings/components";
import { SettingsData } from "src/app/(account)/settings/data";
import { useClient } from "src/utils";

const Settings = () => {
	const client = useClient();

	return (
		<Page
			title="Settings"
			subtitle="Manage your account settings and preferences."
		>
			<Tabs defaultValue={SettingsData[0].title}>
				<div className="grid grid-cols-5 gap-10">
					<div className="col-span-1">
						<TabsList className="flex space-x-2 lg:flex-col lg:space-x-0 lg:space-y-1">
							{SettingsData.map((item) => (
								<TabTrigger value={item.title} key={item.title} />
							))}
						</TabsList>
					</div>

					<div className="col-span-3">
						{SettingsData.map((setting) => (
							<SettingsContent
								title={setting.title}
								subtitle={setting.subtitle}
								key={setting.title}
							>
								{setting.rows.map((row) => (
									<Row
										title={row.title}
										subtitle={row.subtitle}
										key={row.title}
									>
										{row.Component(client)}
									</Row>
								))}
							</SettingsContent>
						))}
					</div>
				</div>
			</Tabs>
		</Page>
	);
};

export default Settings;
