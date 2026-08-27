import { apiClient } from "./client";
import { endpoints } from "./endpoints";
import type { ApiCollectionResponse, ApiSuccessResponse } from "@/types/api";
import type { Document } from "@/types/document";
import type { MockDocumentUploadInput } from "@/schemas/document.schema";

export const documentsApi = {
  list() {
    return apiClient<ApiCollectionResponse<Document>>(endpoints.documents.list);
  },
  create(payload: MockDocumentUploadInput) {
    return apiClient<ApiSuccessResponse<Document>>(endpoints.documents.create, {
      method: "POST",
      body: payload,
    });
  },
};
