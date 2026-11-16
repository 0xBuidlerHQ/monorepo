import { redirect } from "next/navigation";
import { LoadingBoundary } from "@/features/shell/loading-boundary";
import { PageSkeleton } from "@/features/shell/loading-skeleton";
type Props = { searchParams: Promise<Record<string, string | string[] | undefined>> };
async function LegacyCatalog({ searchParams }: Props) {
 const query = new URLSearchParams();
 for (const [key,value] of Object.entries(await searchParams)) if (typeof value === "string" && ["lang","q"].includes(key)) query.set(key,value);
 redirect(`/explore/pokemon${query.size ? `?${query}` : ""}`);
 return null;
}
export default function Page(props: Props) { return <LoadingBoundary fallback={<PageSkeleton variant="sets" />}><LegacyCatalog {...props}/></LoadingBoundary>; }
