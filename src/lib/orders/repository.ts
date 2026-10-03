import type { CartLine } from "@/lib/cart";
import { SHIPPING_METHODS, getShippingCost, type CheckoutValues } from "@/lib/checkout";
import { getServiceClient } from "@/lib/supabase/service";
import type { Order, OrderItem, OrderStatus } from "@/lib/types";

/**
 * Order data access.
 *
 * ---------------------------------------------------------------------------
 * THE MOST IMPORTANT RULE IN THIS FILE
 * ---------------------------------------------------------------------------
 * The cart lives in the customer's browser (localStorage). That means the prices,
 * quantities and totals sent to us can be edited by hand. **Never trust them.**
 *
 * priceCart() therefore re-reads every product from the database and rebuilds the
 * totals from scratch. The amount charged is always the figure in the products
 * table, never the figure the browser asked for.
 *
 * ---------------------------------------------------------------------------
 * WHY THE SERVICE-ROLE CLIENT
 * ---------------------------------------------------------------------------
 * Orders are written with the service-role key, which bypasses RLS. The database
 * intentionally grants the browser read-only access, so a guest — who has no
 * session — can still have an order recorded for them.
 *
 * Reading a customer's own history goes through here too, for simplicity, but the
 * RLS policies mean a customer can only ever see their own rows. All of it runs
 * on the server: nothing in this file is callable from the browser.
 */

/** An expected failure, safe to show the customer verbatim. */
export class OrderError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "OrderError";
  }
}

const ORDER_COLUMNS =
  "id, reference, user_id, email, phone, status, subtotal, shipping, total, currency, " +
  "shipping_method, shipping_label, address1, address2, city, region, postal_code, " +
  "country, payment_reference, paid_at, created_at";

const ITEM_COLUMNS =
  "order_id, product_id, product_name, product_slug, color, size, quantity, unit_price, line_total";

/** A priced order, before anything is written to the database. */
export interface PricedOrder {
  items: OrderItem[];
  /** All money is whole Naira. */
  subtotal: number;
  shipping: number;
  total: number;
  shippingMethod: string;
  shippingLabel: string;
}

export interface CreateOrderInput {
  /** Cart lines straight from the browser — re-priced here, never trusted. */
  lines: CartLine[];
  values: CheckoutValues;
  /** The signed-in customer's id, or null/undefined for a guest. */
  userId?: string | null;
}

export interface MarkPaidResult {
  order: Order | null;
  /**
   * True only the first time an order moves to 'paid'. Paystack retries
   * webhooks for 72 hours, so this flag is what stops one purchase from sending
   * three confirmation emails.
   */
  newlyPaid: boolean;
}

// ---------------------------------------------------------------------------
// Mapping
// ---------------------------------------------------------------------------

/**
 * Casting Supabase rows.
 *
 * supabase-js infers a narrow union for `data` (it cannot know the row shape at
 * compile time), so rows are widened through `unknown` before being handed to
 * our mappers. Every cast below is `as unknown as`, never a direct assertion.
 */
type Row = Record<string, unknown>;

function rowToOrder(row: Row, items: OrderItem[]): Order {
  return {
    id: String(row.id),
    reference: String(row.reference),
    userId: row.user_id ? String(row.user_id) : null,
    email: String(row.email),
    phone: String(row.phone),
    status: String(row.status) as OrderStatus,
    subtotal: Number(row.subtotal),
    shipping: Number(row.shipping),
    total: Number(row.total),
    currency: String(row.currency ?? "NGN"),
    shippingMethod: String(row.shipping_method),
    shippingLabel: String(row.shipping_label ?? ""),
    address1: String(row.address1),
    address2: row.address2 ? String(row.address2) : null,
    city: String(row.city),
    region: String(row.region),
    postalCode: String(row.postal_code ?? ""),
    country: String(row.country),
    paymentReference: row.payment_reference ? String(row.payment_reference) : null,
    paidAt: row.paid_at ? String(row.paid_at) : null,
    createdAt: String(row.created_at),
    items,
  };
}

function rowToItem(row: Row): OrderItem {
  return {
    productId: String(row.product_id),
    productName: String(row.product_name),
    productSlug: String(row.product_slug),
    color: String(row.color ?? ""),
    size: String(row.size ?? ""),
    quantity: Number(row.quantity),
    unitPrice: Number(row.unit_price),
    lineTotal: Number(row.line_total),
  };
}
// ---------------------------------------------------------------------------
// Pricing
// ---------------------------------------------------------------------------

