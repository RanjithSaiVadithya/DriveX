import { SignupForm } from "@/features/auth/signup-form";
import { RedirectIfAuthenticated } from "@/components/shared/require-auth";
import { privatePageMetadata } from "@/lib/seo";

export const metadata = privatePageMetadata("Sign up");

export default function SignupPage() {
  return (
    <RedirectIfAuthenticated>
      <section>
        <h1 className="text-h2">Create your account</h1>
        <p className="text-muted-foreground mt-2 text-sm">
          Add your details and verify your phone to get started.
        </p>
        <div className="mt-8">
          <SignupForm />
        </div>
      </section>
    </RedirectIfAuthenticated>
  );
}
