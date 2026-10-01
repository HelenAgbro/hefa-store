/**
 * Shared data types for the HEFA storefront.
 */

export type CategoryName = "Corporate" | "Casual";

export interface Product {
  id: string;
  /** URL-friendly identifier, used for /product/[slug] later. */
  slug: string;
  name: string;
  /** Price in whole Naira. */
  price: number;
  category: CategoryName;
  colors: string[];
  sizes: string[];
  description: string;
  details: string[];
  /** Hex colour used as a fallback background when no photo is available. */
  swatch: string;
  /** Optional image paths. Falls back to generated placeholders when omitted. */
  images?: string[];
  /** Shows in the homepage "Featured" section. */
  featured?: boolean;
  /** Optional label such as "New" or "Best seller". */
  badge?: string;
  inStock: boolean;
}

export interface Category {
  slug: "corporate" | "casual";
  name: CategoryName;
  description: string;
  href: string;
  /** Hex colour stand-in for category imagery. */
  swatch: string;
}

export interface LookbookEntry {
  id: string;
  title: string;
  caption: string;
  swatch: string;
  /** Optional real photograph. Falls back to the colour swatch when absent. */
  image?: string;
}
