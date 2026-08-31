import Link from "next/link";
import { PageContainer, SectionHeading } from "@/components/shared/page-container";
import { FeatureCard } from "@/components/shared/feature-card";
import { CTASection } from "@/components/shared/cta-section";
import { buttonVariants } from "@/components/ui/button";
import { publicContent } from "@/config/content";
import { buildPageMetadata } from "@/lib/seo";
import { authRoutes, publicRoutes } from "@/config/routes";
import { cn } from "@/lib/utils";
import { Check, Clock3, FileCheck2, HandCoins, Headset } from "lucide-react";
import { DriverDashboardPreview } from "@/components/public/driver-dashboard-preview";
import { ScrollReveal } from "@/components/shared/scroll-reveal";

export const metadata = buildPageMetadata({
  title: { absolute: "Drive With DriveX — Earn on Your Schedule" },
  description:
    "Drive with DriveX: flexible hours, clear Trip history, earnings visibility, and document workflows for Drivers.",
  path: publicRoutes.driveWithUs,
});

export default function DriveWithUsPage() {
  const { driveWithUs } = publicContent;
  const icons = [Clock3, FileCheck2, HandCoins, Headset];

  return (
    <main>
      <section className="public-section border-border/70 bg-deep-navy text-warm-white border-b">
        <PageContainer className="grid items-center gap-10 lg:grid-cols-2">
          <div>
            <p className="text-caption text-olive font-semibold tracking-wider uppercase">
              Drive with us
            </p>
            <h1 className="text-h1 text-warm-white mt-3">{driveWithUs.heroTitle}</h1>
            <p className="mt-5 text-lg text-white/75">{driveWithUs.heroDescription}</p>
            <ul className="mt-6 space-y-3">
              {publicContent.driverRecruit.points.map((point) => (
                <li key={point} className="flex items-center gap-3 text-sm text-white/90">
                  <span className="bg-olive inline-flex size-6 items-center justify-center rounded-full text-white">
                    <Check className="size-3.5" strokeWidth={3} aria-hidden />
                  </span>
                  {point}
                </li>
              ))}
            </ul>
            <Link
              href={`${authRoutes.signup}?role=driver`}
              className={cn(
                buttonVariants({ variant: "default", size: "lg" }),
                "mt-8 inline-flex",
              )}
            >
              {driveWithUs.cta}
            </Link>
          </div>
          <ScrollReveal delay={120}>
            <DriverDashboardPreview />
          </ScrollReveal>
        </PageContainer>
      </section>

      <section className="public-section">
        <PageContainer>
          <SectionHeading title="Why drive with us" />
          <ScrollReveal className="mt-8">
            <div className="grid gap-5 sm:grid-cols-2">
              {driveWithUs.why.map((item, index) => (
                <FeatureCard
                  key={item.title}
                  icon={icons[index] ?? Clock3}
                  title={item.title}
                  description={item.description}
                />
              ))}
            </div>
          </ScrollReveal>
        </PageContainer>
      </section>

      <section className="public-section bg-cream">
        <PageContainer className="grid gap-10 lg:grid-cols-2">
          <div>
            <h2 className="text-h2">How onboarding works</h2>
            <ol className="mt-6 space-y-3">
              {driveWithUs.onboarding.map((step, index) => (
                <li
                  key={step}
                  className="motion-lift border-border bg-warm-white text-deep-navy flex items-center gap-3 rounded-2xl border px-4 py-3"
                >
                  <span className="bg-olive flex size-7 shrink-0 items-center justify-center rounded-full text-xs font-bold text-white">
                    {index + 1}
                  </span>
                  {step}
                </li>
              ))}
            </ol>
          </div>
          <div>
            <h2 className="text-h2">Requirements & documents</h2>
            <ul className="mt-6 space-y-2">
              {driveWithUs.requirements.map((item) => (
                <li
                  key={item}
                  className="motion-lift border-border bg-warm-white text-deep-navy rounded-2xl border px-4 py-3 text-sm font-medium"
                >
                  {item}
                </li>
              ))}
            </ul>
            <p className="text-muted-foreground mt-4 text-sm">
              Submit the documents required for Driver verification and track their status
              as your application progresses.
            </p>
          </div>
        </PageContainer>
      </section>

      <section className="public-section">
        <PageContainer className="max-w-3xl">
          <h2 className="text-h2">Earning explanation</h2>
          <p className="text-muted-foreground mt-4">
            Completed trips generate earnings with gross amount, platform commission, and
            net amount. Wallet transactions reflect trip earnings, withdrawals, and
            adjustments in the driver app foundation.
          </p>
          <h3 className="text-h3 mt-8">Support</h3>
          <p className="text-muted-foreground mt-3">
            Need help with your application? Use Contact and our team will respond within
            one business day.
          </p>
        </PageContainer>
      </section>

      <CTASection
        tone="navy"
        title="Start driver registration"
        description="Sign up, verify OTP, then select the Driver role."
        primary={{
          label: driveWithUs.cta,
          href: `${authRoutes.signup}?role=driver`,
        }}
        secondary={{ label: "Contact us", href: publicRoutes.contact }}
      />
    </main>
  );
}
