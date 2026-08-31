import {
  BellRing,
  CarFront,
  CheckCircle2,
  MapPin,
  ShieldCheck,
  WalletCards,
} from "lucide-react";
import { publicContent } from "@/config/content";
import { cn } from "@/lib/utils";

const statusIndexes = [0, 0, 1, 3] as const;

export function SafetyProductPreview({ activeStep }: { activeStep: number }) {
  const content = publicContent.safetyFlow;
  const preview = content.preview;
  const step = content.steps[activeStep] ?? content.steps[0];
  const currentStatusIndex = statusIndexes[activeStep] ?? 0;
  const previewTitle =
    activeStep === content.steps.length - 1 ? preview.completedTitle : preview.title;

  return (
    <div className="safety-product-preview">
      <div
        key={`focus-${activeStep}`}
        className="safety-product-step-change border-olive/15 bg-olive/5 text-deep-navy rounded-2xl border p-3.5"
        aria-live="polite"
      >
        <div className="flex items-center justify-between gap-3">
          <p className="text-caption text-olive font-semibold tracking-wider uppercase">
            {preview.eyebrow}
          </p>
          <span className="text-caption text-olive shrink-0 font-semibold">
            {step.number} / {content.steps.length.toString().padStart(2, "0")}
          </span>
        </div>
        <div className="mt-2 flex items-start gap-2.5">
          <span className="bg-olive/15 text-olive flex size-8 shrink-0 items-center justify-center rounded-full">
            {activeStep === 0 ? (
              <ShieldCheck className="size-4" aria-hidden />
            ) : activeStep === 1 ? (
              <CarFront className="size-4" aria-hidden />
            ) : activeStep === 2 ? (
              <BellRing className="size-4" aria-hidden />
            ) : (
              <WalletCards className="size-4" aria-hidden />
            )}
          </span>
          <div>
            <p className="text-sm font-semibold">{step.previewFocus}</p>
            <p className="text-muted-foreground mt-0.5 text-xs leading-relaxed">
              {step.previewDetail}
            </p>
          </div>
        </div>
      </div>

      <div
        key={`phone-${activeStep}`}
        className="safety-product-step-change border-deep-navy/20 bg-deep-navy shadow-medium mx-auto mt-5 w-full max-w-[18rem] rounded-[2rem] border-4 p-1.5"
        role="img"
        aria-label={`${preview.demoLabel}: ${previewTitle}, ${preview.vehicleName}, ${preview.vehicleRegistration}`}
      >
        <div className="bg-warm-white overflow-hidden rounded-[1.55rem]">
          <div className="flex items-center justify-between px-4 pt-3 pb-2">
            <span className="text-caption text-muted-foreground">9:41</span>
            <span className="bg-deep-navy h-1.5 w-12 rounded-full" />
            <span className="text-caption text-muted-foreground">●●●</span>
          </div>

          <div className="px-3 pb-3">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-caption text-muted-foreground">{preview.eyebrow}</p>
                <p className="text-deep-navy mt-0.5 text-sm font-bold">{previewTitle}</p>
              </div>
              <span className="bg-olive/10 text-olive flex size-8 items-center justify-center rounded-full">
                <ShieldCheck className="size-4" aria-hidden />
              </span>
            </div>

            <div className="bg-warm-beige relative mt-3 h-28 overflow-hidden rounded-xl">
              <svg viewBox="0 0 320 150" className="h-full w-full" aria-hidden="true">
                <rect width="320" height="150" fill="var(--warm-beige)" />
                <path
                  d="M0 32 H320 M0 76 H320 M0 120 H320 M54 0 V150 M148 0 V150 M238 0 V150"
                  stroke="rgba(18,26,31,0.1)"
                  strokeWidth="2"
                />
                <path
                  d="M20 124 C72 112 92 86 134 92 S202 64 292 28"
                  fill="none"
                  stroke="var(--olive)"
                  strokeLinecap="round"
                  strokeWidth="5"
                />
                <circle cx="30" cy="121" r="8" fill="var(--olive)" />
                <circle cx="290" cy="29" r="8" fill="var(--deep-navy)" />
              </svg>
              <span className="bg-warm-white/90 text-caption text-deep-navy absolute top-2.5 left-2.5 rounded-full px-2 py-1 font-semibold">
                {step.title}
              </span>
              <MapPin
                className="text-olive absolute bottom-2.5 left-3 size-4"
                aria-hidden
              />
              <MapPin
                className="text-deep-navy absolute top-3 right-3 size-4"
                aria-hidden
              />
            </div>

            <div className="border-border/70 bg-cream relative -mt-2 rounded-xl border p-3">
              <div className="flex items-start gap-2.5">
                <span className="bg-olive/10 text-olive flex size-8 shrink-0 items-center justify-center rounded-full">
                  <CarFront className="size-4" aria-hidden />
                </span>
                <div className="min-w-0">
                  <p className="text-caption text-muted-foreground">
                    {preview.vehicleLabel}
                  </p>
                  <p className="text-deep-navy mt-0.5 truncate text-sm font-bold">
                    {preview.vehicleRegistration}
                  </p>
                  <p className="text-muted-foreground text-xs">{preview.vehicleName}</p>
                </div>
              </div>
            </div>

            <div className="mt-3">
              <p className="text-caption text-muted-foreground font-semibold uppercase">
                {preview.statusLabel}
              </p>
              <div className="mt-2 space-y-1.5">
                {preview.statuses.map((status, index) => (
                  <div key={status} className="flex items-center gap-2">
                    <span
                      className={cn(
                        "flex size-3.5 items-center justify-center rounded-full border",
                        index <= currentStatusIndex
                          ? "border-olive bg-olive"
                          : "border-border bg-warm-white",
                        index === currentStatusIndex && "ring-olive/20 ring-2",
                      )}
                    >
                      {index < currentStatusIndex ? (
                        <CheckCircle2 className="size-2.5 text-white" aria-hidden />
                      ) : null}
                    </span>
                    <span
                      className={cn(
                        "text-xs",
                        index <= currentStatusIndex
                          ? "text-deep-navy font-semibold"
                          : "text-muted-foreground",
                      )}
                    >
                      {status}
                    </span>
                    {index === currentStatusIndex ? (
                      <span className="text-caption text-olive ml-auto font-semibold">
                        Current
                      </span>
                    ) : null}
                  </div>
                ))}
              </div>
            </div>

            <div className="border-border mt-3 flex items-center justify-between border-t pt-3">
              <div>
                <p className="text-caption text-muted-foreground">{preview.fareLabel}</p>
                <p className="text-deep-navy mt-0.5 text-sm font-bold">{preview.fare}</p>
              </div>
              <span className="bg-cream text-caption text-olive rounded-lg px-2.5 py-1.5 font-semibold">
                {preview.detailsCta}
              </span>
            </div>
          </div>
        </div>
      </div>
      <p className="text-caption text-muted-foreground mt-3 text-center">
        {preview.demoLabel}
      </p>
    </div>
  );
}
