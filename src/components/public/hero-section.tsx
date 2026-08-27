import Link from "next/link";
import { PageContainer } from "@/components/shared/page-container";
import { buttonVariants } from "@/components/ui/button";
import { AppDownloadSection } from "@/components/public/app-download-section";
import { publicContent } from "@/config/content";
import { authRoutes, publicRoutes } from "@/config/routes";
import { cn } from "@/lib/utils";

function HeroCarVisual() {
  return (
    <div className="relative mx-auto aspect-square w-full max-w-md lg:max-w-none">
      <div
        className="absolute left-1/2 top-1/2 size-[88%] -translate-x-1/2 -translate-y-1/2 rounded-full bg-hero-circle"
        aria-hidden
      />
      <div
        className="absolute left-1/2 top-1/2 size-[72%] -translate-x-1/2 -translate-y-1/2 rounded-full border border-white/40 bg-gradient-to-b from-white/50 to-transparent"
        aria-hidden
      />
      <svg
        viewBox="0 0 480 360"
        className="animate-float relative z-10 h-full w-full drop-shadow-[0_24px_40px_rgba(18,26,31,0.18)]"
        role="img"
        aria-label="White sedan ready for your next trip"
      >
        <title>DriveX vehicle</title>
        <ellipse cx="240" cy="300" rx="140" ry="14" fill="rgba(18,26,31,0.12)" />
        <path
          d="M78 230c8-42 36-78 78-96 28-12 58-18 96-16 48 2 92 18 124 48 18 16 32 36 40 62l8 22H70l8-20z"
          fill="#f4f6f5"
          stroke="#d5dcd8"
          strokeWidth="3"
        />
        <path
          d="M132 152c22-28 52-42 92-40 46 2 84 22 112 56l-28 6c-20-22-48-34-82-34-30 0-54 10-72 28l-22-16z"
          fill="#c5d0ca"
          opacity="0.55"
        />
        <rect x="168" y="168" width="52" height="36" rx="8" fill="#9aaca3" opacity="0.45" />
        <rect x="248" y="168" width="64" height="36" rx="8" fill="#9aaca3" opacity="0.45" />
        <path
          d="M70 232h340c8 0 14 6 14 14v18c0 8-6 14-14 14H70c-8 0-14-6-14-14v-18c0-8 6-14 14-14z"
          fill="#ffffff"
          stroke="#d0d8d3"
          strokeWidth="2"
        />
        <circle cx="140" cy="268" r="28" fill="#121a1f" />
        <circle cx="140" cy="268" r="14" fill="#e8ece9" />
        <circle cx="340" cy="268" r="28" fill="#121a1f" />
        <circle cx="340" cy="268" r="14" fill="#e8ece9" />
        <rect x="96" y="236" width="28" height="10" rx="3" fill="#2d5a27" />
        <rect x="356" y="236" width="22" height="10" rx="3" fill="#2d5a27" opacity="0.7" />
        <path
          d="M210 220h60"
          stroke="#2d5a27"
          strokeWidth="3"
          strokeLinecap="round"
          opacity="0.35"
        />
      </svg>
    </div>
  );
}

export function HeroSection() {
  const { hero } = publicContent;

  return (
    <section className="relative overflow-hidden bg-warm-white">
      <div
        className="pointer-events-none absolute inset-0"
        aria-hidden
        style={{
          backgroundImage:
            "radial-gradient(ellipse 55% 50% at 90% 10%, rgb(45 90 39 / 0.08), transparent), radial-gradient(ellipse 40% 35% at 0% 100%, rgb(232 228 217 / 0.7), transparent)",
        }}
      />
      <PageContainer className="relative grid items-center gap-10 py-14 lg:grid-cols-2 lg:gap-8 lg:py-20">
        <div className="animate-slide-up">
          <p className="inline-flex items-center rounded-full bg-olive/10 px-3 py-1 text-caption font-semibold uppercase tracking-[0.12em] text-olive">
            {hero.eyebrow}
          </p>
          <h1 className="text-display mt-5">
            {hero.titleLine1}
            <br />
            <span className="font-accent text-[1.15em] font-semibold text-olive">
              {hero.titleLine2}
            </span>
          </h1>
          <p className="mt-5 max-w-xl text-base text-muted-foreground sm:text-lg">
            {hero.description}
          </p>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
            <Link
              href={authRoutes.login}
              className={cn(buttonVariants({ variant: "default", size: "lg" }), "w-full sm:w-auto")}
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

        <div className="animate-fade-in" style={{ animationDelay: "120ms" }}>
          <HeroCarVisual />
        </div>
      </PageContainer>
    </section>
  );
}
