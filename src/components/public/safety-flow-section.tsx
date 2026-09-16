"use client";

import {
  BellRing,
  CheckCircle2,
  FileCheck2,
  LockKeyhole,
  Radio,
  Route,
  ShieldCheck,
} from "lucide-react";
import type { CSSProperties, KeyboardEvent } from "react";
import { PageContainer, SectionHeading } from "@/components/shared/page-container";
import { SafetyProductPreview } from "@/components/public/safety-product-preview";
import { publicRoutes } from "@/config/routes";
import { publicContent } from "@/config/content";
import { buttonVariants } from "@/components/ui/button";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { useEffect, useRef, useState } from "react";

const stepIconMap = {
  FileCheck2,
  Route,
  BellRing,
  CheckCircle2,
} as const;
const trustSteps = publicContent.safetyFlow.steps;

export function SafetyFlowSection({ compact = false }: { compact?: boolean }) {
  const content = publicContent.safetyFlow;
  const storyRef = useRef<HTMLDivElement>(null);
  const cardStackRef = useRef<HTMLDivElement>(null);
  const [activeStep, setActiveStep] = useState(0);
  const [storyReady, setStoryReady] = useState(false);

  useEffect(() => {
    const story = storyRef.current;
    if (!story) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    let animationFrame: number | null = null;
    let isReady = false;
    const updateActiveStep = () => {
      if (animationFrame !== null) return;

      animationFrame = window.requestAnimationFrame(() => {
        animationFrame = null;
        if (!isReady) {
          isReady = true;
          setStoryReady(true);
        }
        const scrollDistance = story.offsetHeight - window.innerHeight;
        const progress =
          scrollDistance > 0
            ? Math.min(
                1,
                Math.max(0, -story.getBoundingClientRect().top / scrollDistance),
              )
            : 0;
        const nextStep = Math.min(
          trustSteps.length - 1,
          Math.floor(progress * trustSteps.length),
        );

        setActiveStep((currentStep) =>
          currentStep === nextStep ? currentStep : nextStep,
        );
      });
    };

    updateActiveStep();
    window.addEventListener("scroll", updateActiveStep, { passive: true });
    window.addEventListener("resize", updateActiveStep);

    return () => {
      if (animationFrame !== null) window.cancelAnimationFrame(animationFrame);
      window.removeEventListener("scroll", updateActiveStep);
      window.removeEventListener("resize", updateActiveStep);
    };
  }, []);

  useEffect(() => {
    const cardStack = cardStackRef.current;
    if (
      !cardStack ||
      !("IntersectionObserver" in window) ||
      window.matchMedia("(min-width: 64rem)").matches
    ) {
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        const visibleEntry = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
        const nextStep = visibleEntry?.target.getAttribute("data-safety-step");

        if (nextStep) setActiveStep(Number(nextStep));
      },
      { threshold: [0.5, 0.75], rootMargin: "-15% 0px -15% 0px" },
    );

    cardStack
      .querySelectorAll<HTMLElement>("[data-safety-step]")
      .forEach((card) => observer.observe(card));

    return () => observer.disconnect();
  }, []);

  const handleStepKeyDown = (event: KeyboardEvent<HTMLButtonElement>, index: number) => {
    let nextStep: number | undefined;

    if (event.key === "ArrowDown" || event.key === "ArrowRight") {
      nextStep = Math.min(trustSteps.length - 1, index + 1);
    } else if (event.key === "ArrowUp" || event.key === "ArrowLeft") {
      nextStep = Math.max(0, index - 1);
    } else if (event.key === "Home") {
      nextStep = 0;
    } else if (event.key === "End") {
      nextStep = trustSteps.length - 1;
    }

    if (nextStep !== undefined) {
      event.preventDefault();
      setActiveStep(nextStep);
    }
  };

  return (
    <section
      className={cn("public-section bg-warm-white", compact && "public-section-compact")}
    >
      <PageContainer>
        <div ref={storyRef} className="safety-story" data-story-ready={storyReady}>
          <div className="safety-story-sticky">
            <div className="safety-story-stage">
              <div className="safety-story-intro">
                <SectionHeading
                  eyebrow={content.eyebrow}
                  title={content.title}
                  description={content.description}
                />
                <div className="border-olive/15 bg-olive/5 text-deep-navy mt-5 flex max-w-xl items-center gap-2.5 rounded-xl border p-3 text-sm">
                  <span className="bg-olive flex size-8 shrink-0 items-center justify-center rounded-full text-white">
                    <ShieldCheck className="size-4" strokeWidth={1.75} aria-hidden />
                  </span>
                  <p>
                    <span className="font-semibold">{content.clarityTitle}</span>{" "}
                    {content.clarityDescription}
                  </p>
                </div>
              </div>

              <div className="safety-story-experience">
                <div
                  className="safety-story-rail"
                  style={
                    {
                      "--story-progress": `${(activeStep / (trustSteps.length - 1)) * 100}%`,
                    } as CSSProperties
                  }
                >
                  <span className="safety-story-rail-line" />
                  {trustSteps.map(({ number, title }, index) => (
                    <button
                      key={number}
                      type="button"
                      className={cn(
                        "safety-story-dot",
                        storyReady && index <= activeStep && "safety-story-dot-active",
                        storyReady && index === activeStep && "safety-story-dot-current",
                      )}
                      aria-label={`Show step ${number}: ${title}`}
                      aria-current={index === activeStep ? "step" : undefined}
                      tabIndex={storyReady && index !== activeStep ? -1 : 0}
                      onClick={() => setActiveStep(index)}
                      onKeyDown={(event) => handleStepKeyDown(event, index)}
                    >
                      {number}
                    </button>
                  ))}
                </div>

                <div ref={cardStackRef} className="safety-story-card-stack" aria-live="polite">
                  {trustSteps.map(
                    ({ number, icon, title, description, status }, index) => {
                      const Icon = stepIconMap[icon];

                      return (
                        <article
                          key={title}
                          data-safety-step={index}
                          className={cn(
                            "safety-story-step border-border/70 bg-cream shadow-soft rounded-3xl border p-5 sm:p-7",
                            storyReady &&
                              index === activeStep &&
                              "safety-story-step-active",
                          )}
                          aria-hidden={storyReady ? index !== activeStep : undefined}
                        >
                          <div className="flex items-center justify-between">
                            <span className="text-caption text-olive font-bold tracking-[0.14em]">
                              {number}
                            </span>
                            <span className="bg-olive/10 text-olive flex size-10 items-center justify-center rounded-full">
                              <Icon className="size-5" strokeWidth={1.75} aria-hidden />
                            </span>
                          </div>
                          <h3 className="text-deep-navy mt-5 text-xl font-semibold">
                            {title}
                          </h3>
                          <p className="text-muted-foreground mt-3 max-w-xl leading-relaxed">
                            {description}
                          </p>
                          <p className="bg-warm-white text-caption text-olive mt-6 inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 font-semibold">
                            <Radio className="size-3.5" aria-hidden />
                            {status}
                          </p>
                        </article>
                      );
                    },
                  )}
                </div>
              </div>

              <SafetyProductPreview activeStep={activeStep} />
            </div>
          </div>
        </div>

        <div className="border-border/70 bg-deep-navy mt-6 flex flex-col gap-4 rounded-3xl border p-5 text-white sm:flex-row sm:items-center sm:justify-between sm:p-6">
          <div className="flex items-start gap-3">
            <LockKeyhole className="text-olive mt-0.5 size-5 shrink-0" aria-hidden />
            <h3 className="max-w-2xl text-base leading-snug font-semibold text-white sm:text-lg">
              {content.ctaTitle}
            </h3>
          </div>
          <Link
            href={publicRoutes.safety}
            className={cn(
              buttonVariants({ variant: "outline", size: "sm" }),
              "shrink-0 border-white/25 bg-transparent text-white hover:bg-white/10",
            )}
          >
            {content.ctaLabel}
          </Link>
        </div>
      </PageContainer>
    </section>
  );
}
