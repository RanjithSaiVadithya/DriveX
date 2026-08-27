"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { savedPlacesApi } from "@/services/api/saved-places.api";
import type { SavedPlaceInput } from "@/schemas/saved-place.schema";
import { useAuth } from "./use-auth";

export function useSavedPlaces() {
  const { isAuthenticated } = useAuth();
  const queryClient = useQueryClient();

  const listQuery = useQuery({
    queryKey: ["saved-places"],
    queryFn: async () => {
      const res = await savedPlacesApi.list();
      return res.data;
    },
    enabled: isAuthenticated,
  });

  const createPlace = useMutation({
    mutationFn: (payload: SavedPlaceInput) => savedPlacesApi.create(payload),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ["saved-places"] });
    },
  });

  const updatePlace = useMutation({
    mutationFn: ({
      id,
      payload,
    }: {
      id: string;
      payload: Partial<SavedPlaceInput>;
    }) => savedPlacesApi.update(id, payload),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ["saved-places"] });
    },
  });

  const deletePlace = useMutation({
    mutationFn: (id: string) => savedPlacesApi.remove(id),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ["saved-places"] });
    },
  });

  return { listQuery, createPlace, updatePlace, deletePlace };
}
