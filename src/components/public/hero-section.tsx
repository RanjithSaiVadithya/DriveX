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
        className="hero-orbit bg-hero-circle absolute top-1/2 left-1/2 size-[88%] -translate-x-1/2 -translate-y-1/2 rounded-full"
        aria-hidden
      />
      <div
        className="hero-orbit hero-orbit-reverse absolute top-1/2 left-1/2 size-[72%] -translate-x-1/2 -translate-y-1/2 rounded-full border border-white/40 bg-gradient-to-b from-white/50 to-transparent"
        aria-hidden
      />
      <div className="hero-car-enter relative z-10">
        <svg
          viewBox="0 0 480 360"
          className="hero-car-idle h-full w-full drop-shadow-[0_24px_40px_rgba(18,26,31,0.18)]"
          role="img"
          aria-label="White vehicle ready for your next Trip"
        >
          <defs>
            <linearGradient id="hero-windshield-shade" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0" stopColor="#dce6e1" stopOpacity="0.9" />
              <stop offset="0.55" stopColor="#b7c7be" stopOpacity="0.78" />
              <stop offset="1" stopColor="#8da196" stopOpacity="0.88" />
            </linearGradient>
            <linearGradient id="hero-window-shade" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0" stopColor="#dbe5e0" />
              <stop offset="0.6" stopColor="#b1c0b8" />
              <stop offset="1" stopColor="#8c9f95" />
            </linearGradient>
          </defs>
          <title>DriverDosth vehicle</title>
          <ellipse cx="240" cy="300" rx="140" ry="14" fill="rgba(18,26,31,0.12)" />
          <g className="hero-motion-lines" aria-hidden>
            <path
              d="M76 210h42M362 210h42M82 296h38M360 296h38"
              stroke="#2d5a27"
              strokeWidth="4"
              strokeLinecap="round"
              strokeDasharray="16 12"
              opacity="0.35"
            />
          </g>
          <path
            d="M78 230c8-42 36-78 78-96 28-12 58-18 96-16 48 2 92 18 124 48 18 16 32 36 40 62l8 22H70l8-20z"
            fill="#f4f6f5"
            stroke="#d5dcd8"
            strokeWidth="3"
          />
          <path
            d="M148 160c24-23 54-32 92-30 38-2 68 7 92 30l-20 5c-20-15-43-21-72-19-29-2-52 4-72 19l-20-5z"
            fill="url(#hero-windshield-shade)"
            opacity="0.9"
          />
          <path
            d="M164 176a8 8 0 0 1 8-8h40a8 8 0 0 1 8 8v20a8 8 0 0 1-8 8h-40a8 8 0 0 1-8-8z"
            fill="url(#hero-window-shade)"
            stroke="#a6b6ad"
            strokeWidth="2"
          />
          <path
            d="M260 176a8 8 0 0 1 8-8h40a8 8 0 0 1 8 8v20a8 8 0 0 1-8 8h-40a8 8 0 0 1-8-8z"
            fill="url(#hero-window-shade)"
            stroke="#a6b6ad"
            strokeWidth="2"
          />
          <path
            d="M174 176h22M270 176h22"
            stroke="#f4f6f5"
            strokeWidth="3"
            strokeLinecap="round"
            opacity="0.45"
          />
          <path
            d="M70 232h340c8 0 14 6 14 14v18c0 8-6 14-14 14H70c-8 0-14-6-14-14v-18c0-8 6-14 14-14z"
            fill="#ffffff"
            stroke="#d0d8d3"
            strokeWidth="2"
          />
          <g className="hero-wheel hero-wheel-left">
            <circle cx="140" cy="268" r="28" fill="#121a1f" />
            <circle cx="140" cy="268" r="14" fill="#e8ece9" />
            <path
              d="M140 257v22M129 268h22"
              stroke="#9aa9a0"
              strokeWidth="2"
              strokeLinecap="round"
            />
          </g>
          <g className="hero-wheel hero-wheel-right">
            <circle cx="340" cy="268" r="28" fill="#121a1f" />
            <circle cx="340" cy="268" r="14" fill="#e8ece9" />
            <path
              d="M340 257v22M329 268h22"
              stroke="#9aa9a0"
              strokeWidth="2"
              strokeLinecap="round"
            />
          </g>
          <rect
            className="hero-light-pulse"
            x="78"
            y="236"
            width="28"
            height="10"
            rx="3"
            fill="#2d5a27"
          />
          <rect
            className="hero-light-pulse"
            x="374"
            y="236"
            width="22"
            height="10"
            rx="3"
            fill="#2d5a27"
            opacity="0.7"
          />
          <path
            d="M210 220h60"
            stroke="#2d5a27"
            strokeWidth="3"
            strokeLinecap="round"
            opacity="0.35"
          />
        </svg>
      </div>
    </div>
  );
}

export function HeroSection() {
  const { hero } = publicContent;

  return (
    <section className="bg-warm-white relative overflow-hidden">
      <div
        className="pointer-events-none absolute inset-0"
        aria-hidden
        style={{
          backgroundImage:
            "radial-gradient(ellipse 55% 50% at 90% 10%, rgb(45 90 39 / 0.08), transparent), radial-gradient(ellipse 40% 35% at 0% 100%, rgb(232 228 217 / 0.7), transparent)",
        }}
      />
      <PageContainer className="relative grid items-center gap-8 py-12 lg:grid-cols-2 lg:gap-8 lg:py-16">
        <div className="motion-enter">
          <p className="bg-olive/10 text-caption text-olive inline-flex items-center rounded-full px-3 py-1 font-semibold tracking-[0.12em] uppercase">
            {hero.eyebrow}
          </p>
          <h1 className="text-display mt-5">
            {hero.titleLine1}
            <br />
            <span className="font-accent text-olive text-[1.15em] font-semibold">
              {hero.titleLine2}
            </span>
          </h1>
          <p className="text-muted-foreground mt-5 max-w-xl text-base sm:text-lg">
            {hero.description}
          </p>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
            <Link
              href={authRoutes.login}
              className={cn(
                buttonVariants({ variant: "default", size: "lg" }),
                "w-full sm:w-auto",
              )}
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

        <div className="motion-enter motion-enter-delay-2">
          <HeroCarVisual />
        </div>
      </PageContainer>
    </section>
  );
}
