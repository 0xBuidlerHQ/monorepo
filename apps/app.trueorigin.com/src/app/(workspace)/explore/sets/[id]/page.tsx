import { redirect } from "next/navigation";
import { LoadingBoundary } from "@/features/shell/loading-boundary";
type Props = { params: Promise<{ id: string }>; searchParams: Promise<Record<string, string | string[] | undefined>> };
async function LegacyCollection({ params, searchParams }: Props) {
 const { id } = await params; const query = new URLSearchParams();
 for (const [key,value] of Object.entries(await searchParams)) if (typeof value === "string") query.set(key,value);
 redirect(`/explore/catalogue/collections/${id}${query.size ? `?${query}` : ""}`);
 return null;
}
export default function Page(props: Props) { return <LoadingBoundary fallback={null}><LegacyCollection {...props}/></LoadingBoundary>; }
