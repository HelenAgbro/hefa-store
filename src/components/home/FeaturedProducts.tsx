import { ProductCard } from "@/components/product/ProductCard";
import { Button } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import { Section } from "@/components/ui/Section";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { getFeaturedProducts } from "@/lib/data/products";

/** Featured products, pulled from the temporary local data. */
export function FeaturedProducts() {
  const products = getFeaturedProducts();

  return (
    <Section id="featured">
      <Container>
        <div className="flex flex-wrap items-end justify-between gap-6">
          <SectionHeading
            eyebrow="Featured"
            title="The pieces to start with"
            description="A first look at the HEFA pants line — four silhouettes we keep coming back to."
          />
          <Button href="/shop" variant="outline" size="sm">
            View all
          </Button>
        </div>

        <div className="mt-12 grid grid-cols-2 gap-x-5 gap-y-10 lg:grid-cols-4">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </Container>
    </Section>
  );
}
