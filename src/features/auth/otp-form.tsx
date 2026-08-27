"use client";

import {
  useCallback,
  useEffect,
  useRef,
  useState,
  Suspense,
  type ClipboardEvent,
  type KeyboardEvent,
} from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { toast } from "sonner";
import { useAuth } from "@/hooks/use-auth";
import { Button } from "@/components/ui/button";
import { authRoutes } from "@/config/routes";
import { isAppError } from "@/services/domain/errors";
import { MOCK_OTP } from "@/lib/constants";

const LENGTH = 6;
const RESEND_SECONDS = 30;

function OtpFormInner() {
  const router = useRouter();
  const params = useSearchParams();
  const email = params.get("email") ?? "";
  const { verifyOtp, resendOtp } = useAuth();
  const [digits, setDigits] = useState<string[]>(Array(LENGTH).fill(""));
  const [error, setError] = useState<string | null>(null);
  const [seconds, setSeconds] = useState(RESEND_SECONDS);
  const inputs = useRef<Array<HTMLInputElement | null>>([]);

  useEffect(() => {
    if (!email) {
      router.replace(authRoutes.login);
    }
  }, [email, router]);

  useEffect(() => {
    if (seconds <= 0) return;
    const id = window.setInterval(() => setSeconds((s) => s - 1), 1000);
    return () => window.clearInterval(id);
  }, [seconds]);

  const otpValue = digits.join("");

  const submit = useCallback(
    async (code: string) => {
      if (!email || code.length !== LENGTH) return;
      setError(null);
      try {
        await verifyOtp.mutateAsync({ email, otp: code });
        toast.success("OTP verified");
        router.push(authRoutes.selectRole);
      } catch (err) {
        setError(isAppError(err) ? err.message : "Verification failed");
        setDigits(Array(LENGTH).fill(""));
        inputs.current[0]?.focus();
      }
    },
    [email, router, verifyOtp],
  );

  function updateDigit(index: number, value: string) {
    const char = value.replace(/\D/g, "").slice(-1);
    const next = [...digits];
    next[index] = char;
    setDigits(next);
    if (char && index < LENGTH - 1) {
      inputs.current[index + 1]?.focus();
    }
    if (next.every(Boolean)) {
      void submit(next.join(""));
    }
  }

  function onKeyDown(index: number, event: KeyboardEvent<HTMLInputElement>) {
    if (event.key === "Backspace" && !digits[index] && index > 0) {
      inputs.current[index - 1]?.focus();
    }
  }

  function onPaste(event: ClipboardEvent<HTMLInputElement>) {
    event.preventDefault();
    const text = event.clipboardData.getData("text").replace(/\D/g, "").slice(0, LENGTH);
    if (!text) return;
    const next = Array(LENGTH)
      .fill("")
      .map((_, i) => text[i] ?? "");
    setDigits(next);
    const focusAt = Math.min(text.length, LENGTH - 1);
    inputs.current[focusAt]?.focus();
    if (text.length === LENGTH) void submit(text);
  }

  async function handleResend() {
    if (seconds > 0 || !email) return;
    try {
      await resendOtp.mutateAsync(email);
      toast.success("OTP sent");
      setSeconds(RESEND_SECONDS);
      setDigits(Array(LENGTH).fill(""));
      inputs.current[0]?.focus();
    } catch (err) {
      setError(isAppError(err) ? err.message : "Could not resend OTP");
    }
  }

  return (
    <div className="space-y-6">
      <p className="text-sm text-muted-foreground">
        Enter the 6-digit code sent to{" "}
        <span className="font-medium text-deep-navy">{email || "your account"}</span>.
        Development OTP: <span className="font-semibold">{MOCK_OTP}</span>
      </p>
      <div className="flex justify-between gap-2" onPaste={onPaste}>
        {digits.map((digit, index) => (
          <input
            key={index}
            ref={(el) => {
              inputs.current[index] = el;
            }}
            inputMode="numeric"
            autoComplete={index === 0 ? "one-time-code" : "off"}
            aria-label={`Digit ${index + 1}`}
            className="h-12 w-11 rounded-md border border-input bg-warm-white text-center text-lg font-semibold text-deep-navy outline-none focus-visible:ring-2 focus-visible:ring-olive/40 sm:h-14 sm:w-12"
            value={digit}
            onChange={(e) => updateDigit(index, e.target.value)}
            onKeyDown={(e) => onKeyDown(index, e)}
            maxLength={1}
          />
        ))}
      </div>
      {error ? (
        <p className="text-sm text-destructive" role="alert">
          {error}
        </p>
      ) : null}
      <Button
        type="button"
        className="w-full"
        size="lg"
        disabled={otpValue.length !== LENGTH || verifyOtp.isPending}
        onClick={() => void submit(otpValue)}
      >
        {verifyOtp.isPending ? "Verifying…" : "Verify OTP"}
      </Button>
      <div className="text-center text-sm text-muted-foreground">
        {seconds > 0 ? (
          <p>Resend available in {seconds}s</p>
        ) : (
          <button
            type="button"
            className="font-semibold text-olive hover:underline"
            onClick={() => void handleResend()}
            disabled={resendOtp.isPending}
          >
            {resendOtp.isPending ? "Sending…" : "Resend OTP"}
          </button>
        )}
      </div>
    </div>
  );
}

export function OtpForm() {
  return (
    <Suspense fallback={<p className="text-sm text-muted-foreground">Loading…</p>}>
      <OtpFormInner />
    </Suspense>
  );
}
