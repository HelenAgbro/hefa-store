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

/**
 * Where an order is in its life.
 *
 *   pending  — created at checkout, payment not yet confirmed
 *   paid     — Paystack confirmed the charge
 *   ...      — then progressed manually by the studio as it ships
 *
 * These are the raw database values (lowercase), unlike the capitalised labels
 * shown to the customer.
 */
export type OrderStatus =
  | "pending"
  | "paid"
  | "processing"
  | "shipped"
  | "delivered"
  | "cancelled"
  | "refunded";

export interface OrderItem {
  productId: string;
  /** Snapshotted at purchase time, so later catalogue edits never rewrite history. */
  productName: string;
  productSlug: string;
  color: string;
  size: string;
  quantity: number;
  /** Price per unit in whole Naira, at the time of purchase. */
  unitPrice: number;
  /** unitPrice × quantity. */
  lineTotal: number;
}

export interface Order {
  id: string;
  /** Short customer-facing reference, e.g. "HEFA-1042". */
  reference: string;
  /** Null for guest checkout. */
  userId: string | null;
  email: string;
  phone: string;
  status: OrderStatus;
  /** Money is whole Naira throughout, matching the products table. */
  subtotal: number;
  shipping: number;
  total: number;
  currency: string;
  shippingMethod: string;
  shippingLabel: string;
  address1: string;
  address2: string | null;
  city: string;
  region: string;
  postalCode: string;
  country: string;
  /** Paystack's reference. Null until payment succeeds. */
  paymentReference: string | null;
  paidAt: string | null;
  createdAt: string;
  items: OrderItem[];
}
