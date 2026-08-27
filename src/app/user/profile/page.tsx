"use client";

import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import Link from "next/link";
import { useAuth } from "@/hooks/use-auth";
import { useAuthStore } from "@/stores/auth.store";
import { usersApi } from "@/services/api/users.api";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Button, buttonVariants } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { userProfileSchema, type UserProfileInput } from "@/schemas/user.schema";
import { userRoutes, authRoutes } from "@/config/routes";
import { isAppError } from "@/services/domain/errors";
import { cn } from "@/lib/utils";

export default function ProfilePage() {
  const { user, logout } = useAuth();
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

  async function onSubmit(values: UserProfileInput) {
    try {
      await save.mutateAsync(values);
    } catch (err) {
      form.setError("root", {
        message: isAppError(err) ? err.message : "Unable to update profile",
      });
    }
  }

  return (
    <div className="mx-auto max-w-xl space-y-8">
      <div>
        <h1 className="text-h1">Profile</h1>
        <p className="mt-2 text-muted-foreground">Personal information and account.</p>
      </div>

      <form
        className="space-y-4 rounded-2xl border border-border bg-warm-white p-5 shadow-soft"
        onSubmit={form.handleSubmit(onSubmit)}
        noValidate
      >
        <h2 className="text-h3">Personal information</h2>
        {(
          [
            ["name", "Name", "text"],
            ["phone", "Phone", "tel"],
            ["email", "Email", "email"],
          ] as const
        ).map(([key, label, type]) => (
          <div key={key} className="space-y-2">
            <Label htmlFor={key}>{label}</Label>
            <Input id={key} type={type} {...form.register(key)} />
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

      <section className="rounded-2xl border border-border bg-warm-white p-5 shadow-soft space-y-3">
        <h2 className="text-h3">Preferences</h2>
        <div className="flex flex-wrap gap-2">
          <Link href={userRoutes.vehicles} className={cn(buttonVariants({ variant: "outline" }))}>
            My Vehicles
          </Link>
          <Link href={userRoutes.savedPlaces} className={cn(buttonVariants({ variant: "outline" }))}>
            Manage saved places
          </Link>
        </div>
      </section>

      <section className="rounded-2xl border border-border bg-warm-white p-5 shadow-soft">
        <h2 className="text-h3">Account</h2>
        <Button
          type="button"
          variant="destructive"
          className="mt-4"
          onClick={() => {
            logout.mutate();
            window.location.href = authRoutes.login;
          }}
        >
          Log out
        </Button>
      </section>
    </div>
  );
}
