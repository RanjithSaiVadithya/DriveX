import { apiClient } from "./client";
import { endpoints } from "./endpoints";
import type { ApiCollectionResponse, ApiSuccessResponse } from "@/types/api";
import type { UserVehicle } from "@/types/vehicle";
import type { UserVehicleInput } from "@/schemas/vehicle.schema";

export const userVehiclesApi = {
  list() {
    return apiClient<ApiCollectionResponse<UserVehicle>>(
      endpoints.userVehicles.list,
    );
  },
  get(id: string) {
    return apiClient<ApiSuccessResponse<UserVehicle>>(
      endpoints.userVehicles.detail(id),
    );
  },
  create(payload: UserVehicleInput) {
    return apiClient<ApiSuccessResponse<UserVehicle>>(
      endpoints.userVehicles.create,
      { method: "POST", body: payload },
    );
  },
  update(id: string, payload: Partial<UserVehicleInput>) {
    return apiClient<ApiSuccessResponse<UserVehicle>>(
      endpoints.userVehicles.update(id),
      { method: "PATCH", body: payload },
    );
  },
  remove(id: string) {
    return apiClient<ApiSuccessResponse<null>>(
      endpoints.userVehicles.remove(id),
      { method: "DELETE" },
    );
  },
};
