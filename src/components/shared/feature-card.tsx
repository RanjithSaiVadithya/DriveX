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
        "rounded-2xl border border-border/70 bg-warm-white p-6 shadow-soft transition-all hover:-translate-y-0.5 hover:shadow-medium",
        className,
      )}
    >
      <div className="flex size-12 items-center justify-center rounded-full bg-olive/10 text-olive">
        <Icon className="size-5" strokeWidth={1.75} aria-hidden />
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
        "rounded-2xl border border-border/70 bg-warm-white p-5 text-center shadow-soft",
        className,
      )}
    >
      <p className="text-3xl font-extrabold tracking-tight text-olive">{value}</p>
      <p className="mt-2 text-sm font-medium text-muted-foreground">{label}</p>
    </div>
  );
}
