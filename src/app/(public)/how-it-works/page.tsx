import { PageContainer, SectionHeading } from "@/components/shared/page-container";
import { CTASection } from "@/components/shared/cta-section";
import { buildPageMetadata } from "@/lib/seo";
import { authRoutes, publicRoutes } from "@/config/routes";

export const metadata = buildPageMetadata({
  title: { absolute: "How DriveX Works — Book a Driver in Simple Steps" },
  description:
    "See how DriveX works: add your vehicle, book a driver, and complete a trip where the driver operates your car.",
  path: publicRoutes.howItWorks,
});

const userSteps = [
  "Add your vehicle",
  "Choose pickup and destination",
  "Select when you need a driver",
  "Choose your driving service",
  "Confirm your booking",
  "Meet your driver",
  "Your driver drives your vehicle",
  "Complete your trip",
];

const driverSteps = [
  "Register as a driver",
  "Complete verification",
  "Go online",
  "Receive a driver request",
  "Review customer / trip / vehicle details",
  "Accept the trip",
  "Drive to pickup",
  "Drive the customer's vehicle",
  "Complete the trip",
  "Receive earnings",
];

export default function HowItWorksPage() {
  return (
    <main>
      <section className="border-b border-border/70 bg-warm-white py-16 sm:py-20">
        <PageContainer className="max-w-3xl">
          <p className="text-caption font-semibold uppercase tracking-wider text-orange">
            How it works
          </p>
          <h1 className="text-h1 mt-3">One platform, two perspectives</h1>
          <p className="mt-5 text-lg text-muted-foreground">
            Riders and drivers share the same booking and trip records. Here is the
            journey from both sides.
          </p>
        </PageContainer>
      </section>

      <section className="py-16 sm:py-20">
        <PageContainer className="grid gap-12 lg:grid-cols-2">
          <div>
            <SectionHeading title="For users" description="From request to arrival." />
            <ol className="mt-8 space-y-3">
              {userSteps.map((step, index) => (
                <li
                  key={step}
                  className="flex items-start gap-3 rounded-lg border border-border bg-warm-white p-4"
                >
                  <span className="flex size-8 shrink-0 items-center justify-center rounded-full bg-olive/15 text-sm font-bold text-olive">
                    {index + 1}
                  </span>
                  <span className="pt-1 font-medium text-deep-navy">{step}</span>
                </li>
              ))}
            </ol>
          </div>
          <div>
            <SectionHeading
              title="For drivers"
              description="From signup to earnings."
            />
            <ol className="mt-8 space-y-3">
              {driverSteps.map((step, index) => (
                <li
                  key={step}
                  className="flex items-start gap-3 rounded-lg border border-border bg-cream/70 p-4"
                >
                  <span className="flex size-8 shrink-0 items-center justify-center rounded-full bg-orange/15 text-sm font-bold text-orange">
                    {index + 1}
                  </span>
                  <span className="pt-1 font-medium text-deep-navy">{step}</span>
                </li>
              ))}
            </ol>
          </div>
        </PageContainer>
      </section>

      <CTASection
        tone="navy"
        title="Try the flow yourself"
        description="Sign up with mock OTP, pick a role, and enter the application skeleton."
        primary={{ label: "Get started", href: authRoutes.signup }}
        secondary={{ label: "Safety overview", href: publicRoutes.safety }}
      />
    </main>
  );
}
