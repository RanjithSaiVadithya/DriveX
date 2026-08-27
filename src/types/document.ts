/** Driver verification documents — not vehicle ownership papers. */
export type DocumentType =
  | "IDENTITY"
  | "DRIVERS_LICENSE"
  | "BACKGROUND_CHECK"
  | "PROFILE_PHOTO";

export type DocumentStatus = "PENDING" | "VERIFIED" | "REJECTED" | "EXPIRED";

export interface Document {
  id: string;
  driverId: string;
  type: DocumentType;
  fileUrl: string;
  status: DocumentStatus;
  expiresAt: string | null;
  rejectionReason: string | null;
  uploadedAt: string;
  reviewedAt: string | null;
}
