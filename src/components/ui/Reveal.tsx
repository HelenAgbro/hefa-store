"use client";

import type { CSSProperties, ReactNode } from "react";
import { useEffect, useRef } from "react";
import { cn } from "@/lib/utils";

interface RevealProps {
  children: ReactNode;
  className?: string;
  /** Milliseconds to hold back, so sibling sections do not all fire together. */
  delay?: number;
}

/**
 * Fades its children up into place the first time they scroll into view.
 *
 * Two deliberate choices:
 *
 * 1. There is no `opacity-0` in the server-rendered markup. The hidden state
 *    lives on a `data-reveal` attribute that only JavaScript ever writes, so a
 *    visitor with JavaScript disabled gets the plain, fully visible page
 *    rather than a blank column.
 *
 * 2. The attribute is written straight onto the DOM node instead of going
 *    through React state. This effect is synchronising with an external system
 *    — the viewport — so mutating the element is the appropriate tool, and it
 *    avoids a cascading re-render for every section on the page.
 *
 * Visitors who ask for reduced motion, and browsers without
 * IntersectionObserver, are never hidden in the first place.
 */
export function Reveal({ children, className, delay = 0 }: RevealProps) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reducedMotion || typeof IntersectionObserver === "undefined") return;

    element.dataset.reveal = "hidden";

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries.some((entry) => entry.isIntersecting)) {
          element.dataset.reveal = "shown";
          observer.disconnect();
        }
      },
      // Begin the fade slightly before the section's top edge reaches the
      // bottom of the viewport, so it has landed by the time it is in view.
      { threshold: 0.05, rootMargin: "0px 0px -10% 0px" },
    );

    observer.observe(element);

    return () => {
      observer.disconnect();
      // Never leave content stranded behind a hidden state if the node is ever
      // reused — React deliberately runs effects twice in development StrictMode.
      delete element.dataset.reveal;
    };
  }, []);

  return (
    <div
      ref={ref}
      className={cn(className)}
      style={delay ? ({ "--reveal-delay": `${delay}ms` } as CSSProperties) : undefined}
    >
      {children}
    </div>
  );
}