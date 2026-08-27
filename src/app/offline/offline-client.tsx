"use client";

import Link from "next/link";
import { Button, buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export function OfflinePageClient() {
  return (
    <main className="mx-auto flex min-h-full max-w-md flex-col items-center justify-center gap-4 px-6 py-16 text-center">
      <p className="text-caption font-semibold uppercase tracking-wider text-orange">
        DriveX
      </p>
      <h1 className="text-h2 text-deep-navy">You appear to be offline</h1>
      <p className="text-muted-foreground">
        Booking, trip actions, payments, and wallet changes need a connection.
        Check your network and try again.
      </p>
      <div className="flex flex-wrap justify-center gap-2">
        <Button type="button" onClick={() => window.location.reload()}>
          Retry
        </Button>
        <Link href="/" className={cn(buttonVariants({ variant: "outline" }))}>
          Home
        </Link>
      </div>
    </main>
  );
}
