"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { loginSchema, type LoginInput } from "@/schemas/auth.schema";
import { useAuth } from "@/hooks/use-auth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { authRoutes } from "@/config/routes";
import { getHomeForRole } from "@/services/domain/role-permissions";
import { isAppError } from "@/services/domain/errors";
import type { AuthSession, OtpChallenge } from "@/types/auth";

export function LoginForm() {
  const router = useRouter();
  const { login, isAuthSession } = useAuth();
  const form = useForm<LoginInput>({
    resolver: zodResolver(loginSchema),
    defaultValues: { phone: "" },
  });

  async function onSubmit(values: LoginInput) {
    try {
      const res = await login.mutateAsync({ phone: values.phone });
      if (isAuthSession(res.data as AuthSession | OtpChallenge)) {
        toast.success("Signed in");
        router.push(getHomeForRole((res.data as AuthSession).user.role));
        return;
      }
      const challenge = res.data as OtpChallenge;
      toast.success("OTP sent");
      router.push(
        `${authRoutes.verifyOtp}?email=${encodeURIComponent(challenge.email)}&phone=${encodeURIComponent(values.phone)}`,
      );
    } catch (error) {
      form.setError("root", {
        message: isAppError(error) ? error.message : "Could not continue",
      });
    }
  }

  return (
    <form className="space-y-5" onSubmit={form.handleSubmit(onSubmit)} noValidate>
      <div className="space-y-2">
        <Label htmlFor="phone">Phone number</Label>
        <Input
          id="phone"
          type="tel"
          inputMode="tel"
          autoComplete="tel"
          placeholder="+919800000001"
          className="h-12"
          {...form.register("phone")}
        />
        {form.formState.errors.phone ? (
          <p className="text-sm text-destructive">{form.formState.errors.phone.message}</p>
        ) : null}
      </div>
      {form.formState.errors.root ? (
        <p className="text-sm text-destructive" role="alert">
          {form.formState.errors.root.message}
        </p>
      ) : null}
      <Button type="submit" className="w-full" size="lg" disabled={login.isPending}>
        {login.isPending ? "Continue…" : "Continue"}
      </Button>
      <p className="text-center text-sm text-muted-foreground">
        Dev tip: try <span className="font-medium text-deep-navy">+919800000001</span>{" "}
        (user) or <span className="font-medium text-deep-navy">+919800000101</span>{" "}
        (driver). OTP is <span className="font-medium">123456</span>.
      </p>
      <p className="text-center text-sm text-muted-foreground">
        Don&apos;t have an account?{" "}
        <Link href={authRoutes.signup} className="font-semibold text-olive hover:underline">
          Sign up
        </Link>
      </p>
    </form>
  );
}
