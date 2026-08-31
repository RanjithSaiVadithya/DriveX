import { PageContainer } from "@/components/shared/page-container";
import { ContactForm } from "@/features/contact/contact-form";
import { publicContent } from "@/config/content";
import { buildPageMetadata } from "@/lib/seo";
import { publicRoutes } from "@/config/routes";
import { ScrollReveal } from "@/components/shared/scroll-reveal";

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
      <section className="public-section bg-warm-white">
        <PageContainer className="grid gap-8 lg:grid-cols-2 lg:gap-10">
          <ScrollReveal>
            <div>
              <p className="text-caption text-olive font-semibold tracking-wider uppercase">
                Contact
              </p>
              <h1 className="text-h1 mt-3">Get in Touch</h1>
              <p className="text-muted-foreground mt-5 text-lg">{contact.intro}</p>
              <div className="border-border/70 bg-cream mt-8 rounded-2xl border p-5">
                <p className="text-deep-navy text-sm font-semibold">Need trip support?</p>
                <p className="text-muted-foreground mt-2 text-sm leading-relaxed">
                  Share your question or booking details through the form. Our team
                  usually responds within one business day.
                </p>
              </div>
            </div>
          </ScrollReveal>

          <ScrollReveal delay={100}>
            <div className="border-border bg-warm-white shadow-medium rounded-3xl border p-6 sm:p-8">
              <h2 className="text-h3">Send Message</h2>
              <p className="text-muted-foreground mt-2 text-sm">
                Tell us how we can help. We&apos;ll get back as soon as we can.
              </p>
              <div className="mt-6">
                <ContactForm />
              </div>
            </div>
          </ScrollReveal>
        </PageContainer>
      </section>
    </main>
  );
}
