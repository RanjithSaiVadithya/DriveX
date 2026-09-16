"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { signupSchema, type SignupInput } from "@/schemas/auth.schema";
import { useAuth } from "@/hooks/use-auth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { authRoutes } from "@/config/routes";
import { isAppError } from "@/services/domain/errors";
import type { ActiveRole } from "@/types/auth";

function SignupFormInner() {
  const router = useRouter();
  const params = useSearchParams();
  const preferredRole =
    params.get("role") === "driver" ? ("DRIVER" as ActiveRole) : undefined;
  const { signup } = useAuth();
  const form = useForm<SignupInput>({
    resolver: zodResolver(signupSchema),
    defaultValues: { name: "", email: "", phone: "" },
  });

  async function onSubmit(values: SignupInput) {
    try {
      const res = await signup.mutateAsync({
        ...values,
        preferredRole,
      });
      toast.success("Account created successfully");
      const qs = new URLSearchParams({
        email: res.data.email,
        phone: values.phone,
      });
      if (preferredRole) qs.set("role", preferredRole.toLowerCase());
      router.push(`${authRoutes.verifyOtp}?${qs.toString()}`);
    } catch (error) {
      form.setError("root", {
        message: isAppError(error) ? error.message : "Signup failed",
      });
    }
  }

  return (
    <form className="space-y-4" onSubmit={form.handleSubmit(onSubmit)} noValidate>
      {(
        [
          ["name", "Full name", "text", "name"],
          ["phone", "Phone", "tel", "tel"],
          ["email", "Email", "email", "email"],
        ] as const
      ).map(([key, label, type, autoComplete]) => (
        <div key={key} className="space-y-2">
          <Label htmlFor={key}>{label}</Label>
          <Input
            id={key}
            type={type}
            autoComplete={autoComplete}
            className="h-12"
            {...form.register(key)}
          />
          {form.formState.errors[key] ? (
            <p className="text-sm text-destructive">
              {form.formState.errors[key]?.message}
            </p>
          ) : null}
        </div>
      ))}
      {preferredRole === "DRIVER" ? (
        <p className="rounded-md bg-olive/10 px-3 py-2 text-sm text-deep-navy">
          You&apos;re signing up to drive with DriverDosth.
        </p>
      ) : null}
      {form.formState.errors.root ? (
        <p className="text-sm text-destructive" role="alert">
          {form.formState.errors.root.message}
        </p>
      ) : null}
      <Button type="submit" className="w-full" size="lg" disabled={signup.isPending}>
        {signup.isPending ? "Creating account…" : "Create account"}
      </Button>
      <p className="text-center text-sm text-muted-foreground">
        Already registered?{" "}
        <Link href={authRoutes.login} className="font-semibold text-olive hover:underline">
          Log in
        </Link>
      </p>
    </form>
  );
}

export function SignupForm() {
  return (
    <Suspense fallback={<p className="text-sm text-muted-foreground">Loading…</p>}>
      <SignupFormInner />
    </Suspense>
  );
}
