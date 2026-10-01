import { AnnouncementBar } from "@/components/home/AnnouncementBar";
import { BrandStory } from "@/components/home/BrandStory";
import { CategoryGrid } from "@/components/home/CategoryGrid";
import { FeaturedProducts } from "@/components/home/FeaturedProducts";
import { Hero } from "@/components/home/Hero";
import { LookbookPreview } from "@/components/home/LookbookPreview";
import { Newsletter } from "@/components/home/Newsletter";
import { ShopPantsCta } from "@/components/home/ShopPantsCta";

/**
 * HEFA homepage.
 *
 * Sections, top to bottom: announcement bar → hero → Shop Pants call-to-action
 * → category split → featured products → brand story → lookbook preview → newsletter.
 * The shared Footer is rendered by the root layout.
 */
export default function Home() {
  return (
    <>
      <AnnouncementBar />
      <Hero />
      <ShopPantsCta />
      <CategoryGrid />
      <FeaturedProducts />
      <BrandStory />
      <LookbookPreview />
      <Newsletter />
    </>
  );
}