/**
 * Rebuild the whole order from database prices.
 *
 * Throws OrderError when something is genuinely wrong with the cart (empty, a
 * product that no longer exists, or an item that is out of stock) — those
 * messages can be shown to the customer as-is.
 */
export async function priceCart(lines: CartLine[], shippingMethodId: string): Promise<PricedOrder> {
  if (lines.length === 0) throw new OrderError("Your cart is empty.");

  // Read prices straight from the database rather than the in-memory catalogue
  // cache, so a charge can never be based on a stale figure.
  const supabase = getServiceClient();
  const productIds = [...new Set(lines.map((line) => line.productId))];

  const { data, error } = await supabase
    .from("products")
    .select("id, name, slug, price, in_stock")
    .in("id", productIds);

  if (error) {
    throw new Error(`[orders] Could not load product prices: ${error.message}`);
  }

  const products = new Map(
    (data ?? []).map((row) => [String(row.id), row as unknown as Row]),
  );

  const items: OrderItem[] = lines.map((line) => {
    const product = products.get(line.productId);

    if (!product) {
      throw new OrderError("An item in your cart is no longer available. Please review your cart.");
    }
    if (!product.in_stock) {
      throw new OrderError(`${String(product.name)} has sold out. Please remove it to continue.`);
    }

    const quantity = Math.max(1, Math.floor(Number(line.quantity) || 1));
    // The price comes from the database — never from the cart line.
    const unitPrice = Number(product.price);

    return {
      productId: String(product.id),
      productName: String(product.name),
      productSlug: String(product.slug),
      color: String(line.color ?? ""),
      size: String(line.size ?? ""),
      quantity,
      unitPrice,
      lineTotal: unitPrice * quantity,
    };
  });

  const subtotal = items.reduce((sum, item) => sum + item.lineTotal, 0);
  const shippingMethod = SHIPPING_METHODS.find((method) => method.id === shippingMethodId);
  // An unrecognised method falls back to standard pricing rather than free shipping.
  const shipping = shippingMethod
    ? getShippingCost(shippingMethod.id, subtotal)
    : getShippingCost("standard", subtotal);

  return {
    items,
    subtotal,
    shipping,
    total: subtotal + shipping,
    shippingMethod: shippingMethod ? shippingMethod.id : "standard",
    shippingLabel: shippingMethod ? shippingMethod.label : "Standard delivery",
  };
}

// ---------------------------------------------------------------------------
// Writing orders
// ---------------------------------------------------------------------------

/** A short reference the customer can quote, e.g. "HEFA-1042". */
function newReference(): string {
  return `HEFA-${Math.floor(1000 + Math.random() * 9000)}`;
}

/**
 * Create a 'pending' order. Called at checkout *before* redirecting to Paystack,
 * so there is always a row to attach the payment to.
 */
export async function createOrder({ lines, values, userId = null }: CreateOrderInput): Promise<Order> {
  const supabase = getServiceClient();
  const priced = await priceCart(lines, values.shippingMethod);

  // References are short and human-readable, so collisions are possible. Retry
  // rather than failing a real customer over a duplicate number.
  let orderRow: Row | null = null;

  for (let attempt = 0; attempt < 5 && !orderRow; attempt += 1) {
    const { data, error } = await supabase
      .from("orders")
      .insert({
        reference: newReference(),
        user_id: userId,
        email: values.email.trim(),
        phone: values.phone.trim(),
        status: "pending",
        subtotal: priced.subtotal,
        shipping: priced.shipping,
        total: priced.total,
        currency: "NGN",
        shipping_method: priced.shippingMethod,
        shipping_label: priced.shippingLabel,
        address1: values.address1.trim(),
        address2: values.address2?.trim() || null,
        city: values.city.trim(),
        region: values.region.trim(),
        postal_code: values.postalCode.trim(),
        country: values.country.trim(),
      })
      .select(ORDER_COLUMNS)
      .single();

    if (!error && data) {
      orderRow = data as unknown as Row;
      break;
    }

    // 23505 = unique violation: another request took this reference. Try again.
    if (error?.code === "23505") continue;

    throw new Error(`[orders] Could not create the order: ${error?.message ?? "unknown error"}`);
  }

  if (!orderRow) {
    throw new Error("[orders] Could not allocate an order reference. Please try again.");
  }

  const { error: itemError } = await supabase.from("order_items").insert(
    priced.items.map((item) => ({
      order_id: orderRow!.id,
      product_id: item.productId,
      product_name: item.productName,
      product_slug: item.productSlug,
      color: item.color,
      size: item.size,
      quantity: item.quantity,
      unit_price: item.unitPrice,
      line_total: item.lineTotal,
    })),
  );

  if (itemError) {
    // Never leave a half-written order behind: drop the empty parent row.
    await supabase.from("orders").delete().eq("id", orderRow.id);
    throw new Error(`[orders] Could not save the order items: ${itemError.message}`);
  }

  return rowToOrder(orderRow, priced.items);
}

