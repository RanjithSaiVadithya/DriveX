import { Clock3, Mail, MapPin, Phone } from "lucide-react";
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

  const details = [
    { icon: Phone, label: "Phone", value: contact.placeholders.phone },
    { icon: Mail, label: "Email", value: contact.placeholders.email },
    { icon: MapPin, label: "Address", value: contact.placeholders.address },
    { icon: Clock3, label: "Support hours", value: contact.placeholders.support },
  ] as const;

  return (
    <main>
      <section className="bg-warm-white py-16 sm:py-20">
        <PageContainer className="grid gap-10 lg:grid-cols-2 lg:gap-12">
          <div>
            <p className="text-caption font-semibold uppercase tracking-wider text-olive">
              Contact
            </p>
            <h1 className="text-h1 mt-3">Get in Touch</h1>
            <p className="mt-5 text-lg text-muted-foreground">{contact.intro}</p>

            <ul className="mt-10 space-y-5">
              {details.map(({ icon: Icon, label, value }) => (
                <li key={label} className="flex gap-4">
                  <span className="inline-flex size-11 shrink-0 items-center justify-center rounded-full bg-olive/10 text-olive">
                    <Icon className="size-5" strokeWidth={1.75} aria-hidden />
                  </span>
                  <div>
                    <p className="text-caption font-semibold uppercase tracking-wide text-muted-foreground">
                      {label}
                    </p>
                    <p className="mt-1 text-base font-medium text-deep-navy">{value}</p>
                  </div>
                </li>
              ))}
            </ul>
          </div>

          <div className="relative">
            <div className="absolute inset-x-4 bottom-0 top-16 hidden overflow-hidden rounded-3xl opacity-60 sm:block">
              <MapPreview className="h-full min-h-[22rem] rounded-3xl border-0" />
            </div>
            <div className="relative rounded-3xl border border-border bg-warm-white p-6 shadow-medium sm:p-8">
              <h2 className="text-h3">Send Message</h2>
              <p className="mt-2 text-sm text-muted-foreground">
                Tell us how we can help. We&apos;ll get back as soon as we can.
              </p>
              <div className="mt-6">
                <ContactForm />
              </div>
            </div>
          </div>
        </PageContainer>
      </section>
    </main>
  );
}
