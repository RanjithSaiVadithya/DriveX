import {
  Check,
  Headphones,
  ShieldCheck,
  Wallet,
  Zap,
  type LucideIcon,
} from "lucide-react";
import { HeroSection } from "@/components/public/hero-section";
import { AppDownloadSection } from "@/components/public/app-download-section";
import { TestimonialSection } from "@/components/public/testimonial-section";
import { FeatureCard } from "@/components/shared/feature-card";
import { FAQItem } from "@/components/shared/faq-item";
import { CTASection } from "@/components/shared/cta-section";
import { PageContainer, SectionHeading } from "@/components/shared/page-container";
import { JsonLd, organizationJsonLd, websiteJsonLd } from "@/lib/structured-data";
import { buildPageMetadata } from "@/lib/seo";
import { publicContent } from "@/config/content";
import { authRoutes, publicRoutes } from "@/config/routes";
import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export const metadata = buildPageMetadata({
  title: { absolute: "DriveX — Safe, Reliable Rides" },
  description:
    "Book verified drivers with DriveX. Safe, reliable rides with transparent pricing and shared trip records for riders and drivers.",
  path: publicRoutes.home,
});

const iconMap: Record<string, LucideIcon> = {
  Zap,
  ShieldCheck,
  Wallet,
  Headphones,
};

function DriverRecruitVisual() {
  return (
    <div
      className="relative min-h-[18rem] overflow-hidden rounded-3xl bg-[#1c272e]"
      aria-hidden
    >
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_30%,rgba(45,90,39,0.35),transparent_50%)]" />
      <svg viewBox="0 0 420 320" className="absolute inset-0 h-full w-full opacity-90">
        <rect x="40" y="60" width="200" height="180" rx="16" fill="#243038" />
        <rect x="58" y="78" width="164" height="90" rx="10" fill="#3a4a52" />
        <circle cx="150" cy="210" r="36" fill="#d8c4a8" />
        <path d="M118 250c10-28 54-28 64 0" fill="#2d5a27" />
        <rect x="250" y="120" width="140" height="100" rx="12" fill="#2a353c" />
        <circle cx="280" cy="220" r="18" fill="#121a1f" />
        <circle cx="360" cy="220" r="18" fill="#121a1f" />
      </svg>
      <div className="absolute bottom-5 left-5 right-5 rounded-2xl bg-warm-white/95 p-4 text-deep-navy shadow-medium backdrop-blur">
        <p className="text-caption font-semibold uppercase tracking-wide text-olive">
          Driver mode
        </p>
        <p className="mt-1 font-semibold">Go online · Accept trips · Earn</p>
      </div>
    </div>
  );
}

