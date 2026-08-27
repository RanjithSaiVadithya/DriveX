import { PageContainer, SectionHeading } from "@/components/shared/page-container";
import { CTASection } from "@/components/shared/cta-section";
import { publicContent } from "@/config/content";
import { buildPageMetadata } from "@/lib/seo";
import { authRoutes, publicRoutes } from "@/config/routes";
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
      <section className="border-b border-border/70 bg-warm-white py-16 sm:py-20">
        <PageContainer className="max-w-3xl">
          <p className="inline-flex items-center gap-2 text-caption font-semibold uppercase tracking-wider text-olive">
            <ShieldCheck className="size-4" aria-hidden />
            Safety
          </p>
          <h1 className="text-h1 mt-3">Safety built into the product foundation</h1>
          <p className="mt-5 text-lg text-muted-foreground">
            We describe capabilities that exist in the platform design. We do not claim
            live emergency response or unverified coverage.
          </p>
        </PageContainer>
      </section>

      <section className="py-16 sm:py-20">
        <PageContainer>
          <SectionHeading
            title="Safety overview"
            description="Foundational controls for riders and drivers."
          />
          <div className="mt-10 grid gap-4 md:grid-cols-2">
            {publicContent.safetyHighlights.map((item) => (
              <article
                key={item.title}
                className="rounded-2xl border border-border bg-warm-white p-6 shadow-soft"
              >
                <h2 className="text-lg font-semibold text-deep-navy">{item.title}</h2>
                <p className="mt-2 text-sm text-muted-foreground">{item.description}</p>
              </article>
            ))}
          </div>
        </PageContainer>
      </section>

      <section className="bg-cream py-16 sm:py-20">
        <PageContainer className="max-w-3xl space-y-6">
          <h2 className="text-h2">Practices and expectations</h2>
          {practices.map((item) => (
            <article
              key={item.title}
              className="rounded-2xl border border-border/70 bg-warm-white p-5"
            >
              <h3 className="text-h3">{item.title}</h3>
              <p className="mt-2 text-muted-foreground">{item.body}</p>
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
