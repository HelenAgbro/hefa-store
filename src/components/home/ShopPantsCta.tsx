import Image from "next/image";
import { Button } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";

/**
 * Full-bleed call-to-action band for the pants line.
 *
 * The aubergine pleated trouser shot is purely decorative here — the forest
 * green stays as the base colour underneath it, so the band still reads as
 * green if the photograph ever fails to load, and the scrim carries the
 * contrast for the cream copy rather than relying on the image being dark.
 */
export function ShopPantsCta() {
  return (
    <section className="relative overflow-hidden bg-forest text-cream">
      <Image
        src="/images/products/iwe-pleated-trouser-1.jpg"
        alt=""
        aria-hidden="true"
        fill
        sizes="100vw"
        className="object-cover"
      />
      <div className="absolute inset-0 bg-black/70" />

      <Container className="relative flex flex-col items-center gap-6 py-16 text-center sm:py-20">
        <p className="text-xs font-medium uppercase tracking-[0.35em] text-ochre">
          The pants line
        </p>
        <h2 className="max-w-2xl text-3xl sm:text-4xl">
          Shop Pants — tailored trousers designed to be worn everywhere.
        </h2>
        <p className="max-w-xl text-sm leading-relaxed text-cream/80">
          Eight refined silhouettes in premium fabrics, cut for the Nigerian climate and made to
          last well beyond the season.
        </p>
        <Button href="/shop" variant="accent" size="lg" className="mt-2">
          Shop the pants line
        </Button>
      </Container>
    </section>
  );
}
