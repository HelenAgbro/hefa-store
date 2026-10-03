import Image from "next/image";
import Link from "next/link";
import { Container } from "@/components/ui/Container";
import { Section } from "@/components/ui/Section";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { CATEGORIES } from "@/lib/data/categories";
import { SWATCH_TEXTURE } from "@/lib/utils";

/** "Corporate" and "Casual" category cards linking into the shop. */
export function CategoryGrid() {
  return (
    <Section id="categories">
      <Container>
        <SectionHeading
          eyebrow="Shop by category"
          title="Two wardrobes, one standard of craft"
          description="Start with sharp tailoring for work or relaxed pants for the weekend. Both are cut to the same exacting standard."
        />

        <div className="mt-12 grid gap-6 sm:grid-cols-2">
          {CATEGORIES.map((category) => (
            <Link
              key={category.slug}
              href={category.href}
              className="group relative block aspect-[4/5] overflow-hidden bg-charcoal sm:aspect-[3/4]"
            >
              {/* The swatch stays underneath as the fallback, so a category
                  without a photograph still renders as a colour block. */}
              <div className="absolute inset-0" style={{ backgroundColor: category.swatch }} />
              {category.image ? (
                <Image
                  src={category.image}
                  alt={`${category.name} — ${category.description}`}
                  fill
                  sizes="(max-width: 640px) 100vw, 50vw"
                  className="object-cover transition-transform duration-700 group-hover:scale-105"
                />
              ) : (
                <div className="absolute inset-0 opacity-20" style={SWATCH_TEXTURE} />
              )}

              {/* Photographs vary wildly in brightness, so the caption sits on a
                  gradient rather than relying on the image being dark. */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />

              <div className="absolute inset-0 flex flex-col justify-end p-6 sm:p-8">
                <h3 className="text-2xl text-cream sm:text-3xl">{category.name}</h3>
                <p className="mt-2 max-w-xs text-sm text-cream/85">{category.description}</p>
                <span className="mt-5 inline-flex items-center gap-2 text-xs uppercase tracking-[0.18em] text-cream transition-colors group-hover:text-ochre">
                  Shop {category.name} <span aria-hidden="true">→</span>
                </span>
              </div>
            </Link>
          ))}
        </div>
      </Container>
    </Section>
  );
}
