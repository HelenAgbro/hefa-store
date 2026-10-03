import Image from "next/image";
import { Button } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";

const HEADLINE = "Tailored pants, made for the modern African wardrobe.";

/**
 * Landing hero: editorial copy alongside the debut campaign photograph.
 *
 * Deliberately still a server component. The whole entrance sequence is CSS
 * keyframes in `globals.css` with staggered `animation-delay`, so the browser
 * animates it without shipping any JavaScript for it. The words are split here
 * on the server rather than in the browser, which is why this costs nothing.
 */
export function Hero() {
  return (
    <section>
      <Container className="grid items-center gap-12 py-14 sm:py-20 lg:grid-cols-2 lg:py-28">
        <div className="max-w-xl">
          <p className="animate-fade-up text-xs font-medium uppercase tracking-[0.35em] text-burnt-orange">
            The debut collection
          </p>

          <h1 className="mt-6 text-4xl leading-[1.06] sm:text-5xl lg:text-[3.6rem]">
            {HEADLINE.split(" ").map((word, index) => (
              // Each word sits in its own overflow-hidden mask, so it rises
              // from behind an invisible edge. The padding/negative-margin pair
              // gives descenders (the p, the g) room without shifting layout.
              <span
                key={`${word}-${index}`}
                className="-mb-[0.14em] inline-block overflow-hidden pb-[0.14em] align-bottom"
              >
                <span
                  className="inline-block animate-word-up"
                  style={{ animationDelay: `${300 + index * 60}ms` }}
                >
                  {word}
                </span>
                {index < HEADLINE.split(" ").length - 1 ? " " : null}
              </span>
            ))}
          </h1>

          <p
            className="animate-fade-up mt-6 max-w-md text-base leading-relaxed text-charcoal/80"
            style={{ animationDelay: "560ms" }}
          >
            HEFA is a Nigerian designer label. Our first line is a considered collection of tailored
            pants for the corporate and casual wardrobe.
          </p>

          <div
            className="animate-fade-up mt-10 flex flex-wrap gap-4"
            style={{ animationDelay: "700ms" }}
          >
            <Button href="/shop" size="lg">
              Shop pants
            </Button>
            <Button href="/lookbook" variant="outline" size="lg">
              View lookbook
            </Button>
          </div>
        </div>

        {/* The photograph is the Largest Contentful Paint element, so it is
            eager-loaded and hinted to the browser as high priority. */}
        <div className="relative aspect-[3/4] w-full overflow-hidden bg-forest">
          <Image
            src="/images/hero.jpg"
            alt="A model wearing the HEFA debut collection: wide-leg striped trousers with a cutwork top."
            fill
            loading="eager"
            fetchPriority="high"
            sizes="(max-width: 1024px) 100vw, 50vw"
            className="animate-image-reveal object-cover"
            style={{ animationDelay: "150ms" }}
          />
        </div>
      </Container>
    </section>
  );
}
