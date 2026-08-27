import { OtpForm } from "@/features/auth/otp-form";
import { privatePageMetadata } from "@/lib/seo";

export const metadata = privatePageMetadata("Verify OTP");

export default function VerifyOtpPage() {
  return (
    <section>
      <h1 className="text-h2">Verify OTP</h1>
      <p className="mt-2 text-sm text-muted-foreground">
        Paste-friendly 6-digit code. Development only — not secure production auth.
      </p>
      <div className="mt-8">
        <OtpForm />
      </div>
    </section>
  );
}
