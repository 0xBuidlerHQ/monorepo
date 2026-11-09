import { LoadingBoundary } from "@/features/shell/loading-boundary";
import { TradingPanel } from "@/features/trading/trading-panel";

export const metadata = { title: "Trading" };
type Props = { searchParams: Promise<{ mode?: string }> };

async function TradingContent({ searchParams }: Props) {
	const { mode } = await searchParams;
	return <TradingPanel mode={mode} />;
}

export default function TradingPage(props: Props) {
	return <div><LoadingBoundary fallback={<TradingPanel />}><TradingContent {...props} /></LoadingBoundary></div>;
}
