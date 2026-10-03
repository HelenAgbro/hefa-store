import type { Category } from "@/lib/types";

/** The two launch categories for the pants line. */
export const CATEGORIES: Category[] = [
  {
    slug: "corporate",
    name: "Corporate",
    description: "Sharp, tailored trousers for the office and beyond.",
    href: "/shop",
    swatch: "#2f2f2f",
    // NOTE: `public/images/category-corporate.png` was supplied for this slot
    // but is a blank 300x150 rectangle, so the navy pinstripe product shot
    // stands in until a real corporate photograph replaces it.
    image: "/images/products/adeola-tailored-trouser-1.jpg",
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
