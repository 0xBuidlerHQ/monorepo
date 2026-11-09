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
