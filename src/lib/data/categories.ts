import type { Category } from "@/lib/types";

/** The two launch categories for the pants line. */
export const CATEGORIES: Category[] = [
  {
    slug: "corporate",
    name: "Corporate",
    description: "Sharp, tailored trousers for the office and beyond.",
    href: "/shop",
    swatch: "#2f2f2f",
    // WARNING: this photograph still carries a visible stock-image watermark
    // and is not licensed for commercial use. Replace it with a HEFA-owned
    // shot before it reaches a real customer.
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
