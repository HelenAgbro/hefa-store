import type { Metadata } from "next";
import { Button } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import { Section } from "@/components/ui/Section";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { BRAND } from "@/lib/constants";

export const metadata: Metadata = {
  title: "About",
  description:
    "HEFA is a Nigerian designer label built on restraint, craft and identity. Read our story.",
};

const PILLARS = [
  {
    title: "Considered craft",
    body: "Every pair is pattern-cut and finished with precision, using fabrics chosen for the Nigerian climate.",
  },
  {
    title: "Restraint",
    body: "Fewer pieces, considered harder. We would rather make eight silhouettes properly than forty quickly.",
  },
  {
    title: "Identity",
    body: "A contemporary line rooted in Nigerian design sensibility, made for a local and international wardrobe.",
  },
  {
    title: "Longevity",
    body: "Small production runs, repairable construction, and materials that wear in rather than wear out.",
  },
];

const TIMELINE = [
  {
    year: "2024",
    title: "Founded in Lagos",
    body: "HEFA began with a simple question: why is it so hard to find a well-cut pair of pants here?",
  },
  {
    year: "2025",
    title: "The debut pants line",
    body: "Eight silhouettes across corporate and casual, produced in small runs and tested with real customers.",
  },
  {
    year: "Next",
    title: "Expanding the wardrobe",
    body: "Shirts, then suiting and occasionwear — each collection built on the same foundations.",
  },
];

/** About / brand story page. */
export default function AboutPage() {
  return (
    <>
      {/* Hero */}
      <section className="border-b border-black/10">
        <Container className="grid items-center gap-12 py-16 sm:py-24 lg:grid-cols-2">
          <div className="max-w-xl">
            <p className="text-xs font-medium uppercase tracking-[0.35em] text-burnt-orange">
              The label
            </p>
            <h1 className="mt-6 text-4xl leading-[1.08] sm:text-5xl">
              A Nigerian label built on restraint, craft and identity.
            </h1>
            <p className="mt-6 text-base leading-relaxed text-charcoal/80">
              {BRAND.description} We make considered clothing for people who want fewer, better
              things.
            </p>
          </div>

          {/* Decorative composition (placeholder for brand photography). */}
          <div className="relative aspect-[4/5] w-full overflow-hidden bg-charcoal">
            <div className="absolute inset-y-0 right-0 w-1/3 bg-cream" />
            <div className="absolute bottom-0 left-0 h-1/2 w-2/3 bg-forest" />
            <div className="absolute top-10 left-10 h-16 w-16 rounded-full bg-burnt-orange" />
            <div className="absolute right-8 bottom-8 max-w-[9rem]">
              <span className="font-serif text-2xl leading-tight text-black">Made in Lagos</span>
            </div>
          </div>
        </Container>
      </section>

      {/* Story */}
      <Section>
        <Container>
          <SectionHeading eyebrow="Our story" title="It started with a pair of pants" />
          <div className="mt-8 grid gap-8 lg:grid-cols-2">
            <p className="text-sm leading-relaxed text-charcoal/80">
              HEFA was founded on a simple frustration: it was remarkably hard to buy a well-cut
              pair of trousers in Lagos. Options were either cheap and disposable, or imported,
              expensive and cut for a different climate entirely.
            </p>
            <p className="text-sm leading-relaxed text-charcoal/80">
              So we began with the trouser. Not because it is the easiest thing to sell, but because
              it is the hardest thing to get right — and a wardrobe is built on the pieces you reach
              for every day. We design in Lagos, produce in small runs, and build each collection to
              be extended rather than replaced.
            </p>
          </div>
        </Container>
      </Section>

      {/* Pillars */}
      <Section className="border-t border-black/10">
        <Container>
          <SectionHeading
            eyebrow="What guides us"
            title="Four ideas behind every piece"
            align="center"
          />
          <div className="mt-12 grid gap-10 sm:grid-cols-2 lg:grid-cols-4">
            {PILLARS.map((pillar) => (
              <div key={pillar.title}>
                <h2 className="text-xl">{pillar.title}</h2>
                <p className="mt-3 text-sm leading-relaxed text-charcoal/80">{pillar.body}</p>
              </div>
            ))}
          </div>
        </Container>
      </Section>

      {/* Timeline */}
      <Section className="bg-forest text-cream">
        <Container>
          <SectionHeading eyebrow="The journey" title="Where we are and what is next" />
          <ol className="mt-12 flex flex-col gap-8 sm:flex-row sm:gap-10">
            {TIMELINE.map((entry) => (
              <li key={entry.year} className="flex-1 border-t border-cream/25 pt-5">
                <p className="text-xs uppercase tracking-[0.25em] text-ochre">{entry.year}</p>
                <h2 className="mt-3 text-xl text-cream">{entry.title}</h2>
                <p className="mt-3 text-sm leading-relaxed text-cream/75">{entry.body}</p>
              </li>
            ))}
          </ol>

          <div className="mt-12 flex flex-wrap gap-4">
            <Button href="/shop" variant="accent" size="lg">
              Shop the collection
            </Button>
            <Button href="/contact" variant="light" size="lg">
              Work with us
            </Button>
          </div>
        </Container>
      </Section>
    </>
  );
}
