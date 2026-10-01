import type { Product } from "@/lib/types";

/**
 * TEMPORARY LOCAL PRODUCT DATA.
 *
 * This stands in for a real backend/database. It lives here so it can be
 * swapped for API calls later without changing any page or component.
 * Prices are whole Naira.
 *
 * ------------------------------------------------------------------
 * HOW TO USE YOUR OWN PRODUCT PHOTOGRAPHY
 * ------------------------------------------------------------------
 * Each product's `images` array drives the shop grid, the product page
 * gallery, the mini-cart and the order summary. Right now every product
 * points at generated placeholder artwork in /public/images/products.
 *
 * To switch to your real photos:
 *   1. Save your files in  public/images/products/
 *   2. Change the paths below to your filenames, for example:
 *        images: ["/images/products/adeola-tailored-trouser-1.jpg"]
 *
 * Recommended: 3 images per product (front, side, detail), portrait 4:5
 * (e.g. 1200 x 1500 px), saved as JPG or WebP to keep the pages fast.
 * Only change this file — the whole site updates automatically.
 */
export const PRODUCTS: Product[] = [
  {
    id: "hefa-001",
    slug: "adeola-tailored-trouser",
    name: "Adeola Tailored Trouser",
    price: 68000,
    category: "Corporate",
    colors: ["Charcoal", "Black"],
    sizes: ["30", "32", "34", "36", "38"],
    description:
      "A clean, straight-leg trouser with a sharp centre crease — the backbone of the corporate wardrobe.",
    details: ["Mid-weight wool blend", "Straight leg, mid-rise", "Dry clean only"],
    swatch: "#2f2f2f",
    images: [
      "/images/products/adeola-tailored-trouser-1.svg",
      "/images/products/adeola-tailored-trouser-2.svg",
      "/images/products/adeola-tailored-trouser-3.svg",
    ],
    featured: true,
    badge: "Best seller",
    inStock: true,
  },
  {
    id: "hefa-002",
    slug: "ngozi-wide-leg-pant",
    name: "Ngozi Wide-Leg Pant",
    price: 74000,
    category: "Corporate",
    colors: ["Black", "Forest"],
    sizes: ["30", "32", "34", "36", "38"],
    description:
      "A fluid wide-leg silhouette with a high waist, cut to elongate and move effortlessly.",
    details: ["Crepe suiting", "Wide leg, high-rise", "Dry clean only"],
    swatch: "#0b0b0b",
    images: [
      "/images/products/ngozi-wide-leg-pant-1.svg",
      "/images/products/ngozi-wide-leg-pant-2.svg",
      "/images/products/ngozi-wide-leg-pant-3.svg",
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
    colors: ["Forest", "Charcoal"],
    sizes: ["30", "32", "34", "36"],
    description:
      "Front-pleated trousers in a deep forest tone, tailored for a crisp, modern office look.",
    details: ["Double pleat", "Tapered leg", "Machine wash cold"],
    swatch: "#1e3a2f",
    images: [
      "/images/products/iwe-pleated-trouser-1.svg",
      "/images/products/iwe-pleated-trouser-2.svg",
      "/images/products/iwe-pleated-trouser-3.svg",
    ],
    inStock: true,
  },
  {
    id: "hefa-004",
    slug: "amara-high-waist-pant",
    name: "Amara High-Waist Pant",
    price: 58000,
    category: "Casual",
    colors: ["Ochre", "Cream"],
    sizes: ["28", "30", "32", "34"],
    description:
      "A relaxed high-waist pant in warm ochre — an effortless anchor for weekend dressing.",
    details: ["Cotton twill", "High-waist, relaxed leg", "Machine wash cold"],
    swatch: "#b8860b",
    images: [
      "/images/products/amara-high-waist-pant-1.svg",
      "/images/products/amara-high-waist-pant-2.svg",
      "/images/products/amara-high-waist-pant-3.svg",
    ],
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
    colors: ["Burnt Orange"],
    sizes: ["28", "30", "32", "34"],
    description:
      "A cropped, tapered pant in a rich burnt orange, designed to be worn with loafers or sneakers.",
    details: ["Structured cotton", "Cropped, tapered leg", "Machine wash cold"],
    swatch: "#b4551f",
    images: [
      "/images/products/zara-cropped-pant-1.svg",
      "/images/products/zara-cropped-pant-2.svg",
      "/images/products/zara-cropped-pant-3.svg",
    ],
    inStock: true,
  },
  {
    id: "hefa-006",
    slug: "ifeoma-fluid-pant",
    name: "Ifeoma Fluid Pant",
    price: 62000,
    category: "Casual",
    colors: ["Cream", "Ochre"],
    sizes: ["28", "30", "32", "34"],
    description:
      "A soft, fluid pant in cream with a drawcord waist — comfort without losing shape.",
    details: ["Tencel blend", "Drawcord waist", "Machine wash cold"],
    swatch: "#e9e2d2",
    images: [
      "/images/products/ifeoma-fluid-pant-1.svg",
      "/images/products/ifeoma-fluid-pant-2.svg",
      "/images/products/ifeoma-fluid-pant-3.svg",
    ],
    featured: true,
    inStock: true,
  },
  {
    id: "hefa-007",
    slug: "dami-classic-trouser",
    name: "Dami Classic Trouser",
    price: 66000,
    category: "Corporate",
    colors: ["Charcoal", "Black"],
    sizes: ["30", "32", "34", "36", "38"],
    description:
      "An everyday tailored trouser with a slim leg and a subtle stretch for comfort in transit.",
    details: ["Stretch wool blend", "Slim leg", "Dry clean only"],
    swatch: "#3a3a3a",
    images: [
      "/images/products/dami-classic-trouser-1.svg",
      "/images/products/dami-classic-trouser-2.svg",
      "/images/products/dami-classic-trouser-3.svg",
    ],
    inStock: true,
  },
  {
    id: "hefa-008",
    slug: "kehinde-relaxed-pant",
    name: "Kehinde Relaxed Pant",
    price: 56000,
    category: "Casual",
    colors: ["Forest", "Charcoal"],
    sizes: ["28", "30", "32", "34", "36"],
    description:
      "A relaxed, easy pant in forest green, balancing comfort with a considered, modern line.",
    details: ["Heavy cotton", "Relaxed leg", "Machine wash cold"],
    swatch: "#274b3a",
    images: [
      "/images/products/kehinde-relaxed-pant-1.svg",
      "/images/products/kehinde-relaxed-pant-2.svg",
      "/images/products/kehinde-relaxed-pant-3.svg",
    ],
    inStock: false,
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
 * Uses real images when provided, otherwise falls back to the generated
 * placeholder photography in /public/images/products.
 */
export function getProductImages(product: Product): string[] {
  if (product.images && product.images.length > 0) return product.images;
  return [1, 2, 3].map((n) => `/images/products/${product.slug}-${n}.svg`);
}

/** Related products: same category first, then the rest of the catalogue. */
export function getRelatedProducts(product: Product, limit = 4): Product[] {
  const others = PRODUCTS.filter((item) => item.id !== product.id);
  const sameCategory = others.filter((item) => item.category === product.category);
  const different = others.filter((item) => item.category !== product.category);
  return [...sameCategory, ...different].slice(0, limit);
}
