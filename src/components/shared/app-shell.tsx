"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import type { ReactNode } from "react";
import {
  Bell,
  CreditCard,
  FileText,
  HelpCircle,
  Home,
  MapPin,
  Navigation,
  Settings,
  UserRound,
  Wallet,
} from "lucide-react";
import { RequireRole } from "@/components/shared/require-auth";
import { DriveXLogo } from "@/components/shared/logo";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/use-auth";
import { useNotifications } from "@/hooks/use-notifications";
import { userRoutes, driverRoutes, publicRoutes } from "@/config/routes";
import { cn } from "@/lib/utils";

const userDesktopNav = [
  { label: "Dashboard", href: userRoutes.home, icon: Home },
  { label: "Book a Driver", href: userRoutes.book, icon: Navigation },
  { label: "My Trips", href: userRoutes.bookings, icon: MapPin },
  { label: "My Vehicles", href: userRoutes.vehicles, icon: Navigation },
  { label: "Payments", href: userRoutes.payments, icon: CreditCard },
  { label: "Notifications", href: userRoutes.notifications, icon: Bell },
  { label: "Saved Places", href: userRoutes.savedPlaces, icon: MapPin },
  { label: "Profile", href: userRoutes.profile, icon: UserRound },
] as const;

const userMobileNav = [
  { label: "Home", href: userRoutes.home, icon: Home },
  { label: "Trips", href: userRoutes.bookings, icon: MapPin },
  { label: "Book", href: userRoutes.book, icon: Navigation, primary: true },
  { label: "Payments", href: userRoutes.payments, icon: CreditCard },
  { label: "Profile", href: userRoutes.profile, icon: UserRound },
] as const;

const driverDesktopNav = [
  { label: "Dashboard", href: driverRoutes.home, icon: Home },
  { label: "Trips", href: driverRoutes.trips, icon: Navigation },
  { label: "Earnings", href: driverRoutes.earnings, icon: CreditCard },
  { label: "Wallet", href: driverRoutes.wallet, icon: Wallet },
  { label: "Documents", href: driverRoutes.documents, icon: FileText },
  { label: "Notifications", href: driverRoutes.notifications, icon: Bell },
  { label: "Profile", href: driverRoutes.profile, icon: UserRound },
  { label: "Settings", href: driverRoutes.settings, icon: Settings },
] as const;

const driverMobileNav = [
  { label: "Home", href: driverRoutes.home, icon: Home },
  { label: "Trips", href: driverRoutes.trips, icon: Navigation },
  { label: "Earnings", href: driverRoutes.earnings, icon: CreditCard },
  { label: "More", href: driverRoutes.settings, icon: Settings },
] as const;

function isActivePath(pathname: string, href: string, home: string) {
  return pathname === href || (href !== home && pathname.startsWith(href));
}

