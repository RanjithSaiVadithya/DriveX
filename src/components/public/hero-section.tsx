import Link from "next/link";
import { PageContainer } from "@/components/shared/page-container";
import { buttonVariants } from "@/components/ui/button";
import { AppDownloadSection } from "@/components/public/app-download-section";
import { publicContent } from "@/config/content";
import { authRoutes, publicRoutes } from "@/config/routes";
import { cn } from "@/lib/utils";

export function HeroSection() {
  const { hero } = publicContent;

  return (
    <section className="relative overflow-hidden border-b border-border/60">
      <div
        className="pointer-events-none absolute inset-0 opacity-70"
        aria-hidden
        style={{
          backgroundImage:
            "radial-gradient(ellipse 70% 60% at 85% 20%, rgb(224 120 58 / 0.18), transparent), radial-gradient(ellipse 50% 40% at 10% 80%, rgb(92 107 58 / 0.12), transparent)",
        }}
      />
      <PageContainer className="relative grid items-center gap-10 py-14 lg:grid-cols-2 lg:gap-12 lg:py-20">
        <div className="animate-slide-up">
          <p className="text-caption font-semibold uppercase tracking-[0.14em] text-orange">
            {hero.eyebrow}
          </p>
          <h1 className="text-display mt-3">
            {hero.titleLine1}
            <br />
            <span className="text-olive">{hero.titleLine2}</span>
          </h1>
          <p className="mt-5 max-w-xl text-base text-muted-foreground sm:text-lg">
            {hero.description}
          </p>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
            <Link
              href={authRoutes.login}
              className={cn(buttonVariants({ variant: "navy", size: "lg" }), "w-full sm:w-auto")}
            >
              {hero.primaryCta}
            </Link>
            <Link
              href={publicRoutes.driveWithUs}
              className={cn(
                buttonVariants({ variant: "outline", size: "lg" }),
                "w-full sm:w-auto",
              )}
            >
              {hero.secondaryCta}
            </Link>
          </div>
          <div className="mt-8">
            <AppDownloadSection compact />
          </div>
        </div>

        <div
          className="relative mx-auto aspect-[4/3] w-full max-w-lg animate-fade-in lg:max-w-none"
          aria-hidden
        >
          <div className="absolute inset-0 rounded-2xl bg-deep-navy shadow-medium" />
          <div className="absolute inset-4 overflow-hidden rounded-xl bg-gradient-to-br from-[#1a3558] via-deep-navy to-[#0a1a2e]">
            <svg
              viewBox="0 0 400 300"
              className="h-full w-full"
              role="img"
              aria-label="Stylized city map with a highlighted ride route"
            >
              <title>Ride route preview</title>
              <path
                d="M40 220 H360 M40 160 H360 M40 100 H360 M100 40 V260 M180 40 V260 M260 40 V260 M320 40 V260"
                stroke="rgba(232,220,200,0.15)"
                strokeWidth="2"
                fill="none"
              />
              <circle cx="120" cy="200" r="10" fill="#5c6b3a" />
              <circle cx="300" cy="90" r="10" fill="#e0783a" />
              <path
                d="M120 200 C160 140, 240 160, 300 90"
                stroke="#e0783a"
                strokeWidth="4"
                fill="none"
                strokeLinecap="round"
              />
              <rect x="70" y="50" width="70" height="40" rx="6" fill="rgba(247,243,235,0.12)" />
              <rect x="220" y="180" width="90" height="50" rx="6" fill="rgba(247,243,235,0.12)" />
              <g transform="translate(200 145)">
                <rect x="-28" y="-12" width="56" height="24" rx="8" fill="#fffdf8" />
                <circle cx="-14" cy="14" r="6" fill="#0f2744" />
                <circle cx="14" cy="14" r="6" fill="#0f2744" />
              </g>
            </svg>
          </div>
          <div className="absolute -bottom-4 left-6 right-6 rounded-xl border border-border bg-warm-white p-4 shadow-medium sm:left-10 sm:right-auto sm:w-64">
            <p className="text-caption font-semibold uppercase tracking-wide text-olive">
              Live trip status
            </p>
            <p className="mt-1 text-sm font-semibold text-deep-navy">Driver arriving</p>
            <p className="text-small text-muted-foreground">Shared trip record · ETA update</p>
          </div>
        </div>
      </PageContainer>
    </section>
  );
}
