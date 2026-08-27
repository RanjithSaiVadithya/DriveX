import { z } from "zod";

export const documentSchema = z.object({
  type: z.enum([
    "IDENTITY",
    "DRIVERS_LICENSE",
    "BACKGROUND_CHECK",
    "PROFILE_PHOTO",
  ]),
  fileUrl: z.string().url().optional(),
  expiresAt: z.string().datetime().nullable().optional(),
});

export type DocumentInput = z.infer<typeof documentSchema>;

export const mockDocumentUploadSchema = z.object({
  type: z.enum([
    "IDENTITY",
    "DRIVERS_LICENSE",
    "BACKGROUND_CHECK",
    "PROFILE_PHOTO",
  ]),
  fileName: z.string().min(1, "File name is required"),
  expiresAt: z.string().optional().nullable(),
});

export type MockDocumentUploadInput = z.infer<typeof mockDocumentUploadSchema>;
