import type { Category } from "@/lib/types";

/** The two launch categories for the pants line. */
export const CATEGORIES: Category[] = [
  {
    slug: "corporate",
    name: "Corporate",
    description: "Sharp, tailored trousers for the office and beyond.",
    href: "/shop",
    swatch: "#2f2f2f",
    // Kept deliberately: the client approved this photograph. Note it still
    // carries a stock-image watermark, so confirm the licence before the site
    // takes real orders.
    image: "/images/category-corporate.jpg",
  },
  {
    slug: "casual",
    name: "Casual",
    description: "Relaxed, elevated pants for the weekend.",
    href: "/shop",
    swatch: "#b4551f",
    image: "/images/category-casual.jpg",
  },
];