export function UserShell({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const { logout, user } = useAuth();
  const { unreadCount } = useNotifications();

  return (
    <RequireRole role="USER">
      <div className="flex min-h-full flex-1 flex-col bg-cream md:flex-row">
        <aside className="hidden w-60 shrink-0 flex-col bg-deep-navy text-warm-white md:flex">
          <div className="border-b border-white/10 px-5 py-5">
            <DriveXLogo variant="light" size="sm" href={userRoutes.home} />
            <p className="mt-1 text-xs text-warm-beige/75">User app</p>
          </div>
          <nav aria-label="User" className="flex flex-1 flex-col gap-1 p-3">
            {userDesktopNav.map((item) => {
              const Icon = item.icon;
              const active = isActivePath(pathname, item.href, userRoutes.home);
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    "flex items-center gap-3 rounded-md px-3 py-2.5 text-sm font-medium transition-colors",
                    active
                      ? "bg-olive text-warm-white"
                      : "text-warm-beige/90 hover:bg-sidebar-accent",
                  )}
                >
                  <Icon className="size-4" aria-hidden />
                  {item.label}
                  {item.href === userRoutes.notifications && unreadCount > 0 ? (
                    <span className="ml-auto rounded-full bg-orange px-1.5 text-[10px] font-bold text-white">
                      {unreadCount}
                    </span>
                  ) : null}
                </Link>
              );
            })}
            <Link
              href={publicRoutes.contact}
              className="mt-auto flex items-center gap-3 rounded-md px-3 py-2.5 text-sm text-warm-beige/80 hover:bg-sidebar-accent"
            >
              <HelpCircle className="size-4" aria-hidden />
              Help
            </Link>
          </nav>
          <div className="border-t border-white/10 p-4">
            <p className="truncate text-sm font-medium">{user?.name}</p>
            <p className="truncate text-xs text-warm-beige/70">{user?.email}</p>
            <Button
              type="button"
              variant="secondary"
              size="sm"
              className="mt-3 w-full"
              onClick={() => logout.mutate()}
            >
              Log out
            </Button>
          </div>
        </aside>

        <div className="flex min-w-0 flex-1 flex-col pb-[calc(5rem+env(safe-area-inset-bottom))] md:pb-0">
          <header className="sticky top-0 z-30 flex items-center justify-between border-b border-border/80 bg-warm-white/95 px-4 py-3 pt-[max(0.75rem,env(safe-area-inset-top))] backdrop-blur md:px-6 md:pt-3">
            <div className="md:hidden">
              <DriveXLogo size="sm" href={userRoutes.home} />
            </div>
            <p className="hidden text-sm text-muted-foreground md:block">
              Welcome back{user?.name ? `, ${user.name.split(" ")[0]}` : ""}
            </p>
            <Link
              href={userRoutes.notifications}
              className="relative inline-flex size-11 min-h-11 min-w-11 items-center justify-center rounded-md border border-border bg-warm-white"
              aria-label={`Notifications${unreadCount ? `, ${unreadCount} unread` : ""}`}
            >
              <Bell className="size-4 text-deep-navy" />
              {unreadCount > 0 ? (
                <span className="absolute -right-1 -top-1 flex size-5 items-center justify-center rounded-full bg-orange text-[10px] font-bold text-white">
                  {unreadCount > 9 ? "9+" : unreadCount}
                </span>
              ) : null}
            </Link>
          </header>

          <main className="flex-1 px-4 py-5 md:px-8 md:py-6">{children}</main>

          <nav
            aria-label="Mobile"
            className="fixed inset-x-0 bottom-0 z-40 border-t border-border bg-warm-white px-2 pb-[env(safe-area-inset-bottom)] pt-1 md:hidden"
          >
            <ul className="grid grid-cols-5 gap-1">
              {userMobileNav.map((item) => {
                const Icon = item.icon;
                const active = isActivePath(pathname, item.href, userRoutes.home);
                const primary = "primary" in item && item.primary;
                return (
                  <li key={item.href}>
                    <Link
                      href={item.href}
                      className={cn(
                        "flex min-h-11 flex-col items-center justify-center gap-1 rounded-md px-1 py-2 text-[11px] font-medium",
                        primary || active ? "text-olive" : "text-muted-foreground",
                      )}
                    >
                      <span
                        className={cn(
                          "flex size-9 items-center justify-center rounded-full",
                          primary && "bg-olive text-warm-white shadow-soft",
                          !primary && active && "bg-olive/10",
                        )}
                      >
                        <Icon className="size-4" aria-hidden />
                      </span>
                      {item.label}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </nav>
        </div>
      </div>
    </RequireRole>
  );
}

export function DriverShell({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const { logout, user } = useAuth();
  const { unreadCount } = useNotifications();

  return (
    <RequireRole role="DRIVER">
      <div className="flex min-h-full flex-1 flex-col bg-cream md:flex-row">
        <aside className="hidden w-60 shrink-0 flex-col bg-deep-navy text-warm-white md:flex">
          <div className="border-b border-white/10 px-5 py-5">
            <DriveXLogo variant="light" size="sm" href={driverRoutes.home} />
            <p className="mt-1 text-xs text-warm-beige/75">Driver app</p>
          </div>
          <nav aria-label="Driver" className="flex flex-1 flex-col gap-1 p-3">
            {driverDesktopNav.map((item) => {
              const Icon = item.icon;
              const active = isActivePath(pathname, item.href, driverRoutes.home);
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    "flex items-center gap-3 rounded-md px-3 py-2.5 text-sm font-medium",
                    active
                      ? "bg-olive text-warm-white"
                      : "text-warm-beige/90 hover:bg-sidebar-accent",
                  )}
                >
                  <Icon className="size-4" aria-hidden />
                  {item.label}
                  {item.href === driverRoutes.notifications && unreadCount > 0 ? (
                    <span className="ml-auto rounded-full bg-orange px-1.5 text-[10px] font-bold text-white">
                      {unreadCount}
                    </span>
                  ) : null}
                </Link>
              );
            })}
          </nav>
          <div className="border-t border-white/10 p-4">
            <p className="truncate text-sm font-medium">{user?.name}</p>
            <p className="truncate text-xs text-warm-beige/70">{user?.email}</p>
            <Button
              type="button"
              variant="secondary"
              size="sm"
              className="mt-3 w-full"
              onClick={() => logout.mutate()}
            >
              Log out
            </Button>
          </div>
        </aside>

        <div className="flex min-w-0 flex-1 flex-col pb-[calc(5rem+env(safe-area-inset-bottom))] md:pb-0">
          <header className="sticky top-0 z-20 flex items-center justify-between border-b border-border bg-warm-white px-4 py-3 pt-[max(0.75rem,env(safe-area-inset-top))] md:px-8 md:pt-3">
            <div className="md:hidden">
              <DriveXLogo size="sm" href={driverRoutes.home} />
            </div>
            <p className="hidden text-sm font-semibold text-deep-navy md:block">
              DriveX Driver
            </p>
            <div className="flex items-center gap-2">
              <Link
                href={driverRoutes.notifications}
                className="relative inline-flex size-11 min-h-11 min-w-11 items-center justify-center rounded-md border border-border bg-cream"
                aria-label={
                  unreadCount > 0
                    ? `Notifications, ${unreadCount} unread`
                    : "Notifications"
                }
              >
                <Bell className="size-4 text-deep-navy" aria-hidden />
                {unreadCount > 0 ? (
                  <span className="absolute -right-1 -top-1 rounded-full bg-orange px-1.5 text-[10px] font-bold text-white">
                    {unreadCount}
                  </span>
                ) : null}
              </Link>
              <Link
                href={driverRoutes.profile}
                className="inline-flex size-11 min-h-11 min-w-11 items-center justify-center rounded-md border border-border bg-cream"
                aria-label="Profile"
              >
                <UserRound className="size-4 text-deep-navy" aria-hidden />
              </Link>
            </div>
          </header>
          <main className="flex-1 px-4 py-6 md:px-8">{children}</main>
        </div>

        <nav
          aria-label="Driver mobile"
          className="fixed inset-x-0 bottom-0 z-30 border-t border-border bg-warm-white pb-[env(safe-area-inset-bottom)] md:hidden"
        >
          <ul className="grid grid-cols-4 gap-1 px-2 py-2">
            {driverMobileNav.map((item) => {
              const Icon = item.icon;
              const active = isActivePath(pathname, item.href, driverRoutes.home);
              return (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className={cn(
                      "flex min-h-11 flex-col items-center justify-center gap-1 rounded-md px-2 py-2 text-[11px] font-semibold",
                      active ? "text-olive" : "text-muted-foreground",
                    )}
                  >
                    <Icon className="size-5" aria-hidden />
                    {item.label}
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>
      </div>
    </RequireRole>
  );
}
