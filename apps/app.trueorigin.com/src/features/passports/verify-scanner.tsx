"use client";

import { useEffect, useRef, useState } from "react";
import type QrScanner from "qr-scanner";
import { NavigationIcon } from "@/components/icons/navigation-icon";

export function VerifyScanner({
	onScan,
}: {
	onScan: (value: string) => string | null;
}) {
	const video = useRef<HTMLVideoElement>(null);
	const scanner = useRef<QrScanner | null>(null);
	const generation = useRef(0);
	const [phase, setPhase] = useState<
		"idle" | "starting" | "running" | "reading"
	>("idle");
	const [error, setError] = useState("");
	function stop() {
		generation.current++;
		scanner.current?.destroy();
		scanner.current = null;
		setPhase("idle");
	}
	useEffect(
		() => () => {
			generation.current++;
			scanner.current?.destroy();
			scanner.current = null;
		},
		[],
	);
	async function start() {
		if (phase !== "idle") return;
		const operation = ++generation.current;
		setError("");
		setPhase("starting");
		try {
			const { default: Scanner } = await import("qr-scanner");
			if (operation !== generation.current || !video.current) return;
			const instance = new Scanner(
				video.current,
				(result) => {
					if (operation !== generation.current) return;
					stop();
					setError(onScan(result.data) ?? "");
				},
				{
					returnDetailedScanResult: true,
					preferredCamera: "environment",
					maxScansPerSecond: 5,
					highlightScanRegion: true,
				},
			);
			scanner.current = instance;
			await instance.start();
			if (operation !== generation.current) {
				instance.destroy();
				return;
			}
			setPhase("running");
		} catch {
			if (operation !== generation.current) return;
			stop();
			setError(
				"The camera could not be started. Allow camera access, upload a QR image, or enter the number instead.",
			);
		}
	}
	async function readImage(file?: File) {
		if (!file) return;
		stop();
		const operation = ++generation.current;
		setError("");
		setPhase("reading");
		try {
			const { default: Scanner } = await import("qr-scanner");
			const result = await Scanner.scanImage(file, {
				returnDetailedScanResult: true,
			});
			if (operation !== generation.current) return;
			setPhase("idle");
			setError(onScan(result.data) ?? "");
		} catch {
			if (operation !== generation.current) return;
			setPhase("idle");
			setError(
				"No QR code was found in that image. Try a clearer image or enter the number instead.",
			);
		}
	}
	const active = phase === "starting" || phase === "running";
	return (
		<div>
			<div className="relative flex aspect-video items-center justify-center overflow-hidden rounded-2xl bg-black/25">
				<video
					ref={video}
					muted
					playsInline
					aria-label="QR scanner camera preview"
					className={`absolute inset-0 size-full object-cover ${active ? "" : "invisible"}`}
				/>
				{!active && (
					<div className="flex flex-col items-center gap-3 text-white/35">
						<NavigationIcon name="Scan" className="size-9" />
						<p className="text-xs">Scan a passport or certification QR code</p>
					</div>
				)}
			</div>
			<div className="mt-4 flex flex-wrap items-center gap-3">
				{active ? (
					<button
						type="button"
						onClick={stop}
						className="h-10 cursor-pointer rounded-full bg-white/10 px-5 text-xs text-white/80"
					>
						Stop camera
					</button>
				) : (
					<button
						type="button"
						onClick={start}
						disabled={phase === "reading"}
						className="h-10 cursor-pointer rounded-full bg-white px-5 text-xs text-black disabled:opacity-40"
					>
						Start camera
					</button>
				)}
				<label className="inline-flex h-10 cursor-pointer items-center rounded-full bg-white/5 px-5 text-xs text-white/65">
					{phase === "reading" ? "Reading image…" : "Upload QR image"}
					<input
						type="file"
						accept="image/*"
						disabled={phase === "reading"}
						onChange={(event) => {
							void readImage(event.target.files?.[0]);
							event.target.value = "";
						}}
						className="sr-only"
					/>
				</label>
				{phase === "starting" && (
					<p role="status" className="text-xs text-white/40">
						Starting camera…
					</p>
				)}
			</div>
			{error && (
				<p role="alert" className="mt-4 text-xs leading-6 text-orange-200/80">
					{error}
				</p>
			)}
			<p className="mt-4 text-[11px] leading-5 text-white/35">
				Use a QR code, or enter the certification number manually. Scanning a
				card photo does not authenticate it.
			</p>
		</div>
	);
}
