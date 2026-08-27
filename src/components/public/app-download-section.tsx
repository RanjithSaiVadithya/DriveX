"use client";

import Link from "next/link";
import { env } from "@/lib/env";
import { PageContainer } from "@/components/shared/page-container";
import { Button, buttonVariants } from "@/components/ui/button";
import { usePwaInstall } from "@/hooks/use-pwa-install";
import { cn } from "@/lib/utils";

function StoreBadge({
  label,
  store,
  href,
}: {
  label: string;
  store: string;
  href?: string;
}) {
  const className = cn(
    "inline-flex min-h-12 min-w-[10rem] flex-col items-start justify-center rounded-md border border-border bg-near-black px-4 py-2 text-left text-warm-white transition-opacity",
    href ? "hover:opacity-90" : "cursor-default opacity-80",
  );

  const content = (
    <>
      <span className="text-[10px] uppercase tracking-wide text-warm-beige/80">
        {label}
      </span>
      <span className="text-sm font-semibold">{store}</span>
    </>
  );

  if (href) {
    return (
      <a href={href} target="_blank" rel="noopener noreferrer" className={className}>
        {content}
      </a>
    );
  }

  return (
    <span className={className} title="Store link not configured">
      {content}
    </span>
  );
}

function InstallCta() {
  const { availability, canNativeInstall, install, isInstalled } = usePwaInstall();

  if (isInstalled) {
    return (
      <p className="text-sm text-muted-foreground">
        DriveX is installed on this device.
      </p>
    );
  }

  if (canNativeInstall) {
    return (
      <Button type="button" onClick={() => void install()}>
        Install DriveX
      </Button>
    );
  }

  if (availability === "ios-manual") {
    return (
      <p className="max-w-sm text-sm text-muted-foreground">
        On iPhone: open Share → <strong>Add to Home Screen</strong> to use DriveX
        like an app.
      </p>
    );
  }

  return (
    <Link href="/login" className={cn(buttonVariants())}>
      Use DriveX in your browser
    </Link>
  );
}

export function AppDownloadSection({
  className,
  compact = false,
}: {
  className?: string;
  compact?: boolean;
}) {
  const hasAndroid = Boolean(env.androidAppUrl);
  const hasIos = Boolean(env.iosAppUrl);

  if (compact) {
    return (
      <div className={cn("flex flex-wrap items-center gap-3", className)}>
        {hasAndroid || hasIos ? (
          <>
            <StoreBadge label="Get it on" store="Google Play" href={env.androidAppUrl} />
            <StoreBadge label="Download on the" store="App Store" href={env.iosAppUrl} />
          </>
        ) : (
          <InstallCta />
        )}
      </div>
    );
  }

  return (
    <section className={cn("border-y border-border/80 bg-warm-white py-14", className)}>
      <PageContainer className="flex flex-col items-start justify-between gap-8 md:flex-row md:items-center">
        <div className="max-w-lg">
          <h2 className="text-h2">Install DriveX</h2>
          <p className="mt-3 text-muted-foreground">
            {hasAndroid || hasIos
              ? "Get DriveX from your store, or install it as an app on this device."
              : "Use DriveX as an app on your device. Store listings will appear here when published — install the PWA or continue in the browser today."}
          </p>
        </div>
        <div className="flex flex-col items-start gap-3">
          <InstallCta />
          {hasAndroid || hasIos ? (
            <div className="flex flex-wrap gap-3">
              <StoreBadge label="Get it on" store="Google Play" href={env.androidAppUrl} />
              <StoreBadge
                label="Download on the"
                store="App Store"
                href={env.iosAppUrl}
              />
            </div>
          ) : null}
        </div>
      </PageContainer>
    </section>
  );
}
