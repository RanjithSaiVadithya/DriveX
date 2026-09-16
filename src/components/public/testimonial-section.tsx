import { publicContent } from "@/config/content";
import { PageContainer, SectionHeading } from "@/components/shared/page-container";
import { ScrollReveal } from "@/components/shared/scroll-reveal";

export function ExperienceHighlights() {
  const { experienceHighlights } = publicContent;

  return (
    <section className="public-section bg-cream">
      <PageContainer>
        <SectionHeading
          eyebrow="The DriverDosth difference"
          title="A clearer way to book a Driver"
          description={experienceHighlights.note}
          align="center"
        />
        <ScrollReveal className="mt-8">
          <div className="mx-auto grid max-w-5xl gap-5 md:grid-cols-3">
            {experienceHighlights.items.map((item, index) => (
              <article
                key={item.title}
                className="motion-lift border-border/70 bg-warm-white shadow-soft rounded-3xl border p-6"
              >
                <div className="bg-olive/10 text-olive flex size-10 items-center justify-center rounded-full text-sm font-bold">
                  {String(index + 1).padStart(2, "0")}
                </div>
                <h3 className="text-deep-navy mt-5 text-lg font-semibold">{item.title}</h3>
                <p className="text-muted-foreground mt-2 text-sm leading-relaxed">
                  {item.description}
                </p>
              </article>
            ))}
          </div>
        </ScrollReveal>
      </PageContainer>
    </section>
  );
}
