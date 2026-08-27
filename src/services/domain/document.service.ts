import type { Document, DocumentStatus } from "@/types/document";

export function getDocumentTypeLabel(type: Document["type"]): string {
  const labels: Record<Document["type"], string> = {
    IDENTITY: "Identity document",
    DRIVERS_LICENSE: "Driving licence",
    BACKGROUND_CHECK: "Background verification",
    PROFILE_PHOTO: "Profile photo",
  };
  return labels[type];
}

export function getDocumentStatusLabel(status: DocumentStatus): string {
  const labels: Record<DocumentStatus, string> = {
    PENDING: "Pending",
    VERIFIED: "Verified",
    REJECTED: "Rejected",
    EXPIRED: "Expired",
  };
  return labels[status];
}

export type DocumentExpiryBucket = "valid" | "expiring_soon" | "expired" | "none";

export function getDocumentExpiryBucket(
  expiresAt: string | null,
  now = new Date(),
): DocumentExpiryBucket {
  if (!expiresAt) return "none";
  const exp = new Date(expiresAt);
  if (Number.isNaN(exp.getTime())) return "none";
  if (exp.getTime() < now.getTime()) return "expired";
  const days = (exp.getTime() - now.getTime()) / (1000 * 60 * 60 * 24);
  if (days <= 30) return "expiring_soon";
  return "valid";
}
