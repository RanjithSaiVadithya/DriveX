import { PageContainer } from "@/components/shared/page-container";
import { MapPreview } from "@/components/public/map-preview";
import { ContactForm } from "@/features/contact/contact-form";
import { publicContent } from "@/config/content";
import { buildPageMetadata } from "@/lib/seo";
import { publicRoutes } from "@/config/routes";

export const metadata = buildPageMetadata({
  title: { absolute: "Contact DriveX — We're Here to Help" },
  description:
    "Contact DriveX for product questions and partnership enquiries. Send a message through our contact form.",
  path: publicRoutes.contact,
});

export default function ContactPage() {
  const { contact } = publicContent;

  return (
    <main>
      <section className="border-b border-border/70 bg-warm-white py-16 sm:py-20">
        <PageContainer className="max-w-3xl">
          <p className="text-caption font-semibold uppercase tracking-wider text-orange">
            Contact
          </p>
          <h1 className="text-h1 mt-3">Get in touch</h1>
          <p className="mt-5 text-lg text-muted-foreground">{contact.intro}</p>
        </PageContainer>
      </section>

      <section className="py-16 sm:py-20">
        <PageContainer className="grid gap-10 lg:grid-cols-2">
          <div>
            <h2 className="text-h2">Contact information</h2>
            <p className="mt-3 text-sm text-muted-foreground">
              Official phone and address details will appear here when available. The
              values below are configuration placeholders.
            </p>
            <dl className="mt-8 space-y-5">
              {(
                [
                  ["Phone", contact.placeholders.phone],
                  ["Email", contact.placeholders.email],
                  ["Support", contact.placeholders.support],
                  ["Business enquiries", contact.placeholders.business],
                ] as const
              ).map(([label, value]) => (
                <div key={label}>
                  <dt className="text-caption font-semibold uppercase tracking-wide text-muted-foreground">
                    {label}
                  </dt>
                  <dd className="mt-1 text-base font-medium text-deep-navy">{value}</dd>
                </div>
              ))}
            </dl>
            <div className="mt-8">
              <MapPreview />
            </div>
          </div>

          <div className="rounded-2xl border border-border bg-warm-white p-6 shadow-soft sm:p-8">
            <h2 className="text-h3">Send a message</h2>
            <p className="mt-2 text-sm text-muted-foreground">
              Submissions go to the mock API in development — no real email provider yet.
            </p>
            <div className="mt-6">
              <ContactForm />
            </div>
          </div>
        </PageContainer>
      </section>
    </main>
  );
}
