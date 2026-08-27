"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { DataState } from "@/components/shared/data-state";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useDocuments } from "@/hooks/use-documents";
import {
  mockDocumentUploadSchema,
  type MockDocumentUploadInput,
} from "@/schemas/document.schema";
import {
  getDocumentExpiryBucket,
  getDocumentStatusLabel,
  getDocumentTypeLabel,
} from "@/services/domain/document.service";
import { isAppError } from "@/services/domain/errors";
import { cn } from "@/lib/utils";

export default function DriverDocumentsPage() {
  const { listQuery, upload } = useDocuments();
  const form = useForm<MockDocumentUploadInput>({
    resolver: zodResolver(mockDocumentUploadSchema),
    defaultValues: {
      type: "DRIVERS_LICENSE",
      fileName: "licence.pdf",
      expiresAt: null,
    },
  });

  async function onSubmit(values: MockDocumentUploadInput) {
    try {
      await upload.mutateAsync(values);
      toast.success("Document uploaded (mock)");
      form.reset({
        type: "DRIVERS_LICENSE",
        fileName: "licence.pdf",
        expiresAt: null,
      });
    } catch (err) {
      form.setError("root", {
        message: isAppError(err) ? err.message : "Unable to upload",
      });
    }
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-h1">Documents</h1>
        <p className="mt-2 text-muted-foreground">
          Driver verification only — not vehicle registration or insurance for a
          fleet vehicle.
        </p>
      </div>

      <DataState
        isLoading={listQuery.isLoading}
        isError={listQuery.isError}
        errorMessage="Unable to load documents"
        onRetry={() => void listQuery.refetch()}
        isEmpty={(listQuery.data ?? []).length === 0}
        emptyTitle="No documents uploaded"
        emptyDescription="Upload a mock verification document to get started."
      >
        <ul className="space-y-3">
          {(listQuery.data ?? []).map((doc) => {
            const expiry = getDocumentExpiryBucket(doc.expiresAt);
            return (
              <li
                key={doc.id}
                className="rounded-xl border border-border bg-warm-white p-4 shadow-soft"
              >
                <div className="flex flex-wrap items-start justify-between gap-2">
                  <div>
                    <p className="font-semibold text-deep-navy">
                      {getDocumentTypeLabel(doc.type)}
                    </p>
                    <p className="mt-1 text-sm text-muted-foreground">
                      {getDocumentStatusLabel(doc.status)}
                      {doc.rejectionReason ? ` · ${doc.rejectionReason}` : ""}
                    </p>
                    {expiry !== "none" ? (
                      <p
                        className={cn(
                          "mt-1 text-caption",
                          expiry === "expired"
                            ? "text-destructive"
                            : expiry === "expiring_soon"
                              ? "text-orange"
                              : "text-muted-foreground",
                        )}
                      >
                        {expiry === "expired"
                          ? "Expired"
                          : expiry === "expiring_soon"
                            ? "Expiring soon"
                            : "Valid"}
                        {doc.expiresAt
                          ? ` · ${new Date(doc.expiresAt).toLocaleDateString()}`
                          : ""}
                      </p>
                    ) : null}
                  </div>
                  <a
                    href={doc.fileUrl}
                    className="text-sm font-medium text-olive underline-offset-2 hover:underline"
                    target="_blank"
                    rel="noreferrer"
                  >
                    View (mock)
                  </a>
                </div>
              </li>
            );
          })}
        </ul>
      </DataState>

      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="space-y-4 rounded-2xl border border-border bg-warm-white p-5 shadow-soft"
      >
        <h2 className="text-h3">Upload document (mock)</h2>
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="type">Type</Label>
            <select
              id="type"
              className="flex h-10 w-full rounded-md border border-input bg-background px-3 text-sm"
              {...form.register("type")}
            >
              <option value="DRIVERS_LICENSE">Driving licence</option>
              <option value="IDENTITY">Identity document</option>
              <option value="BACKGROUND_CHECK">Background verification</option>
              <option value="PROFILE_PHOTO">Profile photo</option>
            </select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="fileName">File name</Label>
            <Input id="fileName" {...form.register("fileName")} />
          </div>
        </div>
        {form.formState.errors.root ? (
          <p className="text-sm text-destructive" role="alert">
            {form.formState.errors.root.message}
          </p>
        ) : null}
        <Button type="submit" disabled={upload.isPending}>
          {upload.isPending ? "Uploading…" : "Upload mock document"}
        </Button>
      </form>
    </div>
  );
}
