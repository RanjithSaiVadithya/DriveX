import {
  ArrowUpRight,
  CarFront,
  CheckCircle2,
  Clock3,
  MapPin,
  WalletCards,
} from "lucide-react";
import { cn } from "@/lib/utils";

export function DriverDashboardPreview({ className }: { className?: string }) {
  return (
    <div
      className={cn(
        "shadow-medium relative overflow-hidden rounded-[2rem] border border-white/10 bg-[#1c272e] p-4 sm:p-5",
        className,
      )}
      role="img"
      aria-label="DriveX Driver dashboard showing online status, a Trip request, and earnings"
    >
      <div className="bg-olive/25 pointer-events-none absolute -top-24 -right-16 size-64 rounded-full blur-3xl" />
      <div className="relative">
        <div className="flex items-center justify-between gap-4 text-white">
          <div className="flex items-center gap-3">
            <span className="bg-olive flex size-10 items-center justify-center rounded-xl text-sm font-extrabold">
              DX
            </span>
            <div>
              <p className="text-sm font-bold">Driver dashboard</p>
              <p className="text-xs text-white/55">Your workday at a glance</p>
            </div>
          </div>
          <span className="flex items-center gap-2 rounded-full bg-white/10 px-3 py-1.5 text-xs font-semibold text-white/85">
            <span className="size-2 rounded-full bg-[#8fd17f]" />
            Online
          </span>
        </div>

        <div className="mt-5 grid gap-3 sm:grid-cols-[1.2fr_0.8fr]">
          <div className="bg-warm-white text-deep-navy shadow-soft rounded-2xl p-4">
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="text-caption text-olive font-bold tracking-wide uppercase">
                  New Trip request
                </p>
                <p className="mt-1 text-sm font-bold">Review before accepting</p>
              </div>
              <span className="bg-olive/10 text-olive flex size-9 items-center justify-center rounded-xl">
                <ArrowUpRight className="size-4" aria-hidden />
              </span>
            </div>
            <div className="mt-4 space-y-3 text-xs">
              <div className="flex items-center gap-2">
                <MapPin className="text-olive size-4" aria-hidden />
                <span>Indiranagar → Bengaluru Airport</span>
              </div>
              <div className="flex items-center gap-2">
                <CarFront className="text-olive size-4" aria-hidden />
                <span>User vehicle · Sedan</span>
              </div>
              <div className="flex items-center gap-2">
                <Clock3 className="text-olive size-4" aria-hidden />
                <span>Pickup scheduled for today</span>
              </div>
            </div>
            <div className="border-border/70 mt-4 flex items-center justify-between border-t pt-3">
              <span className="text-muted-foreground text-xs font-semibold">
                Fare estimate
              </span>
              <span className="text-deep-navy text-xs font-bold">View details</span>
            </div>
          </div>

          <div className="flex flex-col gap-3">
            <div className="bg-olive flex-1 rounded-2xl p-4 text-white">
              <div className="flex items-center justify-between">
                <p className="text-caption font-bold tracking-wide text-white/70 uppercase">
                  Earnings
                </p>
                <WalletCards className="size-4 text-white/80" aria-hidden />
              </div>
              <p className="mt-6 text-sm font-semibold">Trip earnings tracked here</p>
              <p className="mt-1 text-xs text-white/70">Review your completed work.</p>
            </div>
            <div className="rounded-2xl bg-white/10 p-4 text-white">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="size-4 text-[#8fd17f]" aria-hidden />
                <p className="text-xs font-semibold">Profile verified</p>
              </div>
              <p className="mt-2 text-xs text-white/55">Ready to receive requests.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
