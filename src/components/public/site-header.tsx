"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
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
  const pathname = usePathname();
  const { isAuthenticated, role, isHydrated } = useAuth();
  const [open, setOpen] = useState(false);
  const appHref =
    isHydrated && isAuthenticated && role ? getHomeForRole(role) : authRoutes.login;

  return (
    <header className="border-border/60 bg-warm-white/95 sticky top-0 z-40 border-b backdrop-blur-md">
      <PageContainer className="flex h-[var(--public-header-height)] items-center justify-between gap-4">
        <DriveXLogo />

        <nav aria-label="Primary" className="hidden items-center gap-0.5 lg:flex">
          {publicNavItems.map((item) => {
            const active = pathname === item.href;

            return (
              <Link
                key={item.href}
                href={item.href}
                aria-current={active ? "page" : undefined}
                className={cn(
                  "public-nav-link rounded-full px-3.5 py-2 text-sm font-medium transition-colors duration-200",
                  active
                    ? "text-deep-navy"
                    : "text-muted-foreground hover:bg-muted hover:text-deep-navy",
                )}
              >
                <span
                  className={cn("public-nav-label", active && "public-nav-label-active")}
                >
                  {item.label}
                </span>
              </Link>
            );
          })}
        </nav>

        <div className="hidden items-center gap-2 lg:flex">
          <Link
            href={isAuthenticated ? appHref : authRoutes.login}
            className={cn(buttonVariants({ variant: "ghost", size: "sm" }))}
          >
            {isAuthenticated ? "Open app" : "Log in"}
          </Link>
          <a
            href={`${publicRoutes.home}#download-app`}
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
          <SheetContent
            side="right"
            className="site-mobile-sheet bg-warm-white w-[min(100%,20rem)]"
          >
            <SheetHeader className="border-border/70 border-b px-5 py-4">
              <SheetTitle className="text-left">
                <DriveXLogo asLink={false} size="sm" />
              </SheetTitle>
            </SheetHeader>
            <nav aria-label="Mobile" className="mt-6 flex flex-col gap-1">
              {publicNavItems.map((item) => {
                const active = pathname === item.href;

                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    aria-current={active ? "page" : undefined}
                    onClick={() => setOpen(false)}
                    className={cn(
                      "rounded-xl px-3 py-3 text-base font-medium transition-colors duration-200",
                      active
                        ? "text-olive font-semibold"
                        : "text-deep-navy hover:bg-muted active:bg-muted",
                    )}
                  >
                    <span
                      className={cn(
                        "public-nav-label",
                        active && "public-nav-label-active",
                      )}
                    >
                      {item.label}
                    </span>
                  </Link>
                );
              })}
              <Link
                href={publicRoutes.driveWithUs}
                onClick={() => setOpen(false)}
                className="text-deep-navy hover:bg-muted active:bg-muted rounded-xl px-3 py-3 text-base font-medium transition-colors duration-200"
              >
                Drive With Us
              </Link>
              <Link
                href={isAuthenticated ? appHref : authRoutes.login}
                onClick={() => setOpen(false)}
                className="text-deep-navy hover:bg-muted active:bg-muted rounded-xl px-3 py-3 text-base font-medium transition-colors duration-200"
              >
                {isAuthenticated ? "Open app" : "Log in"}
              </Link>
            </nav>
            <div className="border-border mt-6 flex gap-3 border-t pt-6 px-3">
              <Link
                href={authRoutes.login}
                onClick={() => setOpen(false)}
                className={cn(
                  buttonVariants({ variant: "navy", size: "lg" }),
                  "min-w-0 flex-1",
                )}
              >
                {publicContent.hero.primaryCta}
              </Link>
              <a
                href={`${publicRoutes.home}#download-app`}
                onClick={() => setOpen(false)}
                className={cn(
                  buttonVariants({ variant: "default", size: "lg" }),
                  "min-w-0 flex-1",
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
