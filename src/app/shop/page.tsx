import type { Metadata } from "next";
import { ShopCatalog } from "@/components/shop/ShopCatalog";
import { Container } from "@/components/ui/Container";
import { getAllProducts } from "@/lib/products-repository";

export const metadata: Metadata = {
  title: "Shop",
  description:
    "Shop the HEFA pants line — tailored trousers for the corporate and casual wardrobe.",
};

/** Revalidate periodically so catalogue changes appear quickly. */
export const revalidate = 60;

/**
 * Shop / catalog page.
 * Loads the catalogue (Supabase, with a local fallback) and hands it to the
 * interactive ShopCatalog, which handles filtering and sorting in the browser.
 */
export default async function ShopPage() {
  const products = await getAllProducts();

  return (
    <>
      <section className="border-b border-black/10">
        <Container className="py-12 sm:py-16">
          <p className="text-xs font-medium uppercase tracking-[0.35em] text-burnt-orange">
            The collection
          </p>
          <h1 className="mt-4 text-4xl sm:text-5xl">Shop Pants</h1>
          <p className="mt-4 max-w-xl text-sm leading-relaxed text-charcoal/80">
            Eight refined silhouettes in premium fabrics. Use the filters to find your fit, or sort
            to browse the collection your way.
          </p>
        </Container>
      </section>

      <section>
        <Container className="py-10 sm:py-14">
          <ShopCatalog products={products} />
        </Container>
      </section>
    </>
  );
}
