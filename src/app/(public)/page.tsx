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
import { SafetyFlowSection } from "@/components/public/safety-flow-section";
import { FeatureCard } from "@/components/shared/feature-card";
import { FAQItem } from "@/components/shared/faq-item";
import { CTASection } from "@/components/shared/cta-section";
import { PageContainer, SectionHeading } from "@/components/shared/page-container";
import { JsonLd, organizationJsonLd, websiteJsonLd } from "@/lib/structured-data";
import { buildPageMetadata } from "@/lib/seo";
import { publicContent } from "@/config/content";
import { authRoutes, publicRoutes } from "@/config/routes";
import Image from "next/image";
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
      <div className="bg-warm-white/95 text-deep-navy shadow-medium absolute right-5 bottom-5 left-5 rounded-2xl p-4 backdrop-blur">
        <p className="text-caption text-olive font-semibold tracking-wide uppercase">
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
                  className="border-border/70 bg-cream/80 rounded-2xl border p-5"
                >
                  <p className="text-caption text-olive font-bold tracking-wider">
                    {step.step}
                  </p>
                  <h3 className="text-deep-navy mt-2 text-lg font-semibold">
                    {step.title}
                  </h3>
                  <p className="text-muted-foreground mt-2 text-sm">{step.description}</p>
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

        <section className="bg-deep-navy text-warm-white py-16 sm:py-20">
          <PageContainer className="grid items-center gap-10 lg:grid-cols-2">
            <div>
              <p className="text-caption text-olive font-semibold tracking-wider uppercase">
                Drive with us
              </p>
              <h2 className="text-h2 text-warm-white mt-2">{c.driverRecruit.title}</h2>
              <p className="mt-4 text-white/75">{c.driverRecruit.description}</p>
              <ul className="mt-6 space-y-3">
                {c.driverRecruit.points.map((point) => (
                  <li
                    key={point}
                    className="flex items-center gap-3 text-sm text-white/90"
                  >
                    <span className="bg-olive inline-flex size-6 items-center justify-center rounded-full text-white">
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

        <SafetyFlowSection />

        <TestimonialSection />

        <section className="bg-warm-white py-16 sm:py-20">
          <PageContainer>
            <SectionHeading
              eyebrow="Cities"
              title="Popular cities"
              description={c.popularCities.note}
              align="center"
            />
            <ul className="mx-auto mt-10 grid max-w-5xl gap-5 sm:grid-cols-2 lg:grid-cols-5">
              {c.popularCities.cities.map((city) => (
                <li
                  key={city.name}
                  className="group border-border/70 bg-cream shadow-soft hover:border-olive/40 hover:shadow-medium overflow-hidden rounded-3xl border transition-all hover:-translate-y-1"
                >
                  <div className="relative aspect-[4/3] overflow-hidden">
                    <Image
                      src={city.image}
                      alt={city.alt}
                      fill
                      sizes="(min-width: 1024px) 180px, (min-width: 640px) 45vw, 100vw"
                      className="object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                    <div className="from-deep-navy/75 absolute inset-0 bg-gradient-to-t via-transparent to-transparent" />
                    <span className="absolute bottom-3 left-4 text-sm font-bold text-white">
                      {city.name}
                    </span>
                  </div>
                  <div className="p-4">
                    <p className="text-caption text-olive font-semibold tracking-wide uppercase">
                      {city.region}
                    </p>
                    <p className="text-muted-foreground mt-2 text-sm leading-relaxed">
                      {city.description}
                    </p>
                  </div>
                </li>
              ))}
            </ul>
          </PageContainer>
        </section>

        <section id="faq" className="bg-cream scroll-mt-24 py-16 sm:py-20">
          <PageContainer className="grid items-start gap-10 lg:grid-cols-[0.8fr_1.2fr]">
            <SectionHeading
              eyebrow="FAQ"
              title="Common questions"
              description="Answers about booking, driving, payments, and support."
              className="lg:sticky lg:top-28"
            />
            <div>
              <FAQItem items={c.faq} />
              <p className="text-muted-foreground mt-6 text-center text-sm lg:text-left">
                Still need help?{" "}
                <Link
                  href={publicRoutes.contact}
                  className="text-olive font-semibold hover:underline"
                >
                  Contact our team
                </Link>
              </p>
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
