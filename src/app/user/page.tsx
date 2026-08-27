"use client";

import Link from "next/link";
import { Clock3, History, MapPin, Navigation } from "lucide-react";
import { useAuth } from "@/hooks/use-auth";
import { useBookings } from "@/hooks/use-bookings";
import { DataState } from "@/components/shared/data-state";
import { RideCard } from "@/components/shared/domain-cards";
import { buttonVariants } from "@/components/ui/button";
import { userRoutes } from "@/config/routes";
import {
  formatCurrency,
  greetingForNow,
  isUpcomingBooking,
} from "@/services/domain/booking.service";
import { cn } from "@/lib/utils";

export default function UserHomePage() {
  const { user } = useAuth();
  const { listQuery } = useBookings();
  const firstName = user?.name?.split(" ")[0] ?? "there";
  const upcoming = (listQuery.data ?? [])
    .filter(isUpcomingBooking)
    .sort((a, b) => b.createdAt.localeCompare(a.createdAt));
  const next = upcoming[0];

  return (
    <div className="space-y-8">
      <section>
        <p className="text-caption font-semibold uppercase tracking-wider text-orange">
          {greetingForNow()}
        </p>
        <h1 className="text-h1 mt-1">{firstName}</h1>
        <p className="mt-2 text-muted-foreground">Where are you going?</p>
        <Link
          href={userRoutes.book}
          className={cn(buttonVariants({ size: "lg" }), "mt-5 inline-flex w-full sm:w-auto")}
        >
          Book a Driver
        </Link>
      </section>

      <section>
        <h2 className="text-h3">Quick actions</h2>
        <div className="mt-4 grid grid-cols-2 gap-3 lg:grid-cols-4">
          {[
            { href: userRoutes.book, label: "Book a Driver", icon: Navigation },
            { href: userRoutes.bookings, label: "Upcoming Trip", icon: Clock3 },
            { href: `${userRoutes.bookings}?tab=completed`, label: "Trip History", icon: History },
            { href: userRoutes.vehicles, label: "My Vehicles", icon: MapPin },
          ].map((item) => {
            const Icon = item.icon;
            return (
              <Link
                key={item.href}
                href={item.href}
                className="rounded-xl border border-border bg-warm-white p-4 shadow-soft transition-shadow hover:shadow-medium"
              >
                <Icon className="size-5 text-olive" aria-hidden />
                <span className="mt-3 block text-sm font-semibold text-deep-navy">
                  {item.label}
                </span>
              </Link>
            );
          })}
        </div>
      </section>

      <section>
        <h2 className="text-h3">Upcoming trip</h2>
        <div className="mt-4">
          <DataState
            isLoading={listQuery.isLoading}
            isError={listQuery.isError}
            errorMessage="Unable to load bookings"
            onRetry={() => void listQuery.refetch()}
            isEmpty={!next}
            emptyTitle="No upcoming trips"
            emptyDescription="Your next driver booking will appear here."
          >
            {next ? (
              <Link href={userRoutes.bookingDetail(next.id)} className="block">
                <RideCard
                  title={`${next.pickup.label} → ${next.destination.label}`}
                  subtitle={`${next.pickup.address} to ${next.destination.address}`}
                  status={next.status}
                  meta={`${formatCurrency(next.estimatedFare)} · ${next.scheduledAt ? new Date(next.scheduledAt).toLocaleString() : "As soon as possible"}`}
                />
              </Link>
            ) : (
              <div className="rounded-xl border border-dashed border-border bg-warm-white p-6">
                <p className="font-medium text-deep-navy">No upcoming trips</p>
                <p className="mt-1 text-sm text-muted-foreground">
                  Your next driver booking will appear here.
                </p>
                <Link
                  href={userRoutes.book}
                  className={cn(buttonVariants(), "mt-4 inline-flex")}
                >
                  Book a Driver
                </Link>
              </div>
            )}
          </DataState>
        </div>
      </section>
    </div>
  );
}
