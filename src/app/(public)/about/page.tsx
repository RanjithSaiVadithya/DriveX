import { PageContainer, SectionHeading } from "@/components/shared/page-container";
import { CTASection } from "@/components/shared/cta-section";
import { FeatureCard } from "@/components/shared/feature-card";
import { buildPageMetadata } from "@/lib/seo";
import { publicContent } from "@/config/content";
import { authRoutes, publicRoutes } from "@/config/routes";
import { HeartHandshake, Route, Users } from "lucide-react";

export const metadata = buildPageMetadata({
  title: { absolute: "About DriveX — Our Mission and Vision" },
  description:
    "Learn about DriveX — our mission to make driver bookings simple for riders and drivers on one shared platform.",
  path: publicRoutes.about,
});

export default function AboutPage() {
  const { about } = publicContent;

  return (
    <main>
      <section className="border-b border-border/70 bg-warm-white py-16 sm:py-20">
        <PageContainer className="max-w-3xl">
          <p className="text-caption font-semibold uppercase tracking-wider text-orange">
            About us
          </p>
          <h1 className="text-h1 mt-3">{about.heroTitle}</h1>
          <p className="mt-5 text-lg text-muted-foreground">{about.intro}</p>
        </PageContainer>
      </section>

      <section className="py-16 sm:py-20">
        <PageContainer className="grid gap-10 lg:grid-cols-2">
          <article className="rounded-2xl border border-border bg-cream/50 p-8">
            <h2 className="text-h2">Mission</h2>
            <p className="mt-4 text-base leading-relaxed text-muted-foreground">
              {about.mission}
            </p>
          </article>
          <article className="rounded-2xl border border-border bg-warm-white p-8 shadow-soft">
            <h2 className="text-h2">Vision</h2>
            <p className="mt-4 text-base leading-relaxed text-muted-foreground">
              {about.vision}
            </p>
          </article>
        </PageContainer>
      </section>

      <section className="bg-warm-beige/40 py-16 sm:py-20">
        <PageContainer>
          <SectionHeading
            title="How we work"
            description="One domain model for bookings and trips — viewed from User and Driver perspectives."
          />
          <div className="mt-10 grid gap-5 md:grid-cols-3">
            <FeatureCard
              icon={Users}
              title="Riders"
              description="Book, track status, and manage payments from the User experience."
            />
            <FeatureCard
              icon={Route}
              title="Shared trips"
              description="A trip is a single record — never duplicated into unrelated user/driver copies."
            />
            <FeatureCard
              icon={HeartHandshake}
              title="Drivers"
              description="Go online, accept trips, and track earnings against the same trip IDs."
            />
          </div>
        </PageContainer>
      </section>

      <CTASection
        title="Join the DriveX platform"
        description="Whether you need a ride or want to drive, start with a verified account."
        primary={{ label: "Book a Driver", href: authRoutes.login }}
        secondary={{ label: "Drive With Us", href: publicRoutes.driveWithUs }}
      />
    </main>
  );
}
