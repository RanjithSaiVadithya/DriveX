"use client";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

export function FAQItem({
  items,
}: {
  items: readonly { question: string; answer: string }[];
}) {
  return (
    <Accordion
      multiple
      defaultValue={["item-0"]}
      className="border-border/70 bg-warm-white shadow-soft flex w-full flex-col gap-1 rounded-3xl border p-2"
    >
      {items.map((item, index) => (
        <AccordionItem
          key={item.question}
          value={`item-${index}`}
          className="data-open:bg-cream/70 rounded-2xl px-3 transition-colors"
        >
          <AccordionTrigger className="hover:bg-cream/60 text-deep-navy py-5 text-left text-base font-semibold hover:no-underline">
            {item.question}
          </AccordionTrigger>
          <AccordionContent className="text-muted-foreground max-w-2xl pb-5 text-sm leading-relaxed">
            {item.answer}
          </AccordionContent>
        </AccordionItem>
      ))}
    </Accordion>
  );
}
