/**
 * Shared, site-wide content and configuration.
 *
 * Keeping this in one place means the brand details and navigation
 * can be updated once and reused by the Header, Footer and Mobile menu.
 */

export const BRAND = {
  name: "HEFA",
  tagline: "Modern Nigerian tailoring",
  description:
    "HEFA is a Nigerian designer label crafting premium tailored clothing for the modern wardrobe.",
  email: "hello@hefastore.com",
  phone: "+234 800 000 0000",
  whatsapp: "https://wa.me/2348000000000",
  instagram: "https://instagram.com",
  location: "Lagos, Nigeria",
} as const;

export const NAV_LINKS = [
  { label: "Shop", href: "/shop" },
  { label: "Lookbook", href: "/lookbook" },
  { label: "About", href: "/about" },
  { label: "Contact", href: "/contact" },
] as const;

export const FOOTER_LINKS = {
  shop: [
    { label: "All Pants", href: "/shop" },
    { label: "Corporate", href: "/shop" },
    { label: "Casual", href: "/shop" },
  ],
  help: [
    { label: "Size Guide", href: "/shop" },
    { label: "Shipping & Returns", href: "/shipping-returns" },
    { label: "FAQ", href: "/faq" },
  ],
  account: [
    { label: "Sign In", href: "/login" },
    { label: "My Account", href: "/account" },
    { label: "Cart", href: "/cart" },
  ],
} as const;
