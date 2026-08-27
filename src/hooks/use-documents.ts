"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { documentsApi } from "@/services/api/documents.api";
import type { MockDocumentUploadInput } from "@/schemas/document.schema";
import { useAuth } from "./use-auth";

export function useDocuments() {
  const { isAuthenticated, role } = useAuth();
  const queryClient = useQueryClient();

  const listQuery = useQuery({
    queryKey: ["documents"],
    queryFn: async () => (await documentsApi.list()).data,
    enabled: isAuthenticated && role === "DRIVER",
  });

  const upload = useMutation({
    mutationFn: (payload: MockDocumentUploadInput) =>
      documentsApi.create(payload),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ["documents"] });
      void queryClient.invalidateQueries({ queryKey: ["drivers", "me"] });
      void queryClient.invalidateQueries({ queryKey: ["notifications"] });
    },
  });

  return { listQuery, upload };
}
