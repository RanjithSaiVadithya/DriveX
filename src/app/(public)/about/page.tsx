import { PageContainer, SectionHeading } from "@/components/shared/page-container";
import { CTASection } from "@/components/shared/cta-section";
import { FeatureCard, StatCard } from "@/components/shared/feature-card";
import { buildPageMetadata } from "@/lib/seo";
import { publicContent } from "@/config/content";
import { authRoutes, publicRoutes } from "@/config/routes";
import { HeartHandshake, Route, Target, Users, Eye } from "lucide-react";

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
      <section className="overflow-hidden bg-warm-white py-16 sm:py-20">
        <PageContainer className="grid items-center gap-10 lg:grid-cols-2">
          <div>
            <p className="text-caption font-semibold uppercase tracking-wider text-olive">
              About us
            </p>
            <h1 className="text-h1 mt-3">{about.heroTitle}</h1>
            <p className="mt-5 text-lg leading-relaxed text-muted-foreground">
              {about.intro}
            </p>
          </div>
          <div
            className="relative min-h-[18rem] overflow-hidden rounded-3xl bg-deep-navy shadow-medium"
            aria-hidden
          >
            <div className="absolute inset-0 bg-[linear-gradient(135deg,rgba(45,90,39,0.35),transparent_55%),radial-gradient(circle_at_80%_80%,rgba(232,228,217,0.2),transparent_40%)]" />
            <svg viewBox="0 0 480 360" className="h-full w-full min-h-[18rem]">
              <path
                d="M0 260 H480 M0 200 H480 M0 140 H480 M80 40 V320 M180 40 V320 M280 40 V320 M380 40 V320"
                stroke="rgba(255,255,255,0.08)"
                strokeWidth="2"
              />
              <rect x="100" y="80" width="48" height="140" fill="rgba(255,255,255,0.08)" />
              <rect x="200" y="50" width="56" height="170" fill="rgba(255,255,255,0.1)" />
              <rect x="310" y="90" width="40" height="130" fill="rgba(255,255,255,0.08)" />
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

      <section className="border-y border-border/70 bg-cream py-12 sm:py-14">
        <PageContainer>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {about.stats.map((stat) => (
              <StatCard key={stat.label} value={stat.value} label={stat.label} />
            ))}
          </div>
          <p className="mt-4 text-center text-caption text-muted-foreground">
            {about.statsNote}
          </p>
        </PageContainer>
      </section>

      <section className="py-16 sm:py-20">
        <PageContainer className="grid gap-6 lg:grid-cols-2">
          <article className="rounded-3xl border border-border bg-warm-white p-8 shadow-soft">
            <div className="flex size-12 items-center justify-center rounded-full bg-olive/10 text-olive">
              <Target className="size-5" strokeWidth={1.75} aria-hidden />
            </div>
            <h2 className="mt-5 text-h2">Our Mission</h2>
            <p className="mt-4 text-base leading-relaxed text-muted-foreground">
              {about.mission}
            </p>
          </article>
          <article className="rounded-3xl border border-border bg-warm-white p-8 shadow-soft">
            <div className="flex size-12 items-center justify-center rounded-full bg-olive/10 text-olive">
              <Eye className="size-5" strokeWidth={1.75} aria-hidden />
            </div>
            <h2 className="mt-5 text-h2">Our Vision</h2>
            <p className="mt-4 text-base leading-relaxed text-muted-foreground">
              {about.vision}
            </p>
          </article>
        </PageContainer>
      </section>

      <section className="bg-cream py-16 sm:py-20">
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
