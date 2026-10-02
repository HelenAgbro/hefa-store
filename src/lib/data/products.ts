import type { Product } from "@/lib/types";

/**
 * TEMPORARY LOCAL PRODUCT DATA.
 *
 * This stands in for a real backend/database. It lives here so it can be
 * swapped for API calls later without changing any page or component.
 * Prices are whole Naira.
 *
 * ------------------------------------------------------------------
 * PRODUCT PHOTOGRAPHY
 * ------------------------------------------------------------------
 * Each product's `images` array drives the shop grid, the product page
 * gallery, the mini-cart and the order summary. Every product points at
 * real photography in /public/images/products, named after its slug:
 *
 *        images: ["/images/products/adeola-tailored-trouser-1.jpg"]
 *
 * To swap in a new photo, drop the file into /public/images/products/
 * using the same `<slug>-<n>.jpg` naming, then update the path here.
 * Products with a single photo render a one-image gallery — add more
 * shots (front, side, detail) as you shoot them. Portrait 4:5
 * (e.g. 1200 x 1500 px) works best; JPG or WebP keeps the pages fast.
 *
 * This file is the offline fallback only. The live catalogue is read from
 * Supabase, which is refreshed by re-running supabase/schema.sql.
 */
export const PRODUCTS: Product[] = [
  {
    id: "hefa-001",
    slug: "adeola-tailored-trouser",
    name: "Adeola Tailored Trouser",
    price: 68000,
    category: "Corporate",
    colors: ["Navy", "Indigo"],
    sizes: ["30", "32", "34", "36", "38"],
    description:
      "A navy pinstripe wide-leg trouser in a crisp suiting — sharp for the boardroom, easy for every other day.",
    details: ["Pinstripe suiting", "Wide leg, mid-rise", "Dry clean only"],
    swatch: "#1f2a44",
    images: ["/images/products/adeola-tailored-trouser-1.jpg"],
    featured: true,
    badge: "Best seller",
    inStock: true,
  },
  {
    id: "hefa-002",
    slug: "ngozi-wide-leg-pant",
    name: "Ngozi Wide-Leg Pant",
    price: 74000,
    category: "Casual",
    colors: ["Multicolour", "Red"],
    sizes: ["30", "32", "34", "36", "38"],
    description:
      "A statement wide-leg in signature Afro-print, finished with patch pockets and a full, flowing hem.",
    details: ["Printed viscose", "Wide leg, high-rise", "Machine wash cold"],
    swatch: "#b03a2e",
    images: [
      "/images/products/ngozi-wide-leg-pant-1.jpg",
      "/images/products/ngozi-wide-leg-pant-2.jpg",
      "/images/products/ngozi-wide-leg-pant-3.jpg",
    ],
    featured: true,
    inStock: true,
  },
  {
    id: "hefa-003",
    slug: "iwe-pleated-trouser",
    name: "Ìwé Pleated Trouser",
    price: 76000,
    category: "Corporate",
    colors: ["Aubergine", "Plum"],
    sizes: ["30", "32", "34", "36"],
    description:
      "A deep aubergine pleated wide-leg — polished in the office, striking after hours.",
    details: ["Double pleat", "Wide leg, high-rise", "Dry clean only"],
    swatch: "#4a2540",
    images: ["/images/products/iwe-pleated-trouser-1.jpg"],
    inStock: true,
  },
  {
    id: "hefa-004",
    slug: "amara-high-waist-pant",
    name: "Amara High-Waist Pant",
    price: 58000,
    category: "Casual",
    colors: ["Ochre", "Mustard"],
    sizes: ["28", "30", "32", "34"],
    description:
      "A relaxed high-waist harem pant in warm mustard — an effortless anchor for weekend dressing.",
    details: ["Printed cotton", "Elastic high-waist, relaxed leg", "Machine wash cold"],
    swatch: "#e0a526",
    images: ["/images/products/amara-high-waist-pant-1.jpg"],
    featured: true,
    badge: "New",
    inStock: true,
  },
  {
    id: "hefa-005",
    slug: "zara-cropped-pant",
    name: "Zara Cropped Pant",
    price: 54000,
    category: "Casual",
    colors: ["Grey", "Charcoal"],
    sizes: ["28", "30", "32", "34"],
    description:
      "A cropped tailored trouser in cool grey with an asymmetric wrap panel — made to be worn with loafers.",
    details: ["Wool blend", "Cropped, tapered leg", "Dry clean only"],
    swatch: "#6b7280",
    images: ["/images/products/zara-cropped-pant-1.jpg"],
    inStock: true,
  },
  {
    id: "hefa-006",
    slug: "ifeoma-fluid-pant",
    name: "Ifeoma Fluid Pant",
    price: 62000,
    category: "Casual",
    colors: ["Cream", "Ivory"],
    sizes: ["28", "30", "32", "34"],
    description:
      "A soft ivory wide-leg with a clean pleated front — comfort that still holds its shape.",
    details: ["Tencel blend", "Pleated wide leg, mid-rise", "Machine wash cold"],
    swatch: "#e9e2d2",
    images: ["/images/products/ifeoma-fluid-pant-1.jpg"],
    featured: true,
    inStock: true,
  },
  {
    id: "hefa-007",
    slug: "dami-classic-trouser",
    name: "Dami Classic Trouser",
    price: 66000,
    category: "Corporate",
    colors: ["Camel", "Ochre"],
    sizes: ["30", "32", "34", "36", "38"],
    description:
      "A warm camel pleated trouser — the classic neutral that quietly carries a whole wardrobe.",
    details: ["Wool blend", "Pleated wide leg", "Dry clean only"],
    swatch: "#b98b5e",
    images: ["/images/products/dami-classic-trouser-1.jpg"],
    inStock: true,
  },
  {
    id: "hefa-008",
    slug: "kehinde-relaxed-pant",
    name: "Kehinde Relaxed Pant",
    price: 56000,
    category: "Casual",
    colors: ["Olive", "Forest"],
    sizes: ["28", "30", "32", "34", "36"],
    description:
      "A relaxed, easy pant in olive green, balancing comfort with a considered, modern line.",
    details: ["Heavy cotton", "Relaxed wide leg", "Machine wash cold"],
    swatch: "#6b7d3a",
    images: ["/images/products/kehinde-relaxed-pant-1.jpg"],
    inStock: true,
  },
];

/** Products flagged for the homepage "Featured" section. */
export function getFeaturedProducts(): Product[] {
  return PRODUCTS.filter((product) => product.featured);
}

/** The full catalogue — used by the shop page. */
export function getAllProducts(): Product[] {
  return PRODUCTS;
}

/** Find a product by its URL slug (used by the product detail page). */
export function getProductBySlug(slug: string): Product | undefined {
  return PRODUCTS.find((product) => product.slug === slug);
}

/** Find a product by its id (used by the cart to resolve line items). */
export function getProductById(id: string): Product | undefined {
  return PRODUCTS.find((product) => product.id === id);
}

/**
 * Image list for a product.
 * Uses the photos supplied on the product, otherwise falls back to the
 * conventionally-named file in /public/images/products.
 */
export function getProductImages(product: Product): string[] {
  if (product.images && product.images.length > 0) return product.images;
  return [`/images/products/${product.slug}-1.jpg`];
}

/** Related products: same category first, then the rest of the catalogue. */
export function getRelatedProducts(product: Product, limit = 4): Product[] {
  const others = PRODUCTS.filter((item) => item.id !== product.id);
  const sameCategory = others.filter((item) => item.category === product.category);
  const different = others.filter((item) => item.category !== product.category);
  return [...sameCategory, ...different].slice(0, limit);
}
