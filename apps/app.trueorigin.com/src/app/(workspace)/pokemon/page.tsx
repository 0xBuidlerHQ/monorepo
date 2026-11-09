import { redirect } from "next/navigation";
import { Suspense } from "react";

type Props = { searchParams: Promise<{ q?: string }> };
async function Redirect({ searchParams }: Props) {
 const params = await searchParams;
 const query = typeof params.q === "string" && params.q ? `?q=${encodeURIComponent(params.q)}` : "";
 return redirect(`/explore/pokemon/pokedex${query}`);
}
export default function Page(props: Props) { return <Suspense fallback={null}><Redirect {...props} /></Suspense>; }
