import {
  Check,
  Headphones,
  Route,
  ShieldCheck,
  Wallet,
  Zap,
  type LucideIcon,
} from "lucide-react";
import { HeroSection } from "@/components/public/hero-section";
import { AppDownloadSection } from "@/components/public/app-download-section";
import { ExperienceHighlights } from "@/components/public/testimonial-section";
import { SafetyFlowSection } from "@/components/public/safety-flow-section";
import { JourneyShowcase } from "@/components/public/journey-showcase";
import { DriverDashboardPreview } from "@/components/public/driver-dashboard-preview";
import { ScrollReveal } from "@/components/shared/scroll-reveal";
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
  title: { absolute: "DriveX — Safe, Reliable Trips" },
  description:
    "Book verified Drivers with DriveX. Safe, reliable driving services with transparent pricing and shared Trip records for Users and Drivers.",
  path: publicRoutes.home,
});

const iconMap: Record<string, LucideIcon> = {
  Zap,
  ShieldCheck,
  Route,
  Wallet,
  Headphones,
};

export default function HomePage() {
  const c = publicContent;

  return (
    <>
      <JsonLd data={organizationJsonLd()} />
      <JsonLd data={websiteJsonLd()} />
      <main>
        <HeroSection />

        <section className="public-section bg-cream">
          <PageContainer>
            <SectionHeading
              eyebrow="Why DriveX"
              title="Built for everyday trips"
              description="A clean booking experience for Users and a clear Trip workflow for Drivers — on one shared platform."
              align="center"
            />
            <ScrollReveal delay={80}>
              <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
                {c.features.map((feature) => (
                  <FeatureCard
                    key={feature.title}
                    icon={iconMap[feature.icon]}
                    eyebrow={feature.eyebrow}
                    title={feature.title}
                    description={feature.description}
                  />
                ))}
              </div>
            </ScrollReveal>
          </PageContainer>
        </section>

        <section className="public-section bg-warm-white">
          <PageContainer>
            <SectionHeading
              eyebrow="How it works"
              title="See the journey unfold"
              description="Follow the User or Driver journey from request to completed Trip."
            />
            <ScrollReveal className="mt-8" delay={80}>
              <JourneyShowcase
                userSteps={c.journeys.user}
                driverSteps={c.journeys.driver}
              />
            </ScrollReveal>
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

        <section className="public-section bg-deep-navy text-warm-white">
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
            <ScrollReveal delay={120}>
              <DriverDashboardPreview />
            </ScrollReveal>
          </PageContainer>
        </section>

        <SafetyFlowSection />

        <ExperienceHighlights />

        <section className="public-section bg-warm-white">
          <PageContainer>
            <SectionHeading
              eyebrow="Cities"
              title="Popular cities"
              description={c.popularCities.note}
              align="center"
            />
            <ScrollReveal className="mt-8" delay={80}>
              <ul className="mx-auto grid max-w-5xl gap-5 sm:grid-cols-2 lg:grid-cols-5">
                {c.popularCities.cities.map((city) => (
                  <li
                    key={city.name}
                    className="motion-lift group border-border/70 bg-cream shadow-soft hover:border-olive/40 overflow-hidden rounded-3xl border"
                  >
                    <div className="relative aspect-[4/3] overflow-hidden">
                      <Image
                        src={city.image}
                        alt={city.alt}
                        fill
                        loading="lazy"
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
            </ScrollReveal>
          </PageContainer>
        </section>

        <section id="faq" className="public-section bg-cream scroll-mt-24">
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
          description="Create an account, verify your phone, and choose whether you want to book a Driver or provide driving services."
          primary={{ label: "Book a Driver", href: authRoutes.login }}
          secondary={{ label: "Drive With Us", href: publicRoutes.driveWithUs }}
        />
      </main>
    </>
  );
}
