import { OtpForm } from "@/features/auth/otp-form";
import { privatePageMetadata } from "@/lib/seo";

export const metadata = privatePageMetadata("Verify OTP");

export default function VerifyOtpPage() {
  return (
    <section>
      <h1 className="text-h2">Verify OTP</h1>
      <p className="text-muted-foreground mt-2 text-sm">
        Enter the six-digit verification code sent to your phone.
      </p>
      <div className="mt-8">
        <OtpForm />
      </div>
    </section>
  );
}
