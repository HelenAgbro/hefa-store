/**
 * TEMPORARY account data.
 *
 * Stands in for a real backend. Order history here is sample data for the
 * layouts — the live version is read from the orders table via
 * src/lib/orders/repository.ts.
 */

export interface OrderLine {
  name: string;
  quantity: number;
}

/**
 * The capitalised label shown on a status pill.
 *
 * Distinct from OrderStatus in @/lib/types, which holds the raw lowercase values
 * stored in the database.
 */
export type OrderDisplayStatus = "Processing" | "Shipped" | "Delivered";

export interface AccountOrder {
  id: string;
  reference: string;
  date: string;
  status: OrderDisplayStatus;
  /** Total in Naira. */
  total: number;
  items: OrderLine[];
}

export const ACCOUNT_ORDERS: AccountOrder[] = [
  {
    id: "ord-1001",
    reference: "HEFA-1001",
    date: "12 Sep 2025",
    status: "Delivered",
    total: 126000,
    items: [
      { name: "Adeola Tailored Trouser", quantity: 1 },
      { name: "Amara High-Waist Pant", quantity: 1 },
    ],
  },
  {
    id: "ord-1002",
    reference: "HEFA-1002",
    date: "28 Sep 2025",
    status: "Shipped",
    total: 74000,
    items: [{ name: "Ngozi Wide-Leg Pant", quantity: 1 }],
  },
  {
    id: "ord-1003",
    reference: "HEFA-1003",
    date: "03 Oct 2025",
    status: "Processing",
    total: 130000,
    items: [
      { name: "Ìwé Pleated Trouser", quantity: 1 },
      { name: "Zara Cropped Pant", quantity: 1 },
    ],
  },
];

export interface AccountAddress {
  id: string;
  label: string;
  name: string;
  line1: string;
  line2?: string;
  city: string;
  region: string;
  country: string;
  phone: string;
  isDefault?: boolean;
}

export const ACCOUNT_ADDRESSES: AccountAddress[] = [
  {
    id: "addr-1",
    label: "Home",
    name: "Helen Agbro",
    line1: "12 Broad Street",
    line2: "Flat 3B",
    city: "Lagos",
    region: "Lagos",
    country: "Nigeria",
    phone: "+234 801 234 5678",
    isDefault: true,
  },
  {
    id: "addr-2",
    label: "Office",
    name: "Helen Agbro",
    line1: "4 Adeola Odeku Street",
    city: "Victoria Island",
    region: "Lagos",
    country: "Nigeria",
    phone: "+234 809 876 5432",
  },
];
