import { PageContainer, SectionHeading } from "@/components/shared/page-container";
import { CTASection } from "@/components/shared/cta-section";
import { JourneyShowcase } from "@/components/public/journey-showcase";
import { buildPageMetadata } from "@/lib/seo";
import { authRoutes, publicRoutes } from "@/config/routes";
import { publicContent } from "@/config/content";
import { ScrollReveal } from "@/components/shared/scroll-reveal";
import { Breadcrumbs } from "@/components/shared/breadcrumbs";

export const metadata = buildPageMetadata({
  title: { absolute: "How DriverDosth Works — Book a Driver in Simple Steps" },
  description:
    "See how DriverDosth works: add your vehicle, book a driver, and complete a trip where the driver operates your car.",
  path: publicRoutes.howItWorks,
});

export default function HowItWorksPage() {
  return (
    <main>
      <section className="public-section-compact border-border/70 bg-warm-white border-b">
        <PageContainer className="max-w-4xl">
          <Breadcrumbs current="How It Works" className="mb-5" />
          <p className="text-caption text-olive font-semibold tracking-wider uppercase">
            How it works
          </p>
          <h1 className="text-h1 mt-3">One platform, two perspectives</h1>
          <p className="text-muted-foreground mt-5 text-lg">
            Users and Drivers share the same booking and Trip records. Here is the journey
            from both sides.
          </p>
        </PageContainer>
      </section>

      <section className="public-section">
        <PageContainer>
          <SectionHeading
            title="From first request to completed Trip"
            description="Switch between the User and Driver view to see how each step connects."
          />
          <ScrollReveal className="mt-8">
            <JourneyShowcase
              userSteps={publicContent.journeys.user}
              driverSteps={publicContent.journeys.driver}
            />
          </ScrollReveal>
        </PageContainer>
      </section>

      <CTASection
        tone="navy"
        title="Start your DriverDosth journey"
        description="Create an account, verify your phone, and choose the role that fits your journey."
        primary={{ label: "Get started", href: authRoutes.signup }}
        secondary={{ label: "Safety overview", href: publicRoutes.safety }}
      />
    </main>
  );
}
