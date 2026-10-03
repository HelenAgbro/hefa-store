import { AnnouncementBar } from "@/components/home/AnnouncementBar";
import { BrandStory } from "@/components/home/BrandStory";
import { CategoryGrid } from "@/components/home/CategoryGrid";
import { FeaturedProducts } from "@/components/home/FeaturedProducts";
import { Hero } from "@/components/home/Hero";
import { HeroTicker } from "@/components/home/HeroTicker";
import { LookbookPreview } from "@/components/home/LookbookPreview";
import { Newsletter } from "@/components/home/Newsletter";
import { ShopPantsCta } from "@/components/home/ShopPantsCta";
import { Reveal } from "@/components/ui/Reveal";

/**
 * HEFA homepage.
 *
 * Sections, top to bottom: announcement bar → hero → scrolling brand ticker
 * → Shop Pants call-to-action → category split → featured products
 * → brand story → lookbook preview → newsletter.
 * The shared Footer is rendered by the root layout.
 *
 * The hero and ticker animate themselves in CSS. Everything below them is
 * wrapped in `Reveal`, which fades each section up as it scrolls into view.
 * The sections themselves are untouched — they render exactly as they did
 * before, so at rest the page is visually unchanged; only the moment of
 * arrival differs.
 */
export default function Home() {
  return (
    <>
      <AnnouncementBar />
      <Hero />
      <HeroTicker />
      <Reveal>
        <ShopPantsCta />
      </Reveal>
      <Reveal>
        <CategoryGrid />
      </Reveal>
      <Reveal>
        <FeaturedProducts />
      </Reveal>
      <Reveal>
        <BrandStory />
      </Reveal>
      <Reveal>
        <LookbookPreview />
      </Reveal>
      <Reveal>
        <Newsletter />
      </Reveal>
    </>
  );
}


