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
      className="w-full divide-y divide-border rounded-xl border border-border bg-warm-white px-1"
    >
      {items.map((item, index) => (
        <AccordionItem key={item.question} value={`item-${index}`} className="px-3">
          <AccordionTrigger className="py-4 text-left text-base font-semibold text-deep-navy hover:no-underline">
            {item.question}
          </AccordionTrigger>
          <AccordionContent className="pb-4 text-muted-foreground">
            {item.answer}
          </AccordionContent>
        </AccordionItem>
      ))}
    </Accordion>
  );
}
