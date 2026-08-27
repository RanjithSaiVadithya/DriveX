"use client";

import Link from "next/link";
import { Menu } from "lucide-react";
import { DriveXLogo } from "@/components/shared/logo";
import { PageContainer } from "@/components/shared/page-container";
import { buttonVariants } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { publicNavItems, publicContent } from "@/config/content";
import { authRoutes, publicRoutes } from "@/config/routes";
import { useAuth } from "@/hooks/use-auth";
import { getHomeForRole } from "@/services/domain/role-permissions";
import { cn } from "@/lib/utils";
import { useState } from "react";

export function SiteHeader() {
  const { isAuthenticated, role, isHydrated } = useAuth();
  const [open, setOpen] = useState(false);
  const appHref =
    isHydrated && isAuthenticated && role ? getHomeForRole(role) : authRoutes.login;

  return (
    <header className="sticky top-0 z-40 border-b border-border/80 bg-warm-white/90 backdrop-blur-md">
      <PageContainer className="flex h-16 items-center justify-between gap-4">
        <DriveXLogo />

        <nav aria-label="Primary" className="hidden items-center gap-1 lg:flex">
          {publicNavItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="rounded-md px-3 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-muted hover:text-deep-navy"
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="hidden items-center gap-2 lg:flex">
          <Link
            href={publicRoutes.driveWithUs}
            className={cn(buttonVariants({ variant: "ghost", size: "sm" }))}
          >
            Drive With Us
          </Link>
          <Link
            href={isAuthenticated ? appHref : authRoutes.login}
            className={cn(buttonVariants({ variant: "navy", size: "sm" }))}
          >
            {isAuthenticated ? "Open app" : "Book a Driver"}
          </Link>
          <a
            href="#download-app"
            className={cn(buttonVariants({ variant: "default", size: "sm" }))}
          >
            Download App
          </a>
        </div>

        <Sheet open={open} onOpenChange={setOpen}>
          <SheetTrigger
            className={cn(
              buttonVariants({ variant: "outline", size: "icon" }),
              "lg:hidden",
            )}
            aria-label="Open menu"
          >
            <Menu className="size-5" />
          </SheetTrigger>
          <SheetContent side="right" className="w-[min(100%,20rem)] bg-warm-white">
            <SheetHeader>
              <SheetTitle className="text-left">
                <DriveXLogo asLink={false} size="sm" />
              </SheetTitle>
            </SheetHeader>
            <nav aria-label="Mobile" className="mt-6 flex flex-col gap-1">
              {publicNavItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setOpen(false)}
                  className="rounded-md px-3 py-3 text-base font-medium text-deep-navy hover:bg-muted"
                >
                  {item.label}
                </Link>
              ))}
              <Link
                href={publicRoutes.driveWithUs}
                onClick={() => setOpen(false)}
                className="rounded-md px-3 py-3 text-base font-medium text-deep-navy hover:bg-muted"
              >
                Drive With Us
              </Link>
              <Link
                href={isAuthenticated ? appHref : authRoutes.login}
                onClick={() => setOpen(false)}
                className="rounded-md px-3 py-3 text-base font-medium text-deep-navy hover:bg-muted"
              >
                {isAuthenticated ? "Open app" : "Log in"}
              </Link>
            </nav>
            <div className="mt-6 space-y-3 border-t border-border pt-6">
              <Link
                href={authRoutes.login}
                onClick={() => setOpen(false)}
                className={cn(buttonVariants({ variant: "navy", size: "lg" }), "w-full")}
              >
                {publicContent.hero.primaryCta}
              </Link>
              <a
                href="#download-app"
                onClick={() => setOpen(false)}
                className={cn(
                  buttonVariants({ variant: "default", size: "lg" }),
                  "w-full",
                )}
              >
                Download App
              </a>
            </div>
          </SheetContent>
        </Sheet>
      </PageContainer>
    </header>
  );
}
