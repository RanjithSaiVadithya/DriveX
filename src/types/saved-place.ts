import type { Address } from "./address";

export interface SavedPlace {
  id: string;
  userId: string;
  label: string;
  address: string;
  latitude: number;
  longitude: number;
  createdAt: string;
}

export type SavedPlaceInput = Omit<SavedPlace, "id" | "createdAt"> &
  Partial<Pick<Address, "label">>;
