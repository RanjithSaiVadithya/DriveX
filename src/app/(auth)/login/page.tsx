import { LoginForm } from "@/features/auth/login-form";
import { RedirectIfAuthenticated } from "@/components/shared/require-auth";
import { privatePageMetadata } from "@/lib/seo";

export const metadata = privatePageMetadata("Log in");

export default function LoginPage() {
  return (
    <RedirectIfAuthenticated>
      <section>
        <h1 className="text-h2">Welcome back</h1>
        <p className="text-muted-foreground mt-2 text-sm">
          Enter your phone number to continue. We&apos;ll send a six-digit verification
          code.
        </p>
        <div className="mt-8">
          <LoginForm />
        </div>
      </section>
    </RedirectIfAuthenticated>
  );
}
