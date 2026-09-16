"use client";

import { CarFront, Check, CircleUserRound } from "lucide-react";
import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";

type JourneyStep = {
  step: string;
  title: string;
  description: string;
};

type JourneyShowcaseProps = {
  userSteps: readonly JourneyStep[];
  driverSteps: readonly JourneyStep[];
};

export function JourneyShowcase({ userSteps, driverSteps }: JourneyShowcaseProps) {
  const [mode, setMode] = useState<"user" | "driver">("user");
  const [activeIndex, setActiveIndex] = useState(0);
  const [reducedMotion, setReducedMotion] = useState(false);
  const steps = mode === "user" ? userSteps : driverSteps;
  const activeStep = steps[activeIndex] ?? steps[0];
  const progress = ((activeIndex + 1) / steps.length) * 100;
  const journeys: { title: string; steps: readonly JourneyStep[] }[] = [
    { title: "User journey", steps: userSteps },
    { title: "Driver journey", steps: driverSteps },
  ];

  useEffect(() => {
    const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    const updateMotionPreference = () => setReducedMotion(mediaQuery.matches);

    updateMotionPreference();
    mediaQuery.addEventListener("change", updateMotionPreference);
    return () => mediaQuery.removeEventListener("change", updateMotionPreference);
  }, []);

  useEffect(() => {
    if (reducedMotion) return;

    const interval = window.setInterval(() => {
      setActiveIndex((current) => (current + 1) % steps.length);
    }, 3600);

    return () => window.clearInterval(interval);
  }, [mode, reducedMotion, steps.length]);

  return (
    <div className="mx-auto max-w-5xl">
      <div
        className="bg-cream border-border/70 flex w-fit rounded-full border p-1"
        role="tablist"
        aria-label="Choose a DriverDosth journey"
      >
        <button
          type="button"
          role="tab"
          id="journey-user-tab"
          aria-controls="journey-panel"
          aria-selected={mode === "user"}
          onClick={() => {
            setMode("user");
            setActiveIndex(0);
          }}
          className={cn(
            "flex items-center gap-2 rounded-full px-4 py-2 text-sm font-semibold transition-colors",
            mode === "user"
              ? "bg-deep-navy shadow-soft text-white"
              : "text-muted-foreground hover:text-deep-navy",
          )}
        >
          <CircleUserRound className="size-4" aria-hidden />
          User journey
        </button>
        <button
          type="button"
          role="tab"
          id="journey-driver-tab"
          aria-controls="journey-panel"
          aria-selected={mode === "driver"}
          onClick={() => {
            setMode("driver");
            setActiveIndex(0);
          }}
          className={cn(
            "flex items-center gap-2 rounded-full px-4 py-2 text-sm font-semibold transition-colors",
            mode === "driver"
              ? "bg-deep-navy shadow-soft text-white"
              : "text-muted-foreground hover:text-deep-navy",
          )}
        >
          <CarFront className="size-4" aria-hidden />
          Driver journey
        </button>
      </div>

      <div className="border-border/70 bg-warm-white shadow-soft mt-6 rounded-3xl border p-5 sm:p-7">
        <div className="flex items-center justify-between gap-4">
          <div>
            <p className="text-caption text-olive font-bold tracking-[0.14em] uppercase">
              {mode === "user" ? "For Users" : "For Drivers"}
            </p>
            <p className="text-muted-foreground mt-1 text-sm">
              Step {activeIndex + 1} of {steps.length}
            </p>
          </div>
          <div className="bg-muted h-2 w-24 overflow-hidden rounded-full sm:w-40">
            <div
              className="bg-olive h-full rounded-full transition-[width] duration-500"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>

        <div className="relative mt-8">
          <div className="bg-border/80 absolute top-4 right-5 left-5 h-px" aria-hidden />
          <div
            className="bg-olive absolute top-4 left-5 h-px transition-[width] duration-500"
            style={{
              width: `calc(${Math.max(progress - 100 / steps.length, 0)}% - 1.25rem)`,
            }}
            aria-hidden
          />
          <ol className="relative grid grid-cols-4 gap-2">
            {steps.map((step, index) => {
              const isActive = index === activeIndex;
              const isComplete = index < activeIndex;

              return (
                <li key={step.step} className="flex justify-center">
                  <button
                    type="button"
                    onClick={() => setActiveIndex(index)}
                    aria-label={`Show step ${index + 1}: ${step.title}`}
                    aria-current={isActive ? "step" : undefined}
                    className="group flex flex-col items-center gap-2"
                  >
                    <span
                      className={cn(
                        "relative z-10 flex size-8 items-center justify-center rounded-full border-2 text-xs font-bold transition-[background-color,border-color,color,transform] duration-300",
                        isActive &&
                          "border-olive bg-olive shadow-soft scale-110 text-white",
                        isComplete && !isActive && "border-olive bg-olive text-white",
                        !isActive &&
                          !isComplete &&
                          "border-border bg-warm-white text-muted-foreground group-hover:border-olive/60",
                      )}
                    >
                      {isComplete ? <Check className="size-4" /> : index + 1}
                    </span>
                    <span
                      className={cn(
                        "hidden text-center text-xs font-medium sm:block",
                        isActive ? "text-deep-navy" : "text-muted-foreground",
                      )}
                    >
                      {step.title}
                    </span>
                  </button>
                </li>
              );
            })}
          </ol>
        </div>

        {activeStep ? (
          <div
            key={`${mode}-${activeIndex}`}
            className="motion-enter border-olive/15 bg-olive/5 mt-8 rounded-2xl border p-5 sm:p-6"
            id="journey-panel"
            role="tabpanel"
            aria-labelledby={mode === "user" ? "journey-user-tab" : "journey-driver-tab"}
            aria-live="polite"
          >
            <p className="text-caption text-olive font-bold tracking-[0.14em] uppercase">
              {activeStep.step}
            </p>
            <h3 className="text-deep-navy mt-2 text-xl font-semibold">
              {activeStep.title}
            </h3>
            <p className="text-muted-foreground mt-2 max-w-2xl leading-relaxed">
              {activeStep.description}
            </p>
          </div>
        ) : null}
      </div>

      <noscript>
        <div className="mt-6 grid gap-6 md:grid-cols-2">
          {journeys.map(({ title, steps: journey }) => (
            <section key={title}>
              <h2 className="text-h3">{title}</h2>
              <ol className="mt-4 space-y-3">
                {(journey as readonly JourneyStep[]).map((step, index) => (
                  <li
                    key={step.step}
                    className="border-border bg-warm-white flex gap-3 rounded-2xl border p-4"
                  >
                    <span className="bg-olive flex size-8 shrink-0 items-center justify-center rounded-full text-sm font-bold text-white">
                      {index + 1}
                    </span>
                    <span className="text-deep-navy pt-1 font-medium">{step.title}</span>
                  </li>
                ))}
              </ol>
            </section>
          ))}
        </div>
      </noscript>
    </div>
  );
}
