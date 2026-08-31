import type { ReactNode } from "react";
import { DriveXLogo } from "@/components/shared/logo";
import { privatePageMetadata } from "@/lib/seo";

export const metadata = privatePageMetadata("Account", "DriveX authentication");

export default function AuthLayout({ children }: { children: ReactNode }) {
  return (
    <div className="grid min-h-full flex-1 lg:grid-cols-2">
      <aside className="bg-deep-navy text-warm-white relative hidden overflow-hidden lg:flex lg:flex-col lg:justify-between lg:p-10">
        <DriveXLogo variant="light" size="lg" />
        <div className="relative z-10 max-w-md">
          <p className="text-caption text-orange font-semibold tracking-[0.16em] uppercase">
            Safe. Reliable. Always.
          </p>
          <h1 className="mt-4 text-4xl leading-tight font-bold">
            Your driver,
            <br />
            your vehicle.
          </h1>
          <p className="text-warm-beige/90 mt-4">
            Create a verified account to book a Driver or provide driving services with
            DriveX.
          </p>
        </div>
        <div
          className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_80%_20%,rgba(224,120,58,0.35),transparent_40%),radial-gradient(circle_at_20%_80%,rgba(92,107,58,0.3),transparent_45%)]"
          aria-hidden
        />
        <p className="text-warm-beige/70 relative z-10 text-sm">
          Clear trips. Trusted Drivers.
        </p>
      </aside>
      <div className="bg-cream flex flex-1 flex-col">
        <header className="border-border/70 bg-warm-white border-b px-4 py-4 lg:hidden">
          <DriveXLogo size="sm" />
        </header>
        <main className="mx-auto flex w-full max-w-md flex-1 flex-col justify-center px-4 py-10">
          {children}
        </main>
      </div>
    </div>
  );
}
