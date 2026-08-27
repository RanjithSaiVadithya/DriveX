"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { DataState } from "@/components/shared/data-state";
import { LocationCard } from "@/components/shared/domain-cards";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useSavedPlaces } from "@/hooks/use-saved-places";
import {
  savedPlaceSchema,
  type SavedPlaceInput,
} from "@/schemas/saved-place.schema";
import { mockLocations } from "@/config/locations";
import { isAppError } from "@/services/domain/errors";

export default function SavedPlacesPage() {
  const { listQuery, createPlace, updatePlace, deletePlace } = useSavedPlaces();
  const [editingId, setEditingId] = useState<string | null>(null);
  const form = useForm<SavedPlaceInput>({
    resolver: zodResolver(savedPlaceSchema),
    defaultValues: {
      label: "Home",
      address: "",
      latitude: 12.97,
      longitude: 77.59,
    },
  });

  async function onSubmit(values: SavedPlaceInput) {
    try {
      if (editingId) {
        await updatePlace.mutateAsync({ id: editingId, payload: values });
        toast.success("Place updated");
      } else {
        await createPlace.mutateAsync(values);
        toast.success("Place saved");
      }
      setEditingId(null);
      form.reset({
        label: "Home",
        address: "",
        latitude: 12.97,
        longitude: 77.59,
      });
    } catch (err) {
      form.setError("root", {
        message: isAppError(err) ? err.message : "Unable to save place",
      });
    }
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-h1">Saved places</h1>
        <p className="mt-2 text-muted-foreground">
          Home, Work, and other locations for faster booking.
        </p>
      </div>

      <DataState
        isLoading={listQuery.isLoading}
        isError={listQuery.isError}
        errorMessage="Unable to load saved places"
        onRetry={() => void listQuery.refetch()}
        isEmpty={(listQuery.data ?? []).length === 0}
        emptyTitle="No saved places yet"
        emptyDescription="Add Home or Work to use them while booking."
      >
        <ul className="grid gap-3 sm:grid-cols-2">
          {(listQuery.data ?? []).map((place) => (
            <li key={place.id} className="space-y-2">
              <LocationCard label={place.label} address={place.address} />
              <div className="flex gap-2">
                <Button
                  type="button"
                  size="sm"
                  variant="outline"
                  onClick={() => {
                    setEditingId(place.id);
                    form.reset({
                      label: place.label,
                      address: place.address,
                      latitude: place.latitude,
                      longitude: place.longitude,
                    });
                  }}
                >
                  Edit
                </Button>
                <Button
                  type="button"
                  size="sm"
                  variant="destructive"
                  disabled={deletePlace.isPending}
                  onClick={() => void deletePlace.mutateAsync(place.id)}
                >
                  Delete
                </Button>
              </div>
            </li>
          ))}
        </ul>
      </DataState>

      <section className="rounded-2xl border border-border bg-warm-white p-5 shadow-soft">
        <h2 className="text-h3">{editingId ? "Edit place" : "Add place"}</h2>
        <form className="mt-4 space-y-4" onSubmit={form.handleSubmit(onSubmit)} noValidate>
          <div className="space-y-2">
            <Label htmlFor="label">Label</Label>
            <Input id="label" {...form.register("label")} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="address">Address</Label>
            <Input id="address" {...form.register("address")} />
          </div>
          <div className="grid gap-3 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="latitude">Latitude</Label>
              <Input
                id="latitude"
                type="number"
                step="any"
                {...form.register("latitude", { valueAsNumber: true })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="longitude">Longitude</Label>
              <Input
                id="longitude"
                type="number"
                step="any"
                {...form.register("longitude", { valueAsNumber: true })}
              />
            </div>
          </div>
          <div>
            <p className="mb-2 text-sm text-muted-foreground">Quick fill from mock locations</p>
            <div className="flex flex-wrap gap-2">
              {mockLocations.slice(0, 4).map((loc) => (
                <Button
                  key={loc.id}
                  type="button"
                  size="sm"
                  variant="outline"
                  onClick={() =>
                    form.reset({
                      label: loc.label,
                      address: loc.address,
                      latitude: loc.latitude,
                      longitude: loc.longitude,
                    })
                  }
                >
                  {loc.label}
                </Button>
              ))}
            </div>
          </div>
          {form.formState.errors.root ? (
            <p className="text-sm text-destructive">{form.formState.errors.root.message}</p>
          ) : null}
          <Button type="submit" disabled={createPlace.isPending || updatePlace.isPending}>
            {editingId ? "Update place" : "Save place"}
          </Button>
        </form>
      </section>
    </div>
  );
}
