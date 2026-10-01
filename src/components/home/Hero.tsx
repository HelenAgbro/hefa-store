import { Button } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";

/** Full-width landing hero: editorial copy alongside an abstract brand visual. */
export function Hero() {
  return (
    <section className="border-b border-black/10">
      <Container className="grid items-center gap-12 py-16 sm:py-24 lg:grid-cols-2 lg:py-32">
        <div className="max-w-xl">
          <p className="text-xs font-medium uppercase tracking-[0.35em] text-burnt-orange">
            The debut collection
          </p>
          <h1 className="mt-6 text-4xl leading-[1.08] sm:text-5xl lg:text-6xl">
            Tailored pants, made for the modern African wardrobe.
          </h1>
          <p className="mt-6 max-w-md text-base leading-relaxed text-charcoal/80">
            HEFA is a Nigerian designer label. Our first line is a considered collection of tailored
            pants for the corporate and casual wardrobe.
          </p>
          <div className="mt-10 flex flex-wrap gap-4">
            <Button href="/shop" size="lg">
              Shop pants
            </Button>
            <Button href="/lookbook" variant="outline" size="lg">
              View lookbook
            </Button>
          </div>
        </div>

        {/* Decorative colour-block composition (placeholder for editorial photography). */}
        <div className="relative aspect-[4/5] w-full overflow-hidden bg-forest lg:aspect-[5/6]">
          <div className="absolute inset-y-0 left-0 w-1/3 bg-cream" />
          <div className="absolute right-0 bottom-0 h-1/2 w-2/3 bg-ochre" />
          <div className="absolute top-10 right-10 h-20 w-20 rounded-full bg-burnt-orange" />
          <div className="absolute bottom-10 left-[10%] max-w-[9rem]">
            <span className="font-serif text-2xl leading-tight text-black">
              Modern Afro-Minimalism
            </span>
          </div>
        </div>
      </Container>
    </section>
  );
}
