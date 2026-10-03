const STATEMENTS = [
  "Modern Afro-Minimalism",
  "Designed in Lagos",
  "Produced in small runs",
  "Cut for the Nigerian climate",
  "Complimentary delivery over ₦150,000",
];

/**
 * Scrolling brand-statement band that sits directly beneath the hero.
 *
 * The track holds the statements twice, and the animation slides it exactly
 * -50%, so the end of the first copy meets the start of the second and the
 * loop is seamless. Pure CSS — no client component, no JavaScript.
 *
 * Hidden from assistive technology: it restates what the page already says,
 * and reading the same five phrases twice would be noise.
 */
export function HeroTicker() {
  return (
    <div aria-hidden="true" className="overflow-hidden border-y border-black/10 bg-black py-4">
      <div className="flex w-max animate-marquee items-center">
        {[...STATEMENTS, ...STATEMENTS].map((statement, index) => (
          <span key={`${statement}-${index}`} className="flex shrink-0 items-center">
            <span className="px-6 text-[0.65rem] uppercase tracking-[0.3em] text-cream sm:text-xs">
              {statement}
            </span>
            <span className="h-1 w-1 rounded-full bg-ochre" />
          </span>
        ))}
      </div>
    </div>
  );
}