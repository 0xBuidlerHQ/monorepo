import { Suspense } from "react";
import { PageLayout } from "@/features/shell/page-layout";
import { TransferPanel } from "@/features/transfers/transfer-panel";
import { PasskeySignIn } from "@/features/account/passkey-sign-in";
import { sessionIdentity } from "@/server/auth/session";
import { myPassports } from "@/server/submissions/client";

export const metadata = { title: "Transfers" };
async function TransferContent() {
 const identity = await sessionIdentity();
 if (!identity) return <div className="max-w-sm"><PasskeySignIn /></div>;
 try { return <TransferPanel key={identity.id} passports={await myPassports()} />; }
 catch { return <p role="alert" className="text-sm text-white/50">Your passports are temporarily unavailable. Reload when the local API and chain are ready.</p>; }
}
export default function TransfersPage() {
 return <PageLayout title="Transfers"><Suspense fallback={null}><TransferContent /></Suspense></PageLayout>;
}
