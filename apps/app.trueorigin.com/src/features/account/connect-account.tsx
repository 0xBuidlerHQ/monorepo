"use client";

import { SideDrawer } from "@/components/side-drawer";
import { useAccount } from "@/features/account/account-provider";
import { AccountIcon } from "@/features/account/account-icon";

export function ConnectAccount() {
	const {
		connection,
		config,
		phase,
		error,
		deployed,
		transactionHash,
		connect,
		disconnect,
		sendLocalTest,
	} = useAccount();
	const busy = phase !== "idle";
	const address = connection?.account.address;
	return (
		<SideDrawer
			theme="light"
			className="shadow-[-12px_0_60px_rgba(24,65,84,0.08)]"
			title={address ? "Your account" : "Welcome to TrueOrigin"}
			triggerLabel={address ? `Open account ${address}` : "Connect your account"}
			trigger={
				address ? (
					<span className="flex min-w-0 items-center gap-3">
						<span className="relative shrink-0">
							<span className="block overflow-hidden rounded-full ring-1 ring-black/10 ring-offset-2 ring-offset-[#edf7fc]">
								<AccountIcon address={address} size={24} />
							</span>
							<span className="absolute -right-1 -bottom-1 size-2.5 rounded-full border-2 border-[#edf7fc] bg-[#377d6b]" />
						</span>
						<span className="flex min-w-0 flex-1 flex-col gap-1 text-left">
							<span className="text-[10px] leading-none font-medium text-[#587382]">Your account</span>
							<span className="truncate font-mono text-[11px] leading-tight text-[#203c4b]">{`${address.slice(0, 4)}…${address.slice(-4)}`}</span>
						</span>
						<svg aria-hidden="true" viewBox="0 0 16 16" fill="none" className="hidden size-3 shrink-0 text-[#587382] transition-transform duration-200 group-hover:translate-y-0.5 motion-reduce:transition-none sm:block">
							<path d="m4 6 4 4 4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
						</svg>
					</span>
				) : (
					<span className="flex items-center justify-center gap-2.5">
						<svg aria-hidden="true" viewBox="0 0 20 20" fill="none" className="size-4 text-[#203c4b]">
							<circle cx="10" cy="6.5" r="3" stroke="currentColor" strokeWidth="1.4" />
							<path d="M4 17v-1a6 6 0 0 1 12 0v1" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
						</svg>
						<span className="text-[13px] font-medium">{phase === "restoring" ? "Connecting…" : "Your account"}</span>
					</span>
				)
			}
			triggerClassName="group h-10 min-w-36 rounded-full border border-white/70 bg-[#edf7fc] px-3 text-[#203c4b] shadow-[0_4px_16px_rgba(31,73,94,0.06),inset_0_1px_0_rgba(255,255,255,0.7)] transition-[background-color,box-shadow] duration-200 hover:bg-[#f7fcff] hover:shadow-[0_6px_20px_rgba(31,73,94,0.1)] focus-visible:outline-[#203c4b] motion-reduce:transition-none"
			description={
				address
					? "A home for the things that are yours. Secured with your passkey."
					: "Your collection starts with you. Sign in securely with a passkey."
			}
		>
			{address ? (
				<>
					<div className="space-y-4 rounded-2xl border border-white/80 bg-white/50 p-6 text-xs text-[#203c4b]">
						<div className="flex items-center gap-4"><span className="overflow-hidden rounded-full"><AccountIcon address={address} size={48} /></span><div><p className="text-base font-medium tracking-tight">You’re connected</p><p className="mt-1 text-xs text-[#587382]">Protected by your passkey</p></div></div>
						<p className="text-black/50">
							{config?.chainId === 31337 ? "Local Ethereum fork" : "Ethereum"}
						</p>
						<div className="rounded-xl border border-black/5 bg-white/50 p-3"><p className="mb-2 text-[10px] text-[#587382]">Account address</p><p className="break-all select-all font-mono text-[11px] leading-5">{address}</p></div>
						<p className="text-[#587382]">
							{deployed
								? "Account deployed"
								: "Ready · deploys with your first transaction"}
						</p>
					</div>
					{config?.chainId === 31337 && (
						<button
							type="button"
							disabled={busy}
							onClick={() => void sendLocalTest()}
							className="w-full cursor-pointer rounded-xl border border-[#203c4b]/15 bg-white/30 px-5 py-4 text-left text-[13px] font-medium text-[#203c4b] transition-colors hover:bg-white/60 focus-visible:outline-2 focus-visible:outline-[#203c4b] disabled:cursor-not-allowed disabled:opacity-50"
						>
							{phase === "sending"
								? "Confirming transaction…"
								: "Send local test transaction"}
						</button>
					)}
					{transactionHash && (
						<p className="break-all font-mono text-xs text-black/60">
							Transaction: {transactionHash}
						</p>
					)}
					<button
						type="button"
						disabled={busy}
						className="w-full cursor-pointer rounded-xl border border-[#203c4b]/15 bg-white/30 px-5 py-4 text-left text-[13px] font-medium text-[#203c4b] transition-colors hover:bg-white/60 focus-visible:outline-2 focus-visible:outline-[#203c4b] disabled:cursor-not-allowed disabled:opacity-50"
						onClick={() => void disconnect()}
					>
						Disconnect
					</button>
				</>
			) : (
				<div className="space-y-3">
					<button
						type="button"
						disabled={busy}
						className="w-full cursor-pointer rounded-xl border border-[#203c4b] bg-[#203c4b] px-5 py-4 text-left text-[13px] font-medium text-white transition-colors hover:bg-[#315365] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#203c4b] disabled:cursor-not-allowed disabled:opacity-50"
						onClick={() => void connect("login")}
					>
						{phase === "connecting"
							? "Connecting…"
							: phase === "restoring"
								? "Checking account…"
								: "Sign in with a passkey"}
					</button>
					<button
						type="button"
						disabled={busy}
						className="w-full cursor-pointer rounded-xl border border-[#203c4b]/15 bg-white/30 px-5 py-4 text-left text-[13px] font-medium text-[#203c4b] transition-colors hover:bg-white/60 focus-visible:outline-2 focus-visible:outline-[#203c4b] disabled:cursor-not-allowed disabled:opacity-50"
						onClick={() => void connect("register")}
					>
						{phase === "registering" ? "Creating passkey…" : "Create a passkey"}
					</button>
				</div>
			)}
			{!address && (
				<p className="px-1 text-[11px] leading-6 text-[#587382]">
					Save your passkey in your password manager to use it on supported
					devices, or choose a passkey from another device.
				</p>
			)}
			{error && (
				<p
					role="alert"
					className="break-words text-xs leading-relaxed text-brand-accent"
				>
					{error}
				</p>
			)}
		</SideDrawer>
	);
}
