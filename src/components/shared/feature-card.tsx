import type { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

export function FeatureCard({
  icon: Icon,
  eyebrow,
  title,
  description,
  className,
}: {
  icon: LucideIcon;
  eyebrow?: string;
  title: string;
  description: string;
  className?: string;
}) {
  return (
    <article
      className={cn(
        "motion-lift border-border/70 bg-warm-white shadow-soft flex h-full flex-col rounded-2xl border p-6",
        className,
      )}
    >
      <div className="bg-olive/10 text-olive flex size-12 items-center justify-center rounded-full">
        <Icon className="size-5" strokeWidth={1.75} aria-hidden />
      </div>
      {eyebrow ? (
        <p className="text-caption text-olive mt-5 font-semibold tracking-[0.14em] uppercase">
          {eyebrow}
        </p>
      ) : null}
      <h3 className="text-deep-navy mt-4 text-lg font-semibold">{title}</h3>
      <p className="text-muted-foreground mt-2 flex-1 text-sm leading-relaxed">
        {description}
      </p>
    </article>
  );
}