/**
 * Move an order from 'pending' to 'paid'. Called by the Paystack webhook.
 *
 * Safe to call repeatedly: the update only matches rows still awaiting payment,
 * so a webhook retry reports newlyPaid: false and cannot send a second email.
 */
export async function markPaid(reference: string, paymentReference: string): Promise<MarkPaidResult> {
  const supabase = getServiceClient();

  const { data, error } = await supabase
    .from("orders")
    .update({
      status: "paid",
      payment_reference: paymentReference,
      paid_at: new Date().toISOString(),
    })
    .eq("reference", reference)
    .eq("status", "pending")
    .select(ORDER_COLUMNS)
    .maybeSingle();

  if (error) {
    throw new Error(`[orders] Could not mark order ${reference} as paid: ${error.message}`);
  }

  const newlyPaid = Boolean(data);

  // Read the full order either way: on a repeat webhook the update above matched
  // nothing, but the caller still wants to know the order exists.
  const order = await getOrderByReference(reference);
  return { order, newlyPaid };
}

// ---------------------------------------------------------------------------
// Reading orders
// ---------------------------------------------------------------------------

/** Fetch the line items belonging to a set of orders, grouped by order id. */
async function loadItems(orderIds: string[]): Promise<Map<string, OrderItem[]>> {
  if (orderIds.length === 0) return new Map();

  const supabase = getServiceClient();
  const { data, error } = await supabase
    .from("order_items")
    .select(ITEM_COLUMNS)
    .in("order_id", orderIds);

  if (error) {
    throw new Error(`[orders] Could not load order items: ${error.message}`);
  }

  const grouped = new Map<string, OrderItem[]>();
  for (const row of data ?? []) {
    const record = row as unknown as Row;
    const orderId = String(record.order_id);
    const list = grouped.get(orderId) ?? [];
    list.push(rowToItem(record));
    grouped.set(orderId, list);
  }

  return grouped;
}

/**
 * One order by its customer-facing reference.
 *
 * Deliberately not filtered by user, because the confirmation page needs it for
 * guests who have no session.
 *
 * The reference is a four-digit number and is NOT a secret: it is short enough to
 * guess, so this function must never be reachable straight from a public URL.
 * The confirmation page therefore requires a signed access token as well — see
 * src/lib/orders/access-token.ts — and shows the same not-found answer for a bad
 * token as for a reference that does not exist, so it cannot be used to discover
 * which references are real.
 *
 * Server-side callers (the Paystack webhook, markPaid) are already trusted and
 * do not need a token.
 */
export async function getOrderByReference(reference: string): Promise<Order | null> {
  const supabase = getServiceClient();

  const { data, error } = await supabase
    .from("orders")
    .select(ORDER_COLUMNS)
    .eq("reference", reference.trim())
    .maybeSingle();

  if (error) {
    throw new Error(`[orders] Could not load order: ${error.message}`);
  }
  if (!data) return null;

  const row = data as unknown as Row;
  const items = await loadItems([String(row.id)]);

  return rowToOrder(row, items.get(String(row.id)) ?? []);
}

/** A customer's order history, newest first. */
export async function getOrdersForUser(userId: string): Promise<Order[]> {
  if (!userId) return [];

  const supabase = getServiceClient();
  const { data, error } = await supabase
    .from("orders")
    .select(ORDER_COLUMNS)
    .eq("user_id", userId)
    .order("created_at", { ascending: false })
    .limit(100);

  if (error) {
    throw new Error(`[orders] Could not load order history: ${error.message}`);
  }

  const rows = (data ?? []) as unknown as Row[];
  const items = await loadItems(rows.map((row) => String(row.id)));

  return rows.map((row) => rowToOrder(row, items.get(String(row.id)) ?? []));
}