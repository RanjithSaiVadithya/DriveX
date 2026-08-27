import { apiClient } from "./client";
import { endpoints } from "./endpoints";
import type { ApiCollectionResponse, ApiSuccessResponse } from "@/types/api";
import type { SavedPlace } from "@/types/saved-place";
import type { SavedPlaceInput } from "@/schemas/saved-place.schema";

export const savedPlacesApi = {
  list() {
    return apiClient<ApiCollectionResponse<SavedPlace>>(
      endpoints.savedPlaces.list,
    );
  },
  create(payload: SavedPlaceInput) {
    return apiClient<ApiSuccessResponse<SavedPlace>>(
      endpoints.savedPlaces.create,
      { method: "POST", body: payload },
    );
  },
  update(id: string, payload: Partial<SavedPlaceInput>) {
    return apiClient<ApiSuccessResponse<SavedPlace>>(
      endpoints.savedPlaces.update(id),
      { method: "PATCH", body: payload },
    );
  },
  remove(id: string) {
    return apiClient<ApiSuccessResponse<null>>(
      endpoints.savedPlaces.remove(id),
      { method: "DELETE" },
    );
  },
};
