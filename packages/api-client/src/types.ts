import type { PassportItem } from "./passport-item.ts";
import type { PhysicalHandover } from "./handovers.ts";
export const certifiers = [{ id: "PSA", name: "PSA" }, { id: "CGC", name: "CGC" }, { id: "BGS", name: "Beckett" }] as const;
export type Certifier = typeof certifiers[number]["id"];

export const submissionStatuses = ["draft", "requested", "accepted", "in_transit", "received", "under_inspection", "approved", "rejected", "cancelled"] as const;
export type SubmissionStatus = typeof submissionStatuses[number];
export type PhotoSide = "front" | "back";
export type SubmissionInput = {
	requestId: string; gradingCompany: Certifier; certificationNumber: string;
	contactEmail: string; recipientAddress: string; notes: string;
};
export type Submission = {
	id: string; reference: string; title: string; certificationNumber: string; gradingCompany: Certifier;
	grade: string; contactEmail: string; recipientAddress: string; notes: string;
	status: SubmissionStatus; version: number; createdAt: string; updatedAt: string;
	photos: { side: PhotoSide; contentType: string; size: number; sha256: string }[];
	passport: PassportIssuance | null;
	returnHandover: PhysicalHandover | null;
	history: { id: number; status: SubmissionStatus; note: string; createdAt: string }[];
};
export const statusLabels: Record<SubmissionStatus, string> = {
	draft: "Draft", requested: "Requested", accepted: "Accepted", in_transit: "In transit", received: "Received",
	under_inspection: "Under inspection", approved: "Approved", rejected: "Rejected", cancelled: "Cancelled",
};
export const staffTransitions: Partial<Record<SubmissionStatus, SubmissionStatus[]>> = {
	requested: ["accepted", "rejected"], accepted: ["in_transit", "received", "rejected"],
	in_transit: ["received"], received: ["under_inspection"], under_inspection: ["approved", "rejected"],
};

export type PassportIssuance = {
	inspectionApprovedAt?: string;
	itemId: string; item: PassportItem; title: string; grade: string; certifier: Certifier; certificationNumber: string;
	recipientAddress: string; chainId: 31337; contractAddress: string | null; tokenId: string | null;
	metadataURI: string | null; imageURI: string | null; transactionHash: string | null;
	status: "queued" | "prepared" | "submitted" | "confirmed" | "failed";
	error: string | null; createdAt: string; confirmedAt: string | null;
};

export type PublicPassport = {
	itemId: string; item: PassportItem; title: string; grade: string; certifier: Certifier; certificationNumber: string;
	chainId: 31337; contractAddress: string; tokenId: string; metadataURI: string; imageURI: string | null;
	transactionHash: string; issuedTo: string; issuedAt: string;
	inspection: { status: "approved" | "not_recorded"; approvedAt: string | null; revocationSupported: false };
};
export type PassportVerification = {
	status: "verified" | "mismatch" | "unavailable"; message: string | null; checkedAt: string;
	currentOwner: string | null; issuer: string | null; blockNumber: string | null; blockHash: string | null;
	historyTruncated: boolean;
	history: { kind: "mint" | "transfer"; from: string; to: string; transactionHash: string; blockNumber: string; logIndex: number; timestamp: string }[];
};
export type PublicPassportDetail = PublicPassport & { verification: PassportVerification };

export const activityKinds = ["all", "sale", "listing", "transfer", "issued"] as const;
export type ActivityKind = typeof activityKinds[number];
export type ActivityQuery = { kind?: ActivityKind; cursor?: string; limit?: number };
export type AssetActivity = {
	id: string; kind: Exclude<ActivityKind, "all">; itemId: string; tokenId: string;
	contractAddress: string; from: string; to: string; transactionHash: string;
	blockNumber: string; logIndex: number; timestamp: string;
	passport: PublicPassport | null; category?: string | null;
};
export type ActivityPage = { events: AssetActivity[]; nextCursor: string | null };

