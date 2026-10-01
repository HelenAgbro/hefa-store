import { Button } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import { Section } from "@/components/ui/Section";

/** Editorial brand-story section on a dark background. */
export function BrandStory() {
  return (
    <Section id="story" className="bg-black text-cream">
      <Container className="grid items-center gap-12 lg:grid-cols-2">
        {/* Decorative composition (placeholder for brand imagery). */}
        <div className="relative aspect-[4/5] w-full overflow-hidden bg-charcoal lg:aspect-square">
          <div className="absolute inset-y-0 right-0 w-1/3 bg-ochre" />
          <div className="absolute bottom-0 left-0 h-1/2 w-2/3 bg-forest" />
          <div className="absolute top-10 left-10 h-16 w-16 rounded-full bg-burnt-orange" />
        </div>

        <div className="max-w-xl">
          <p className="text-xs font-medium uppercase tracking-[0.35em] text-ochre">The HEFA story</p>
          <h2 className="mt-6 text-3xl sm:text-4xl">
            A Nigerian label built on restraint, craft and identity.
          </h2>
          <p className="mt-6 text-sm leading-relaxed text-cream/80">
            HEFA was founded on a simple idea: that a well-cut pair of pants can carry an entire
            wardrobe. We begin with the pants — a considered line made for professionals, for
            weekends, and for the space in between.
          </p>
          <p className="mt-4 text-sm leading-relaxed text-cream/80">
            Every piece is designed in Lagos and produced in small runs, with fabrics chosen for the
            Nigerian climate and detailing that rewards a second look.
          </p>
          <Button href="/about" variant="light" size="lg" className="mt-8">
            Read our story
          </Button>
        </div>
      </Container>
    </Section>
  );
}
