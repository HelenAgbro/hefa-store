import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import { Section } from "@/components/ui/Section";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { LOOKBOOK } from "@/lib/data/lookbook";
import { SWATCH_TEXTURE } from "@/lib/utils";

/** Grid of lookbook entries linking through to the full lookbook page. */
export function LookbookPreview() {
  return (
    <Section id="lookbook">
      <Container>
        <div className="flex flex-wrap items-end justify-between gap-6">
          <SectionHeading
            eyebrow="Lookbook"
            title="Styled for the season"
            description="A preview of the debut campaign, shot on location in Lagos."
          />
          <Button href="/lookbook" variant="outline" size="sm">
            View lookbook
          </Button>
        </div>

        <div className="mt-12 grid grid-cols-2 gap-4 lg:grid-cols-3">
          {LOOKBOOK.map((entry) => (
            <Link
              key={entry.id}
              href="/lookbook"
              className="group relative block aspect-[4/5] overflow-hidden"
            >
              <div className="absolute inset-0" style={{ backgroundColor: entry.swatch }} />
              {entry.image ? (
                <Image
                  src={entry.image}
                  alt={entry.title}
                  fill
                  sizes="(max-width: 1024px) 50vw, 33vw"
                  className="object-cover"
                />
              ) : (
                <div className="absolute inset-0 opacity-20" style={SWATCH_TEXTURE} />
              )}
              <div className="absolute inset-0 bg-black/0 transition-colors duration-500 group-hover:bg-black/25" />
              <div className="absolute inset-x-0 bottom-0 translate-y-0 p-5 opacity-100 transition-all duration-500 lg:translate-y-2 lg:opacity-0 lg:group-hover:translate-y-0 lg:group-hover:opacity-100">
                <p className="font-serif text-lg text-cream">{entry.title}</p>
                <p className="mt-1 text-[0.65rem] uppercase tracking-[0.18em] text-cream/80">
                  {entry.caption}
                </p>
              </div>
            </Link>
          ))}
        </div>
      </Container>
    </Section>
  );
}
