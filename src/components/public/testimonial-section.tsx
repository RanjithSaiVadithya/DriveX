import { publicContent } from "@/config/content";
import { PageContainer } from "@/components/shared/page-container";
import { SectionHeading } from "@/components/shared/page-container";

export function TestimonialSection() {
  const { testimonialsDemo } = publicContent;

  return (
    <section className="py-16 sm:py-20">
      <PageContainer>
        <SectionHeading
          eyebrow="Feedback"
          title="What people say"
          description={testimonialsDemo.note}
        />
        <div className="mt-10 grid gap-6 md:grid-cols-2">
          {testimonialsDemo.items.map((item) => (
            <figure
              key={item.name}
              className="rounded-xl border border-dashed border-border bg-warm-white p-6 shadow-soft"
            >
              <blockquote className="text-base text-deep-navy">“{item.quote}”</blockquote>
              <figcaption className="mt-4 text-small text-muted-foreground">
                <span className="font-semibold text-deep-navy">{item.name}</span>
                {" · "}
                {item.role}
              </figcaption>
            </figure>
          ))}
        </div>
      </PageContainer>
    </section>
  );
}
