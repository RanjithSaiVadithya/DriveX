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

export const metadata = buildPageMetadata({
  title: { absolute: "Drive With DriveX — Earn on Your Schedule" },
  description:
    "Drive with DriveX: flexible hours, clear trip history, earnings visibility, and document workflows for drivers.",
  path: publicRoutes.driveWithUs,
});

export default function DriveWithUsPage() {
  const { driveWithUs } = publicContent;
  const icons = [Clock3, FileCheck2, HandCoins, Headset];

  return (
    <main>
      <section className="border-b border-border/70 bg-deep-navy py-16 text-warm-white sm:py-20">
        <PageContainer className="grid items-center gap-10 lg:grid-cols-2">
          <div>
            <p className="text-caption font-semibold uppercase tracking-wider text-olive">
              Drive with us
            </p>
            <h1 className="text-h1 mt-3 text-warm-white">{driveWithUs.heroTitle}</h1>
            <p className="mt-5 text-lg text-white/75">{driveWithUs.heroDescription}</p>
            <ul className="mt-6 space-y-3">
              {publicContent.driverRecruit.points.map((point) => (
                <li key={point} className="flex items-center gap-3 text-sm text-white/90">
                  <span className="inline-flex size-6 items-center justify-center rounded-full bg-olive text-white">
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
          <div
            className="relative min-h-[16rem] overflow-hidden rounded-3xl bg-[#1c272e]"
            aria-hidden
          >
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(45,90,39,0.4),transparent_50%)]" />
            <div className="absolute bottom-6 left-6 right-6 rounded-2xl bg-warm-white p-5 text-deep-navy shadow-medium">
              <p className="text-caption font-semibold uppercase text-olive">Earnings</p>
              <p className="mt-1 text-2xl font-bold">Flexible hours · Clear payouts</p>
            </div>
          </div>
        </PageContainer>
      </section>

      <section className="py-16 sm:py-20">
        <PageContainer>
          <SectionHeading title="Why drive with us" />
          <div className="mt-10 grid gap-5 sm:grid-cols-2">
            {driveWithUs.why.map((item, index) => (
              <FeatureCard
                key={item.title}
                icon={icons[index] ?? Clock3}
                title={item.title}
                description={item.description}
              />
            ))}
          </div>
        </PageContainer>
      </section>

      <section className="bg-cream py-16 sm:py-20">
        <PageContainer className="grid gap-10 lg:grid-cols-2">
          <div>
            <h2 className="text-h2">How onboarding works</h2>
            <ol className="mt-6 space-y-3">
              {driveWithUs.onboarding.map((step, index) => (
                <li
                  key={step}
                  className="flex items-center gap-3 rounded-2xl border border-border bg-warm-white px-4 py-3 text-deep-navy"
                >
                  <span className="flex size-7 shrink-0 items-center justify-center rounded-full bg-olive text-xs font-bold text-white">
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
                  className="rounded-2xl border border-border bg-warm-white px-4 py-3 text-sm font-medium text-deep-navy"
                >
                  {item}
                </li>
              ))}
            </ul>
            <p className="mt-4 text-sm text-muted-foreground">
              Document uploads use mock file URLs in Phase 1–2. Real storage comes later.
            </p>
          </div>
        </PageContainer>
      </section>

      <section className="py-16 sm:py-20">
        <PageContainer className="max-w-3xl">
          <h2 className="text-h2">Earning explanation</h2>
          <p className="mt-4 text-muted-foreground">
            Completed trips generate earnings with gross amount, platform commission, and
            net amount. Wallet transactions reflect trip earnings, withdrawals, and
            adjustments in the driver app foundation.
          </p>
          <h3 className="text-h3 mt-8">Support</h3>
          <p className="mt-3 text-muted-foreground">
            Driver support expands with later phases. For now, use Contact for product
            questions about becoming a driver.
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
