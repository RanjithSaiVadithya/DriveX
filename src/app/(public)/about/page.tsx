import { PageContainer, SectionHeading } from "@/components/shared/page-container";
import { CTASection } from "@/components/shared/cta-section";
import { FeatureCard } from "@/components/shared/feature-card";
import { buildPageMetadata } from "@/lib/seo";
import { publicContent } from "@/config/content";
import { authRoutes, publicRoutes } from "@/config/routes";
import { HeartHandshake, Route, Target, Users, Eye } from "lucide-react";
import { ScrollReveal } from "@/components/shared/scroll-reveal";

export const metadata = buildPageMetadata({
  title: { absolute: "About DriverDosth — Our Mission and Vision" },
  description:
    "Learn about DriverDosth — our mission to make booking a Driver simple for Users on one shared platform.",
  path: publicRoutes.about,
});

export default function AboutPage() {
  const { about } = publicContent;

  return (
    <main>
      <section className="public-section bg-warm-white overflow-hidden">
        <PageContainer className="grid items-center gap-10 lg:grid-cols-2">
          <div>
            <p className="text-caption text-olive font-semibold tracking-wider uppercase">
              About us
            </p>
            <h1 className="text-h1 mt-3">{about.heroTitle}</h1>
            <p className="text-muted-foreground mt-5 text-lg leading-relaxed">
              {about.intro}
            </p>
          </div>
          <div
            className="bg-deep-navy shadow-medium relative min-h-[18rem] overflow-hidden rounded-3xl"
            aria-hidden
          >
            <div className="absolute inset-0 bg-[linear-gradient(135deg,rgba(45,90,39,0.35),transparent_55%),radial-gradient(circle_at_80%_80%,rgba(232,228,217,0.2),transparent_40%)]" />
            <svg viewBox="0 0 480 360" className="h-full min-h-[18rem] w-full">
              <path
                d="M0 260 H480 M0 200 H480 M0 140 H480 M80 40 V320 M180 40 V320 M280 40 V320 M380 40 V320"
                stroke="rgba(255,255,255,0.08)"
                strokeWidth="2"
              />
              <rect
                x="100"
                y="80"
                width="48"
                height="140"
                fill="rgba(255,255,255,0.08)"
              />
              <rect x="200" y="50" width="56" height="170" fill="rgba(255,255,255,0.1)" />
              <rect
                x="310"
                y="90"
                width="40"
                height="130"
                fill="rgba(255,255,255,0.08)"
              />
              <path
                d="M40 280 C120 240, 200 250, 260 220 S380 180, 440 200"
                stroke="#2d5a27"
                strokeWidth="5"
                fill="none"
                strokeLinecap="round"
              />
              <circle cx="260" cy="220" r="8" fill="#ffffff" />
            </svg>
          </div>
        </PageContainer>
      </section>

      <section className="public-section">
        <PageContainer className="grid gap-6 lg:grid-cols-2">
          <ScrollReveal className="h-full">
            <article className="motion-lift border-border bg-warm-white shadow-soft rounded-3xl border p-8">
              <div className="bg-olive/10 text-olive flex size-12 items-center justify-center rounded-full">
                <Target className="size-5" strokeWidth={1.75} aria-hidden />
              </div>
              <h2 className="text-h2 mt-5">Our Mission</h2>
              <p className="text-muted-foreground mt-4 text-base leading-relaxed">
                {about.mission}
              </p>
            </article>
          </ScrollReveal>
          <ScrollReveal className="h-full" delay={80}>
            <article className="motion-lift border-border bg-warm-white shadow-soft rounded-3xl border p-8">
              <div className="bg-olive/10 text-olive flex size-12 items-center justify-center rounded-full">
                <Eye className="size-5" strokeWidth={1.75} aria-hidden />
              </div>
              <h2 className="text-h2 mt-5">Our Vision</h2>
              <p className="text-muted-foreground mt-4 text-base leading-relaxed">
                {about.vision}
              </p>
            </article>
          </ScrollReveal>
        </PageContainer>
      </section>

      <section className="public-section bg-cream">
        <PageContainer>
          <SectionHeading
            title="How we work"
            description="One domain model for bookings and Trips — viewed from User and Driver perspectives."
          />
          <ScrollReveal className="mt-8">
            <div className="grid gap-5 md:grid-cols-3">
              <FeatureCard
                icon={Users}
                title="Users"
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
                description="Go online, accept Trips, and track earnings against the same Trip records."
              />
            </div>
          </ScrollReveal>
        </PageContainer>
      </section>

      <CTASection
        title="Join the DriverDosth platform"
        description="Whether you want to book a Driver or provide driving services, start with a verified account."
        primary={{ label: "Book a Driver", href: authRoutes.login }}
        secondary={{ label: "Drive With Us", href: publicRoutes.driveWithUs }}
      />
    </main>
  );
}
