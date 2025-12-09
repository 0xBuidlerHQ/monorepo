import { Page } from "@components/layouts/page";
import type { BlockProps } from "src/app/blocks/[id]";
import Block from "src/app/blocks/[id]";

async function BlockPage(props: BlockProps) {
	return (
		<Page title="Block" subtitle={`#${props.params.id}`}>
			<Block {...props} />
		</Page>
	);
}

export default BlockPage;
