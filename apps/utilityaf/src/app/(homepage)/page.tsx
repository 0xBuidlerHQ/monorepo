import { Container } from "@0xbuidlerhq/ui/system/base/container";
import { Hero } from "@app/(homepage)/_components/hero";
import { ToolSearch } from "@app/(homepage)/_components/toolSearch";

const Page = () => {
	return (
		<Container className="mt-10">
			<Hero />
			<ToolSearch />
		</Container>
	);
};

export default Page;
