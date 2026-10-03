import type { Metadata } from "next";
import Image from "next/image";
import { Button } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import { Section } from "@/components/ui/Section";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { LOOKBOOK } from "@/lib/data/lookbook";
import { SWATCH_TEXTURE } from "@/lib/utils";

export const metadata: Metadata = {
  title: "Lookbook",
  description: "The HEFA debut campaign, shot on location in Lagos.",
};

const [feature, ...rest] = LOOKBOOK;

/** Editorial lookbook page. */
export default function LookbookPage() {
  return (
    <>
      {/* Hero */}
      <section className="border-b border-black/10">
        <Container className="py-12 sm:py-16">
          <p className="text-xs font-medium uppercase tracking-[0.35em] text-burnt-orange">
            Campaign AW25
          </p>
          <h1 className="mt-4 text-4xl sm:text-5xl">Lookbook</h1>
          <p className="mt-4 max-w-xl text-sm leading-relaxed text-charcoal/80">
            Our debut campaign, photographed on location in Lagos. Tailored
            pants styled for the studio, the street and the space in between.
          </p>
        </Container>
      </section>

      {/* Feature spread. The frame is portrait because every campaign
          photograph is portrait — at 16/10 the image optimiser would crop
          roughly half the height out of each shot. */}
      {feature ? (
        <section>
          <Container className="py-10 sm:py-14">
            <figure className="relative mx-auto aspect-[3/4] w-full max-w-2xl overflow-hidden bg-charcoal">
              <div
                className="absolute inset-0"
                style={{ backgroundColor: feature.swatch }}
              />
              {feature.image ? (
                <Image
                  src={feature.image}
                  alt={feature.title}
                  fill
                  sizes="(max-width: 640px) 100vw, 42rem"
                  className="object-cover"
                />
              ) : (
                <div
                  className="absolute inset-0 opacity-20"
                  style={SWATCH_TEXTURE}
                />
              )}
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
              <figcaption className="absolute bottom-6 left-6 sm:bottom-8 sm:left-8">
                <p className="font-serif text-2xl text-cream sm:text-3xl">
                  {feature.title}
                </p>
                <p className="mt-1 text-[0.65rem] uppercase tracking-[0.18em] text-cream/75">
                  {feature.caption}
                </p>
              </figcaption>
            </figure>
          </Container>
        </section>
      ) : null}

      {/* Grid */}
      <Section className="border-t border-black/10">
        <Container>
          <SectionHeading eyebrow="The edit" title="Look by look" />
          <div className="mt-12 grid grid-cols-2 gap-4 lg:grid-cols-3">
            {rest.map((entry) => (
              <figure
                key={entry.id}
                className="relative aspect-[4/5] overflow-hidden"
              >
                <div
                  className="absolute inset-0"
                  style={{ backgroundColor: entry.swatch }}
                />
                {entry.image ? (
                  <Image
                    src={entry.image}
                    alt={entry.title}
                    fill
                    sizes="(max-width: 1024px) 50vw, 33vw"
                    className="object-cover"
                  />
                ) : (
                  <div
                    className="absolute inset-0 opacity-20"
                    style={SWATCH_TEXTURE}
                  />
                )}
                <figcaption className="absolute inset-x-0 bottom-0 p-5">
                  <p className="font-serif text-lg text-cream">{entry.title}</p>
                  <p className="mt-1 text-[0.65rem] uppercase tracking-[0.18em] text-cream/75">
                    {entry.caption}
                  </p>
                </figcaption>
              </figure>
            ))}
          </div>
        </Container>
      </Section>

      {/* Quote band + CTA */}
      <section className="bg-black text-cream">
        <Container className="flex flex-col items-start gap-8 py-16 sm:flex-row sm:items-center sm:justify-between sm:py-20">
          <p className="max-w-xl font-serif text-2xl leading-snug sm:text-3xl">
            “The wardrobe should be small, and the pieces should be serious.”
          </p>
          <div className="flex flex-wrap gap-4">
            <Button href="/shop" variant="accent" size="lg">
              Shop the collection
            </Button>
            <Button href="/about" variant="light" size="lg">
              About HEFA
            </Button>
          </div>
        </Container>
      </section>
    </>
  );
}
