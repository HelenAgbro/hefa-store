import { NextResponse } from "next/server";
import { getAllProducts } from "@/lib/products-repository";
import type { Product } from "@/lib/types";

/**
 * The product catalogue.
 *
 *   GET /api/products          every product
 *   GET /api/products?featured=1   only the featured ones
 *   GET /api/products?category=Corporate
 *
 * ---------------------------------------------------------------------------
 * WHY THIS EXISTS WHEN THE DATABASE IS ALREADY PUBLIC
 * ---------------------------------------------------------------------------
 * The products table is readable by anyone, so the mobile app could query
 * Supabase directly — which it did to begin with. It goes through here instead
 * so there is genuinely one way to read the catalogue.
 *
 * That matters as soon as the catalogue stops being a bare table. Deciding
 * which products are visible, hiding an unpublished one, or adding a field that
 * must not leave the server are all changes made in one file, rather than
 * duplicated in every client that happens to query the table.
 *
 * It also reuses getAllProducts(), which is the same function the website's own
 * pages call, so the two cannot drift apart.
 *
 * ---------------------------------------------------------------------------
 * CACHING
 * ---------------------------------------------------------------------------
 * Public, identical for every visitor and safe to cache briefly. The short
 * max-age keeps a price change from taking minutes to appear, while still
 * absorbing a burst of traffic.
 */

export const revalidate = 60;

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const featuredOnly = searchParams.get("featured") === "1";
  const category = searchParams.get("category");

  let products: Product[];
  try {
    products = await getAllProducts();
  } catch (error) {
    console.error("[api/products] Could not load the catalogue:", error);
    return NextResponse.json({ error: "We could not load the collection." }, { status: 500 });
  }

  if (featuredOnly) {
    products = products.filter((product) => product.featured);
  }

  if (category === "Corporate" || category === "Casual") {
    products = products.filter((product) => product.category === category);
  }

  return NextResponse.json(
    { products, count: products.length },
    {
      headers: {
        "Cache-Control": "public, max-age=60, stale-while-revalidate=300",
      },
    },
  );
}