import { StatusBadge } from "@/components/shared/status-badge";
import { cn } from "@/lib/utils";

export function RideCard({
  title,
  subtitle,
  status,
  meta,
  className,
}: {
  title: string;
  subtitle?: string;
  status?: string;
  meta?: string;
  className?: string;
}) {
  return (
    <article
      className={cn(
        "rounded-xl border border-border bg-warm-white p-4 shadow-soft",
        className,
      )}
    >
      <div className="flex items-start justify-between gap-3">
        <div>
          <h3 className="font-semibold text-deep-navy">{title}</h3>
          {subtitle ? (
            <p className="mt-1 text-sm text-muted-foreground">{subtitle}</p>
          ) : null}
        </div>
        {status ? <StatusBadge status={status} /> : null}
      </div>
      {meta ? <p className="mt-3 text-caption text-muted-foreground">{meta}</p> : null}
    </article>
  );
}

export function VehicleCard({
  name,
  detail,
  className,
}: {
  name: string;
  detail: string;
  className?: string;
}) {
  return (
    <article
      className={cn(
        "rounded-xl border border-border bg-warm-white p-4 shadow-soft",
        className,
      )}
    >
      <h3 className="font-semibold text-deep-navy">{name}</h3>
      <p className="mt-1 text-sm text-muted-foreground">{detail}</p>
    </article>
  );
}

export function DriverCard({
  name,
  rating,
  className,
}: {
  name: string;
  rating: string;
  className?: string;
}) {
  return (
    <article
      className={cn(
        "rounded-xl border border-border bg-warm-white p-4 shadow-soft",
        className,
      )}
    >
      <h3 className="font-semibold text-deep-navy">{name}</h3>
      <p className="mt-1 text-sm text-muted-foreground">Rating {rating}</p>
    </article>
  );
}

export function LocationCard({
  label,
  address,
  className,
}: {
  label: string;
  address: string;
  className?: string;
}) {
  return (
    <article
      className={cn(
        "rounded-xl border border-border bg-warm-white p-4 shadow-soft",
        className,
      )}
    >
      <h3 className="font-semibold text-deep-navy">{label}</h3>
      <p className="mt-1 text-sm text-muted-foreground">{address}</p>
    </article>
  );
}
