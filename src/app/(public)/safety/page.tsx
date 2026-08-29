import { PageContainer } from "@/components/shared/page-container";
import { CTASection } from "@/components/shared/cta-section";
import { buildPageMetadata } from "@/lib/seo";
import { authRoutes, publicRoutes } from "@/config/routes";
import { SafetyFlowSection } from "@/components/public/safety-flow-section";
import { ShieldCheck } from "lucide-react";

export const metadata = buildPageMetadata({
  title: { absolute: "DriveX Safety — Safe and Reliable Rides" },
  description:
    "Learn how DriveX approaches driver verification, trip information, user controls, and support for safer rides.",
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
    body: "Cancellation rules and status visibility help riders stay informed during the lifecycle of a booking.",
  },
  {
    title: "Support",
    body: "Use Contact for product questions. In-app support tooling expands in later phases.",
  },
  {
    title: "Best practices",
    body: "Meet in well-lit areas when possible, confirm vehicle details before boarding, and keep trip details private.",
  },
];

export default function SafetyPage() {
  return (
    <main>
      <section className="border-border/70 bg-warm-white border-b py-16 sm:py-20">
        <PageContainer className="max-w-3xl">
          <p className="text-caption text-olive inline-flex items-center gap-2 font-semibold tracking-wider uppercase">
            <ShieldCheck className="size-4" aria-hidden />
            Safety
          </p>
          <h1 className="text-h1 mt-3">Safety built into the product foundation</h1>
          <p className="text-muted-foreground mt-5 text-lg">
            We describe capabilities that exist in the platform design. We do not claim
            live emergency response or unverified coverage.
          </p>
        </PageContainer>
      </section>

      <SafetyFlowSection compact />

      <section className="bg-cream py-16 sm:py-20">
        <PageContainer className="max-w-3xl space-y-6">
          <h2 className="text-h2">Practices and expectations</h2>
          {practices.map((item) => (
            <article
              key={item.title}
              className="border-border/70 bg-warm-white rounded-2xl border p-5"
            >
              <h3 className="text-h3">{item.title}</h3>
              <p className="text-muted-foreground mt-2">{item.body}</p>
            </article>
          ))}
        </PageContainer>
      </section>

      <CTASection
        title="Ride with clearer information"
        primary={{ label: "Book a Driver", href: authRoutes.login }}
        secondary={{ label: "Contact DriveX", href: publicRoutes.contact }}
      />
    </main>
  );
}
