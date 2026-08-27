"use client";

import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { useAuth } from "@/hooks/use-auth";
import { useDriver } from "@/hooks/use-driver";
import { useAuthStore } from "@/stores/auth.store";
import { usersApi } from "@/services/api/users.api";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { DataState } from "@/components/shared/data-state";
import { userProfileSchema, type UserProfileInput } from "@/schemas/user.schema";
import { isAppError } from "@/services/domain/errors";

export default function DriverProfilePage() {
  const { user } = useAuth();
  const { data: driver, isLoading, isError, refetch } = useDriver();
  const queryClient = useQueryClient();
  const form = useForm<UserProfileInput>({
    resolver: zodResolver(userProfileSchema),
    defaultValues: {
      name: user?.name ?? "",
      phone: user?.phone ?? "",
      email: user?.email ?? "",
      avatar: user?.avatar ?? null,
    },
  });

  useEffect(() => {
    if (!user) return;
    form.reset({
      name: user.name,
      phone: user.phone,
      email: user.email,
      avatar: user.avatar ?? null,
    });
  }, [user, form]);

  const save = useMutation({
    mutationFn: (payload: UserProfileInput) => usersApi.updateMe(payload),
    onSuccess: (res) => {
      const current = useAuthStore.getState().session;
      if (current) {
        useAuthStore.getState().setUser({
          id: res.data.id,
          name: res.data.name,
          phone: res.data.phone,
          email: res.data.email,
          avatar: res.data.avatar,
          role: res.data.role,
          status: res.data.status,
        });
      }
      toast.success("Profile updated");
      void queryClient.invalidateQueries({ queryKey: ["auth"] });
      void queryClient.invalidateQueries({ queryKey: ["users", "me"] });
    },
  });

  return (
    <div className="mx-auto max-w-xl space-y-8">
      <div>
        <h1 className="text-h1">Profile</h1>
        <p className="mt-2 text-muted-foreground">
          Personal information and driver verification. Drivers do not manage
          vehicles here.
        </p>
      </div>

      <DataState
        isLoading={isLoading}
        isError={isError}
        errorMessage="Unable to load driver profile"
        onRetry={() => void refetch()}
        isEmpty={false}
      >
        <div className="rounded-2xl border border-border bg-warm-white p-5 shadow-soft">
          <dl className="grid gap-3 text-sm sm:grid-cols-2">
            <div>
              <dt className="text-muted-foreground">Rating</dt>
              <dd className="font-semibold text-deep-navy">
                ★ {driver?.rating?.toFixed(1) ?? "—"}
              </dd>
            </div>
            <div>
              <dt className="text-muted-foreground">Total trips</dt>
              <dd className="font-semibold text-deep-navy">
                {driver?.totalTrips ?? 0}
              </dd>
            </div>
            <div>
              <dt className="text-muted-foreground">Verification</dt>
              <dd className="font-semibold text-deep-navy">
                {driver?.verificationStatus ?? "—"}
              </dd>
            </div>
            <div>
              <dt className="text-muted-foreground">Availability</dt>
              <dd className="font-semibold text-deep-navy">
                {driver?.availability ?? "—"}
              </dd>
            </div>
          </dl>
        </div>
      </DataState>

      <form
        onSubmit={form.handleSubmit(async (values) => {
          try {
            await save.mutateAsync(values);
          } catch (err) {
            form.setError("root", {
              message: isAppError(err) ? err.message : "Unable to update profile",
            });
          }
        })}
        className="space-y-4 rounded-2xl border border-border bg-warm-white p-5 shadow-soft"
      >
        <h2 className="text-h3">Personal information</h2>
        {(
          [
            ["name", "Name"],
            ["phone", "Phone"],
            ["email", "Email"],
          ] as const
        ).map(([key, label]) => (
          <div key={key} className="space-y-2">
            <Label htmlFor={key}>{label}</Label>
            <Input id={key} {...form.register(key)} />
            {form.formState.errors[key] ? (
              <p className="text-sm text-destructive">
                {form.formState.errors[key]?.message}
              </p>
            ) : null}
          </div>
        ))}
        {form.formState.errors.root ? (
          <p className="text-sm text-destructive">{form.formState.errors.root.message}</p>
        ) : null}
        <Button type="submit" disabled={save.isPending}>
          {save.isPending ? "Saving…" : "Save changes"}
        </Button>
      </form>
    </div>
  );
}
