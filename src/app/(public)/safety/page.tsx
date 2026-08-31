import { PageContainer } from "@/components/shared/page-container";
import { CTASection } from "@/components/shared/cta-section";
import { buildPageMetadata } from "@/lib/seo";
import { authRoutes, publicRoutes } from "@/config/routes";
import { SafetyFlowSection } from "@/components/public/safety-flow-section";
import { ShieldCheck } from "lucide-react";
import { ScrollReveal } from "@/components/shared/scroll-reveal";
import { Breadcrumbs } from "@/components/shared/breadcrumbs";

export const metadata = buildPageMetadata({
  title: { absolute: "DriveX Safety — Safe and Reliable Trips" },
  description:
    "Learn how DriveX approaches Driver verification, Trip information, User controls, and support for safer Trips.",
  path: publicRoutes.safety,
});

const practices = [
  {
    title: "Driver verification",
    body: "Drivers submit required documents during onboarding. Verification status is tracked before trips.",
  },
  {
    title: "Trip information",
    body: "Bookings and trips are shared records with clear status transitions for both parties.",
  },
  {
    title: "User controls",
    body: "Cancellation rules and status visibility help Users stay informed during the lifecycle of a booking.",
  },
  {
    title: "Support",
    body: "Use the Contact form for product questions. We usually respond within one business day.",
  },
  {
    title: "Best practices",
    body: "Meet in well-lit areas when possible, confirm vehicle details before boarding, and keep trip details private.",
  },
];

export default function SafetyPage() {
  return (
    <main>
      <section className="public-section-compact border-border/70 bg-warm-white border-b">
        <PageContainer className="max-w-4xl">
          <Breadcrumbs current="Safety" className="mb-5" />
          <p className="text-caption text-olive inline-flex items-center gap-2 font-semibold tracking-wider uppercase">
            <ShieldCheck className="size-4" aria-hidden />
            Safety
          </p>
          <h1 className="text-h1 mt-3">Safety built into the product foundation</h1>
          <p className="text-muted-foreground mt-5 text-lg">
            Clear information and visible status updates help Users and Drivers make
            informed decisions throughout every Trip.
          </p>
        </PageContainer>
      </section>

      <SafetyFlowSection compact />

      <section className="public-section bg-cream">
        <PageContainer className="max-w-3xl space-y-5">
          <h2 className="text-h2">Practices and expectations</h2>
          {practices.map((item, index) => (
            <ScrollReveal key={item.title} delay={index * 60}>
              <article className="motion-lift border-border/70 bg-warm-white rounded-2xl border p-5">
                <h3 className="text-h3">{item.title}</h3>
                <p className="text-muted-foreground mt-2">{item.body}</p>
              </article>
            </ScrollReveal>
          ))}
        </PageContainer>
      </section>

      <CTASection
        title="Travel with clearer information"
        primary={{ label: "Book a Driver", href: authRoutes.login }}
        secondary={{ label: "Contact DriveX", href: publicRoutes.contact }}
      />
    </main>
  );
}
