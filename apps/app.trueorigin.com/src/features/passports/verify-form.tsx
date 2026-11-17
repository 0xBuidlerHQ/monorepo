"use client";

import { useEffect, useRef, useState } from "react";
import { VerifyScanner } from "./verify-scanner";
import { verificationInputFromScan } from "./scan-input";
import { useRouter } from "next/navigation";
import { certifiers } from "@0xhq/api-client/types";

export function VerifyForm() {
	const form = useRef<HTMLFormElement>(null);
	const router = useRouter();
	const [method, setMethod] = useState<"manual" | "scan">("manual");
	function scanned(value: string) {
		const lookup = verificationInputFromScan(value);
		if (!lookup)
			return "This QR code does not contain a supported passport or certification number. Enter the number manually instead.";
		const input = form.current?.elements.namedItem("q");
		if (input instanceof HTMLInputElement) input.value = lookup.query;
		const selectedCertifier = form.current?.elements.namedItem("certifier");
		if (lookup.certifier && selectedCertifier instanceof HTMLSelectElement)
			selectedCertifier.value = lookup.certifier;
		const certifier =
			lookup.certifier ??
			(
				form.current?.elements.namedItem(
					"certifier",
				) as HTMLSelectElement | null
			)?.value ??
			"PSA";
		router.push(
			`/verify?${new URLSearchParams({ q: lookup.query, certifier })}`,
		);
		setMethod("manual");
		return null;
	}
	useEffect(() => {
		const params = new URLSearchParams(window.location.search);
		setMethod(params.get("method") === "scan" ? "scan" : "manual");
		const input = form.current?.elements.namedItem("q");
		const select = form.current?.elements.namedItem("certifier");
		if (input instanceof HTMLInputElement) input.value = params.get("q") ?? "";
		if (
			select instanceof HTMLSelectElement &&
			certifiers.some((entry) => entry.id === params.get("certifier"))
		)
			select.value = params.get("certifier") ?? "PSA";
	}, []);
	return (
		<form
			ref={form}
			action="/verify"
			className="max-w-3xl rounded-[28px] bg-[var(--surface)] p-5 sm:p-7"
		>
			<div className="mb-6 flex gap-1 rounded-full bg-black/20 p-1 w-fit">
				<button
					type="button"
					aria-pressed={method === "manual"}
					onClick={() => setMethod("manual")}
					className={`h-10 cursor-pointer rounded-full px-5 text-sm transition-colors ${method === "manual" ? "bg-white text-black" : "text-white/50 hover:text-white"}`}
				>
					Enter a number
				</button>
				<button
					type="button"
					aria-pressed={method === "scan"}
					onClick={() => setMethod("scan")}
					className={`h-10 cursor-pointer rounded-full px-5 text-sm transition-colors ${method === "scan" ? "bg-white text-black" : "text-white/50 hover:text-white"}`}
				>
					Scan a code
				</button>
			</div>
			{method === "scan" && <VerifyScanner onScan={scanned} />}
			<div hidden={method !== "manual"}>
				<div className="grid gap-4 sm:grid-cols-[140px_minmax(0,1fr)]">
					<label className="text-xs text-white/45">
						Certifier
						<span className="relative mt-2 block">
							<select
								name="certifier"
								defaultValue="PSA"
								className="h-12 w-full cursor-pointer appearance-none rounded-xl bg-black/20 pl-4 pr-10 text-sm text-white/80"
							>
								{certifiers.map((entry) => (
									<option key={entry.id} value={entry.id}>
										{entry.name}
									</option>
								))}
							</select>
							<svg
								aria-hidden="true"
								viewBox="0 0 20 20"
								fill="none"
								stroke="currentColor"
								strokeWidth="1.3"
								className="pointer-events-none absolute right-4 top-4 size-4"
							>
								<path d="m6 8 4 4 4-4" />
							</svg>
						</span>
					</label>
					<label className="text-xs text-white/45">
						Passport link, item ID, or certification number
						<input
							name="q"
							required
							maxLength={2048}
							defaultValue=""
							autoCapitalize="none"
							autoCorrect="off"
							spellCheck={false}
							placeholder="Paste a passport link or enter a number"
							className="mt-2 h-12 w-full rounded-xl bg-black/20 px-4 text-sm text-white placeholder:text-white/25"
						/>
					</label>
				</div>
				<div className="mt-5 flex flex-wrap items-center justify-between gap-4">
					<p className="max-w-sm text-[11px] leading-5 text-white/35">
						The certifier is used for number searches. You do not need an
						account to check a passport.
					</p>
					<button
						type="submit"
						className="inline-flex h-11 cursor-pointer items-center gap-4 rounded-full bg-[#f0f0ed] px-5 text-sm font-medium text-[#171717] transition-colors hover:bg-white"
					>
						Verify passport <span aria-hidden="true">↗</span>
					</button>
				</div>
			</div>
		</form>
	);
}
