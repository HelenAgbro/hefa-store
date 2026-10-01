"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";

export interface AccordionItem {
  id: string;
  question: string;
  answer: string;
}

interface AccordionProps {
  items: AccordionItem[];
  className?: string;
}

/** Expand/collapse list of questions. One panel open at a time. */
export function Accordion({ items, className }: AccordionProps) {
  const [openId, setOpenId] = useState<string | null>(items.length > 0 ? items[0].id : null);

  return (
    <div className={cn("flex flex-col divide-y divide-black/10 border-y border-black/10", className)}>
      {items.map((item) => {
        const open = openId === item.id;
        return (
          <div key={item.id}>
            <h3>
              <button
                type="button"
                aria-expanded={open}
                aria-controls={`${item.id}-panel`}
                onClick={() => setOpenId(open ? null : item.id)}
                className="flex w-full items-center justify-between gap-4 py-5 text-left text-sm text-black transition-colors hover:text-burnt-orange"
              >
                {item.question}
                <span aria-hidden="true" className="text-lg leading-none">
                  {open ? "−" : "+"}
                </span>
              </button>
            </h3>
            {open ? (
              <div id={`${item.id}-panel`} className="pb-6 pr-8">
                <p className="max-w-2xl text-sm leading-relaxed text-charcoal/80">{item.answer}</p>
              </div>
            ) : null}
          </div>
        );
      })}
    </div>
  );
}
