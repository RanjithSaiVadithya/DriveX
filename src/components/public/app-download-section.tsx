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
      <span className="text-warm-beige/80 text-[10px] tracking-wide uppercase">
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

  return <span className={className}>{content}</span>;
}

function InstallCta() {
  const { availability, canNativeInstall, install, isInstalled } = usePwaInstall();

  if (isInstalled) {
    return (
      <p className="text-muted-foreground text-sm">DriverDosth is installed on this device.</p>
    );
  }

  if (canNativeInstall) {
    return (
      <Button type="button" onClick={() => void install()}>
        Install DriverDosth
      </Button>
    );
  }

  if (availability === "ios-manual") {
    return (
      <p className="text-muted-foreground max-w-sm text-sm">
        On iPhone: open Share → <strong>Add to Home Screen</strong> to use DriverDosth like an
        app.
      </p>
    );
  }

  return (
    <Link href="/login" className={cn(buttonVariants())}>
      Use DriverDosth in your browser
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
            {hasAndroid ? (
              <StoreBadge
                label="Get it on"
                store="Google Play"
                href={env.androidAppUrl}
              />
            ) : null}
            {hasIos ? (
              <StoreBadge
                label="Download on the"
                store="App Store"
                href={env.iosAppUrl}
              />
            ) : null}
          </>
        ) : (
          <InstallCta />
        )}
      </div>
    );
  }

  return (
    <section
      className={cn(
        "public-section-compact border-border/80 bg-warm-white border-y",
        className,
      )}
    >
      <PageContainer className="flex flex-col items-start justify-between gap-8 md:flex-row md:items-center">
        <div className="max-w-lg">
          <h2 className="text-h2">Install DriverDosth</h2>
          <p className="text-muted-foreground mt-3">
            {hasAndroid || hasIos
              ? "Get DriverDosth from your store, or install it as an app on this device."
              : "Install DriverDosth on your device for faster booking, or continue in your browser today."}
          </p>
        </div>
        <div className="flex flex-col items-start gap-3">
          <InstallCta />
          {hasAndroid || hasIos ? (
            <div className="flex flex-wrap gap-3">
              {hasAndroid ? (
                <StoreBadge
                  label="Get it on"
                  store="Google Play"
                  href={env.androidAppUrl}
                />
              ) : null}
              {hasIos ? (
                <StoreBadge
                  label="Download on the"
                  store="App Store"
                  href={env.iosAppUrl}
                />
              ) : null}
            </div>
          ) : null}
        </div>
      </PageContainer>
    </section>
  );
}
