"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { DataState } from "@/components/shared/data-state";
import { VehicleCard } from "@/components/shared/domain-cards";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useUserVehicles } from "@/hooks/use-user-vehicles";
import {
  userVehicleSchema,
  type UserVehicleInput,
} from "@/schemas/vehicle.schema";
import { isAppError } from "@/services/domain/errors";

const defaultValues: UserVehicleInput = {
  make: "",
  model: "",
  year: new Date().getFullYear(),
  registrationNumber: "",
  color: "",
  vehicleType: "SEDAN",
  capacity: 4,
};

export default function MyVehiclesPage() {
  const { listQuery, createVehicle, updateVehicle, deleteVehicle } =
    useUserVehicles();
  const [editingId, setEditingId] = useState<string | null>(null);
  const form = useForm<UserVehicleInput>({
    resolver: zodResolver(userVehicleSchema),
    defaultValues,
  });

  async function onSubmit(values: UserVehicleInput) {
    try {
      if (editingId) {
        await updateVehicle.mutateAsync({ id: editingId, payload: values });
        toast.success("Vehicle updated");
      } else {
        await createVehicle.mutateAsync(values);
        toast.success("Vehicle added");
      }
      setEditingId(null);
      form.reset(defaultValues);
    } catch (err) {
      form.setError("root", {
        message: isAppError(err) ? err.message : "Unable to save vehicle",
      });
    }
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-h1">My Vehicles</h1>
        <p className="mt-2 text-muted-foreground">
          Register the vehicles you own. When you book a driver, they drive one
          of your vehicles.
        </p>
      </div>

      <DataState
        isLoading={listQuery.isLoading}
        isError={listQuery.isError}
        errorMessage="Unable to load vehicles"
        onRetry={() => void listQuery.refetch()}
        isEmpty={(listQuery.data ?? []).length === 0}
        emptyTitle="No vehicles yet"
        emptyDescription="Add your car so you can book a driver for it."
      >
        <ul className="grid gap-3 sm:grid-cols-2">
          {(listQuery.data ?? []).map((vehicle) => (
            <li key={vehicle.id} className="space-y-2">
              <VehicleCard
                name={`${vehicle.make} ${vehicle.model}`}
                detail={`${vehicle.registrationNumber} · ${vehicle.color} · ${vehicle.vehicleType}`}
              />
              <div className="flex gap-2">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    setEditingId(vehicle.id);
                    form.reset({
                      make: vehicle.make,
                      model: vehicle.model,
                      year: vehicle.year,
                      registrationNumber: vehicle.registrationNumber,
                      color: vehicle.color,
                      vehicleType: vehicle.vehicleType,
                      capacity: vehicle.capacity,
                    });
                  }}
                >
                  Edit
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={async () => {
                    try {
                      await deleteVehicle.mutateAsync(vehicle.id);
                      toast.success("Vehicle removed");
                      if (editingId === vehicle.id) {
                        setEditingId(null);
                        form.reset(defaultValues);
                      }
                    } catch (err) {
                      toast.error(
                        isAppError(err) ? err.message : "Unable to delete",
                      );
                    }
                  }}
                >
                  Delete
                </Button>
              </div>
            </li>
          ))}
        </ul>
      </DataState>

      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="space-y-4 rounded-2xl border border-border bg-warm-white p-5 shadow-soft"
      >
        <h2 className="text-h3">{editingId ? "Edit vehicle" : "Add vehicle"}</h2>
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="make">Make</Label>
            <Input id="make" {...form.register("make")} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="model">Model</Label>
            <Input id="model" {...form.register("model")} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="year">Year</Label>
            <Input
              id="year"
              type="number"
              {...form.register("year", { valueAsNumber: true })}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="registrationNumber">Registration</Label>
            <Input
              id="registrationNumber"
              {...form.register("registrationNumber")}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="color">Color</Label>
            <Input id="color" {...form.register("color")} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="vehicleType">Type</Label>
            <select
              id="vehicleType"
              className="flex h-10 w-full rounded-md border border-input bg-background px-3 text-sm"
              {...form.register("vehicleType")}
            >
              <option value="HATCHBACK">Hatchback</option>
              <option value="SEDAN">Sedan</option>
              <option value="SUV">SUV</option>
              <option value="PREMIUM">Premium</option>
            </select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="capacity">Capacity</Label>
            <Input
              id="capacity"
              type="number"
              {...form.register("capacity", { valueAsNumber: true })}
            />
          </div>
        </div>
        {form.formState.errors.root ? (
          <p className="text-sm text-destructive" role="alert">
            {form.formState.errors.root.message}
          </p>
        ) : null}
        <div className="flex gap-2">
          <Button type="submit" disabled={createVehicle.isPending || updateVehicle.isPending}>
            {editingId ? "Save changes" : "Add vehicle"}
          </Button>
          {editingId ? (
            <Button
              type="button"
              variant="outline"
              onClick={() => {
                setEditingId(null);
                form.reset(defaultValues);
              }}
            >
              Cancel
            </Button>
          ) : null}
        </div>
      </form>
    </div>
  );
}
