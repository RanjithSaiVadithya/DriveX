import type { ReactNode } from "react";
import { DriveXLogo } from "@/components/shared/logo";
import { privatePageMetadata } from "@/lib/seo";

export const metadata = privatePageMetadata("Account", "DriveX authentication");

export default function AuthLayout({ children }: { children: ReactNode }) {
  return (
    <div className="grid min-h-full flex-1 lg:grid-cols-2">
      <aside className="relative hidden overflow-hidden bg-deep-navy text-warm-white lg:flex lg:flex-col lg:justify-between lg:p-10">
        <DriveXLogo variant="light" size="lg" />
        <div className="relative z-10 max-w-md">
          <p className="text-caption font-semibold uppercase tracking-[0.16em] text-orange">
            Safe. Reliable. Always.
          </p>
          <h1 className="mt-4 text-4xl font-bold leading-tight">
            Your driver,
            <br />
            your vehicle.
          </h1>
          <p className="mt-4 text-warm-beige/90">
            Mock authentication for development. Use OTP <strong>123456</strong> — not
            production-grade security.
          </p>
        </div>
        <div
          className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_80%_20%,rgba(224,120,58,0.35),transparent_40%),radial-gradient(circle_at_20%_80%,rgba(92,107,58,0.3),transparent_45%)]"
          aria-hidden
        />
        <p className="relative z-10 text-sm text-warm-beige/70">DriveX Phase 2</p>
      </aside>
      <div className="flex flex-1 flex-col bg-cream">
        <header className="border-b border-border/70 bg-warm-white px-4 py-4 lg:hidden">
          <DriveXLogo size="sm" />
        </header>
        <main className="mx-auto flex w-full max-w-md flex-1 flex-col justify-center px-4 py-10">
          {children}
        </main>
      </div>
    </div>
  );
}
