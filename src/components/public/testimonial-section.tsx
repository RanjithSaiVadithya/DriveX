import { Quote, Star } from "lucide-react";
import { publicContent } from "@/config/content";
import { PageContainer, SectionHeading } from "@/components/shared/page-container";

export function TestimonialSection() {
  const { testimonialsDemo } = publicContent;

  return (
    <section className="bg-cream py-16 sm:py-20">
      <PageContainer>
        <SectionHeading
          eyebrow="Feedback"
          title="What people say"
          description={testimonialsDemo.note}
          align="center"
        />
        <div className="mx-auto mt-10 grid max-w-4xl gap-6 md:grid-cols-2">
          {testimonialsDemo.items.map((item) => (
            <figure
              key={item.name}
              className="relative rounded-3xl border border-border/70 bg-warm-white p-7 shadow-soft transition-all hover:-translate-y-0.5 hover:shadow-medium"
            >
              <Quote
                className="absolute right-6 top-6 size-9 fill-olive/10 text-olive/30"
                aria-hidden
              />
              <div className="flex gap-1 text-olive" aria-label="5 out of 5 stars">
                {Array.from({ length: 5 }, (_, index) => (
                  <Star key={index} className="size-4 fill-current" aria-hidden />
                ))}
              </div>
              <blockquote className="mt-5 max-w-sm text-base font-medium leading-relaxed text-deep-navy">
                “{item.quote}”
              </blockquote>
              <figcaption className="mt-6 flex items-center gap-3 border-t border-border/70 pt-5 text-small text-muted-foreground">
                <span className="flex size-10 items-center justify-center rounded-full bg-olive/10 font-bold text-olive">
                  {item.name.charAt(0)}
                </span>
                <span>
                  <span className="block font-semibold text-deep-navy">{item.name}</span>
                  <span>{item.role}</span>
                </span>
              </figcaption>
            </figure>
          ))}
        </div>
      </PageContainer>
    </section>
  );
}
