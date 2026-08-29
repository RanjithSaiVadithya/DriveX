import {
  ArrowRight,
  BellRing,
  CheckCircle2,
  FileCheck2,
  LockKeyhole,
  Radio,
  Route,
  ShieldCheck,
} from "lucide-react";
import { PageContainer, SectionHeading } from "@/components/shared/page-container";
import { publicRoutes } from "@/config/routes";
import { publicContent } from "@/config/content";
import { buttonVariants } from "@/components/ui/button";
import Link from "next/link";
import { cn } from "@/lib/utils";

const trustSteps = [
  {
    number: "01",
    icon: FileCheck2,
    title: "Driver verification",
    description:
      "Required identity and licence documents are submitted during onboarding, with a visible verification status before trip work begins.",
    status: "Verification status tracked",
  },
  {
    number: "02",
    icon: Route,
    title: "One shared trip record",
    description:
      "Pickup, destination, customer vehicle, fare estimate, and driver assignment stay connected to the same booking and trip.",
    status: "Booking → Trip → Payment",
  },
  {
    number: "03",
    icon: BellRing,
    title: "Status you can follow",
    description:
      "Both sides can follow the trip as it moves from assigned to arriving, arrived, started, and completed.",
    status: "Live status transitions",
  },
  {
    number: "04",
    icon: CheckCircle2,
    title: "Clear closeout",
    description:
      "When a trip completes, the final fare, payment record, driver earning, and notifications are tied back to that trip.",
    status: "Completion recorded",
  },
] as const;

export function SafetyFlowSection({ compact = false }: { compact?: boolean }) {
  return (
    <section className={cn("bg-warm-white py-16 sm:py-20", compact && "py-14 sm:py-16")}>
      <PageContainer>
        <div className="grid items-end gap-8 lg:grid-cols-[0.8fr_1.2fr]">
          <SectionHeading
            eyebrow="Safety"
            title="Safety you can see in the flow"
            description="Trust is built through visible product steps — from driver verification to a complete, shared trip record."
          />
          <div className="border-olive/15 bg-olive/5 text-deep-navy flex items-center gap-3 rounded-2xl border p-4 text-sm">
            <span className="bg-olive flex size-10 shrink-0 items-center justify-center rounded-full text-white">
              <ShieldCheck className="size-5" strokeWidth={1.75} aria-hidden />
            </span>
            <p>
              <span className="font-semibold">Built for clarity.</span> The product shows
              what has happened, what is happening, and what comes next.
            </p>
          </div>
        </div>

        <div className="mt-10 grid gap-4 lg:grid-cols-4">
          {trustSteps.map(({ number, icon: Icon, title, description, status }, index) => (
            <article
              key={title}
              className="border-border/70 bg-cream shadow-soft relative rounded-3xl border p-5"
            >
              <div className="flex items-center justify-between">
                <span className="text-caption text-olive font-bold tracking-[0.14em]">
                  {number}
                </span>
                <span className="bg-olive/10 text-olive flex size-10 items-center justify-center rounded-full">
                  <Icon className="size-5" strokeWidth={1.75} aria-hidden />
                </span>
              </div>
              <h3 className="text-deep-navy mt-5 text-lg font-semibold">{title}</h3>
              <p className="text-muted-foreground mt-2 text-sm leading-relaxed">
                {description}
              </p>
              <p className="bg-warm-white text-caption text-olive mt-5 inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 font-semibold">
                <Radio className="size-3.5" aria-hidden />
                {status}
              </p>
              {index < trustSteps.length - 1 ? (
                <ArrowRight
                  className="text-olive/50 absolute top-1/2 -right-3 z-10 hidden size-5 -translate-y-1/2 lg:block"
                  aria-hidden
                />
              ) : null}
            </article>
          ))}
        </div>

        <div className="border-border/70 bg-deep-navy mt-6 flex flex-col gap-4 rounded-3xl border p-5 text-white sm:flex-row sm:items-center sm:justify-between sm:p-6">
          <div className="flex items-start gap-3">
            <LockKeyhole className="text-olive mt-0.5 size-5 shrink-0" aria-hidden />
            <p className="max-w-2xl text-sm leading-relaxed text-white/75">
              DriveX describes the controls currently represented in the product. It does
              not claim live emergency response, background-check completion, or city
              coverage until those services are verified and available.
            </p>
          </div>
          <Link
            href={publicRoutes.safety}
            className={cn(
              buttonVariants({ variant: "outline", size: "sm" }),
              "shrink-0 border-white/25 bg-transparent text-white hover:bg-white/10",
            )}
          >
            Explore safety
          </Link>
        </div>

        <p className="text-caption text-muted-foreground mt-4">
          {publicContent.safetyHighlights.length} product foundations currently shape the
          DriveX safety experience.
        </p>
      </PageContainer>
    </section>
  );
}
