import type { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

export function FeatureCard({
  icon: Icon,
  title,
  description,
  className,
}: {
  icon: LucideIcon;
  title: string;
  description: string;
  className?: string;
}) {
  return (
    <article
      className={cn(
        "rounded-xl border border-border/80 bg-warm-white p-6 shadow-soft transition-shadow hover:shadow-medium",
        className,
      )}
    >
      <div className="flex size-11 items-center justify-center rounded-lg bg-olive/10 text-olive">
        <Icon className="size-5" aria-hidden />
      </div>
      <h3 className="mt-4 text-lg font-semibold text-deep-navy">{title}</h3>
      <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{description}</p>
    </article>
  );
}

export function StatCard({
  label,
  value,
  className,
}: {
  label: string;
  value: string;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "rounded-xl border border-border/80 bg-warm-white p-5 shadow-soft",
        className,
      )}
    >
      <p className="text-caption font-medium uppercase tracking-wide text-muted-foreground">
        {label}
      </p>
      <p className="mt-2 text-2xl font-bold text-deep-navy">{value}</p>
    </div>
  );
}
