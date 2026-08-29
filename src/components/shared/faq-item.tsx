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
      className="w-full divide-y divide-border/70 rounded-3xl border border-border/70 bg-warm-white px-2 shadow-soft"
    >
      {items.map((item, index) => (
        <AccordionItem
          key={item.question}
          value={`item-${index}`}
          className="px-3"
        >
          <AccordionTrigger className="py-5 text-left text-base font-semibold text-deep-navy hover:no-underline">
            {item.question}
          </AccordionTrigger>
          <AccordionContent className="max-w-2xl pb-5 text-sm leading-relaxed text-muted-foreground">
            {item.answer}
          </AccordionContent>
        </AccordionItem>
      ))}
    </Accordion>
  );
}
