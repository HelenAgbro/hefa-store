import { PRODUCTS } from "@/lib/data/products";
import { supabase } from "@/lib/supabase/client";
import type { Product } from "@/lib/types";

/**
 * Product data access.
 *
 * Reads live from Supabase when it is configured and reachable, and falls back
 * to the local catalogue in src/lib/data/products.ts otherwise — so the site
 * always renders, even with no database.
 *
 * Pages should import product data from here rather than from
 * src/lib/data/products.ts directly.
 */

const COLUMNS =
  "id, slug, name, price, category, colors, sizes, description, details, swatch, images, featured, badge, in_stock";

/** In-memory cache, so we hit the database once per server process. */
let cache: Product[] | null = null;

/** True when the catalogue is being served by Supabase. */
export let usingSupabase = false;

/** Map a database row (snake_case) to our Product type (camelCase). */
function rowToProduct(row: Record<string, unknown>): Product {
  return {
    id: String(row.id),
    slug: String(row.slug),
    name: String(row.name),
    price: Number(row.price),
    category: row.category as Product["category"],
    colors: (row.colors as string[]) ?? [],
    sizes: (row.sizes as string[]) ?? [],
    description: String(row.description ?? ""),
    details: (row.details as string[]) ?? [],
    swatch: String(row.swatch ?? "#2f2f2f"),
    images: (row.images as string[]) ?? [],
    featured: Boolean(row.featured),
    badge: row.badge ? String(row.badge) : undefined,
    inStock: Boolean(row.in_stock),
  };
}

async function fetchCatalogue(): Promise<Product[] | null> {
  if (!supabase) return null;

  const { data, error } = await supabase.from("products").select(COLUMNS).order("id");

  if (error) {
    console.warn("[products] Supabase error, using local data:", error.message);
    return null;
  }
  if (!data || data.length === 0) {
    console.warn("[products] Supabase returned no rows — using local data. Has schema.sql been run?");
    return null;
  }

  return data.map((row) => rowToProduct(row as Record<string, unknown>));
}

/** The full catalogue. Supabase first, local data as a fallback. */
export async function getAllProducts(): Promise<Product[]> {
  if (cache) return cache;

  const fromDatabase = await fetchCatalogue();
  usingSupabase = fromDatabase !== null;
  cache = fromDatabase ?? PRODUCTS;

  return cache;
}

/** One product by its URL slug. */
export async function getProductBySlug(slug: string): Promise<Product | undefined> {
  const products = await getAllProducts();
  return products.find((product) => product.slug === slug);
}

/** Products flagged for the homepage "Featured" section. */
export async function getFeaturedProducts(limit?: number): Promise<Product[]> {
  const products = await getAllProducts();
  const featured = products.filter((product) => product.featured);
  return limit ? featured.slice(0, limit) : featured;
}

/** Related products: same category first, then the rest. */
export async function getRelatedProducts(product: Product, limit = 4): Promise<Product[]> {
  const others = (await getAllProducts()).filter((item) => item.id !== product.id);
  const sameCategory = others.filter((item) => item.category === product.category);
  const different = others.filter((item) => item.category !== product.category);
  return [...sameCategory, ...different].slice(0, limit);
}

/**
 * Synchronous lookup by id — used by the client-side cart, which cannot await.
 * Reads the cached catalogue and falls back to the local data.
 */
export function getProductById(id: string): Product | undefined {
  const products = cache ?? PRODUCTS;
  return products.find((product) => product.id === id);
}

export { getProductImages } from "@/lib/data/products";
