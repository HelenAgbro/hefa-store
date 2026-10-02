import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ProductGallery } from "@/components/product/ProductGallery";
import { ProductGrid } from "@/components/product/ProductGrid";
import { ProductPurchasePanel } from "@/components/product/ProductPurchasePanel";
import { Container } from "@/components/ui/Container";
import { Section } from "@/components/ui/Section";
import { SectionHeading } from "@/components/ui/SectionHeading";
import {
  getProductBySlug,
  getProductImages,
  getRelatedProducts,
} from "@/lib/products-repository";
import { formatNaira } from "@/lib/format";

interface ProductPageProps {
  params: Promise<{ slug: string }>;
}

/**
 * The catalogue now comes from Supabase, so this page is rendered on demand
 * and revalidated every 60 seconds instead of being pre-built at deploy time.
 */
export const revalidate = 60;

export async function generateMetadata({ params }: ProductPageProps): Promise<Metadata> {
  const { slug } = await params;
  const product = await getProductBySlug(slug);
  if (!product) return { title: "Product not found" };
  return { title: product.name, description: product.description };
}

/**
 * Product detail page.
 * Loads one product from the repository (Supabase, with a local fallback),
 * shows the gallery and purchase panel, and lists related pieces.
 */
export default async function ProductPage({ params }: ProductPageProps) {
  const { slug } = await params;
  const product = await getProductBySlug(slug);

  if (!product) notFound();

  const images = getProductImages(product);
  const related = await getRelatedProducts(product, 4);

  return (
    <>
      <Container className="pt-6">
        <nav
          aria-label="Breadcrumb"
          className="text-[0.65rem] uppercase tracking-[0.18em] text-charcoal/60"
        >
          <Link href="/" className="transition-colors hover:text-burnt-orange">
            Home
          </Link>
          <span className="px-2">/</span>
          <Link href="/shop" className="transition-colors hover:text-burnt-orange">
            Shop
          </Link>
          <span className="px-2">/</span>
          <span className="text-charcoal">{product.name}</span>
        </nav>
      </Container>

      <section>
        <Container className="grid gap-10 py-10 lg:grid-cols-2 lg:gap-16 lg:py-14">
          <ProductGallery images={images} name={product.name} badge={product.badge} />

          <div className="lg:py-4">
            <p className="text-xs font-medium uppercase tracking-[0.35em] text-burnt-orange">
              {product.category}
            </p>
            <h1 className="mt-4 text-3xl sm:text-4xl">{product.name}</h1>
            <p className="mt-4 text-lg tabular-nums text-black">{formatNaira(product.price)}</p>

            <p className="mt-6 max-w-prose text-sm leading-relaxed text-charcoal/80">
              {product.description}
            </p>

            <ul className="mt-6 flex flex-col gap-2 border-t border-black/10 pt-6 text-sm text-charcoal/80">
              {product.details.map((detail) => (
                <li key={detail} className="flex gap-3">
                  <span aria-hidden="true" className="text-burnt-orange">
                    —
                  </span>
                  {detail}
                </li>
              ))}
            </ul>

            <div className="mt-8">
              <ProductPurchasePanel product={product} />
            </div>
          </div>
        </Container>
      </section>

      {related.length > 0 ? (
        <Section className="border-t border-black/10">
          <Container>
            <SectionHeading eyebrow="You may also like" title="More from the collection" />
            <div className="mt-12">
              <ProductGrid products={related} />
            </div>
          </Container>
        </Section>
      ) : null}
    </>
  );
}