export default function HomePage() {
  const c = publicContent;

  return (
    <>
      <JsonLd data={organizationJsonLd()} />
      <JsonLd data={websiteJsonLd()} />
      <main>
        <HeroSection />

        <section className="bg-cream py-16 sm:py-20">
          <PageContainer>
            <SectionHeading
              eyebrow="Why DriveX"
              title="Built for everyday trips"
              description="A clean booking experience for riders and a clear trip workflow for drivers — on one shared platform."
              align="center"
            />
            <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
              {c.features.map((feature) => (
                <FeatureCard
                  key={feature.title}
                  icon={iconMap[feature.icon]}
                  title={feature.title}
                  description={feature.description}
                />
              ))}
            </div>
          </PageContainer>
        </section>

        <section className="bg-warm-white py-16 sm:py-20">
          <PageContainer>
            <SectionHeading
              eyebrow="How it works"
              title="Book a driver in four steps"
              description="From request to arrival, status updates keep both sides aligned."
            />
            <ol className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {c.howItWorksSteps.map((step) => (
                <li
                  key={step.step}
                  className="rounded-2xl border border-border/70 bg-cream/80 p-5"
                >
                  <p className="text-caption font-bold tracking-wider text-olive">
                    {step.step}
                  </p>
                  <h3 className="mt-2 text-lg font-semibold text-deep-navy">
                    {step.title}
                  </h3>
                  <p className="mt-2 text-sm text-muted-foreground">{step.description}</p>
                </li>
              ))}
            </ol>
            <div className="mt-8">
              <Link
                href={publicRoutes.howItWorks}
                className={cn(buttonVariants({ variant: "link" }), "px-0")}
              >
                See the full user and driver journey
              </Link>
            </div>
          </PageContainer>
        </section>

        <section className="bg-deep-navy py-16 text-warm-white sm:py-20">
          <PageContainer className="grid items-center gap-10 lg:grid-cols-2">
            <div>
              <p className="text-caption font-semibold uppercase tracking-wider text-olive">
                Drive with us
              </p>
              <h2 className="mt-2 text-h2 text-warm-white">{c.driverRecruit.title}</h2>
              <p className="mt-4 text-white/75">{c.driverRecruit.description}</p>
              <ul className="mt-6 space-y-3">
                {c.driverRecruit.points.map((point) => (
                  <li key={point} className="flex items-center gap-3 text-sm text-white/90">
                    <span className="inline-flex size-6 items-center justify-center rounded-full bg-olive text-white">
                      <Check className="size-3.5" strokeWidth={3} aria-hidden />
                    </span>
                    {point}
                  </li>
                ))}
              </ul>
              <Link
                href={publicRoutes.driveWithUs}
                className={cn(
                  buttonVariants({ variant: "default", size: "lg" }),
                  "mt-8 inline-flex",
                )}
              >
                {c.driverRecruit.cta}
              </Link>
            </div>
            <DriverRecruitVisual />
          </PageContainer>
        </section>

        <section className="py-16 sm:py-20">
          <PageContainer>
            <SectionHeading
              eyebrow="Safety"
              title="Designed with safer trips in mind"
              description="Safety practices we are building into the product — without claiming services that are not live yet."
            />
            <div className="mt-10 grid gap-4 sm:grid-cols-2">
              {c.safetyHighlights.map((item) => (
                <article
                  key={item.title}
                  className="rounded-2xl border border-border bg-warm-white p-5 shadow-soft"
                >
                  <h3 className="font-semibold text-deep-navy">{item.title}</h3>
                  <p className="mt-2 text-sm text-muted-foreground">{item.description}</p>
                </article>
              ))}
            </div>
            <Link
              href={publicRoutes.safety}
              className={cn(buttonVariants({ variant: "link" }), "mt-6 px-0")}
            >
              Read the full safety overview
            </Link>
          </PageContainer>
        </section>

        <TestimonialSection />

        <section className="bg-cream py-16 sm:py-20">
          <PageContainer>
            <SectionHeading
              eyebrow="Cities"
              title="Popular cities"
              description={c.citiesDemo.note}
            />
            <ul className="mt-8 flex flex-wrap gap-3">
              {c.citiesDemo.cities.map((city) => (
                <li
                  key={city}
                  className="rounded-full border border-border bg-warm-white px-4 py-2 text-sm font-medium text-deep-navy shadow-soft"
                >
                  {city}
                </li>
              ))}
            </ul>
          </PageContainer>
        </section>

        <section id="faq" className="scroll-mt-24 bg-warm-white py-16 sm:py-20">
          <PageContainer className="max-w-3xl">
            <SectionHeading
              eyebrow="FAQ"
              title="Common questions"
              description="Answers about booking, driving, payments, and support."
              align="center"
            />
            <div className="mt-10">
              <FAQItem items={c.faq} />
            </div>
          </PageContainer>
        </section>

        <div id="download-app" className="scroll-mt-24">
          <AppDownloadSection />
        </div>

        <CTASection
          tone="navy"
          title="Ready for your next trip?"
          description="Create an account, verify with OTP, and choose whether you want to ride or drive."
          primary={{ label: "Book a Driver", href: authRoutes.login }}
          secondary={{ label: "Drive With Us", href: publicRoutes.driveWithUs }}
        />
      </main>
    </>
  );
}
