import Link from "next/link";
export default function PassportNotFound() {
	return <section className="py-12"><p className="text-xs text-white/35">TrueOrigin passport</p><h1 className="mt-5 text-4xl font-medium tracking-[-0.04em]">No issued passport found.</h1><p className="mt-5 max-w-md text-sm leading-6 text-white/45">Check the link or search by certifier and certification number. A missing passport does not mean an item is counterfeit.</p><Link href="/verify" className="mt-7 inline-flex rounded-full bg-white px-5 py-3 text-sm text-black">Go to Verify</Link></section>;
}
