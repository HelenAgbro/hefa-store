import type { SupabaseClient } from "@supabase/supabase-js";
import type { Product } from "@/lib/types";

/**
 * Server-side cart operations, shared by the API routes and the website.
 *
 * ---------------------------------------------------------------------------
 * THE ONE RULE
 * ---------------------------------------------------------------------------
 * Prices are never accepted from the caller. The cart_items table deliberately
 * stores no money (see supabase/cart.sql), so every figure below is re-read
 * from the products table here. A client that asks for a 68,000 naira trouser
 * gets the database's price, not the one it claimed — the same principle
 * priceCart() already applies at checkout.
 *
 * ---------------------------------------------------------------------------
 * WHY A SERVICE CLIENT IS NOT USED
 * ---------------------------------------------------------------------------
 * These functions take the caller's own Supabase client, so Row Level Security
 * applies. That is stricter than the service-role key, which bypasses every
 * policy and could read any customer's cart if a query were ever written
 * loosely. Least privilege by default.
 */

/** Guard rails on what a client may send. */
const MAX_QUANTITY = 10;
const MAX_LINES = 50;

/** One cart line as the database stores it. */
interface CartRow {
  id: string;
  product_id: string;
  color: string;
  size: string;
  quantity: number;
  updated_at: string;
}

/** A cart line as the clients receive it — priced, and joined to its product. */
export interface CartItemDto {
  id: string;
  productId: string;
  color: string;
  size: string;
  quantity: number;
  product: Product;
  lineTotal: number;
}

export interface CartDto {
  items: CartItemDto[];
  /** Sum of quantities — the number shown on the bag button. */
  totalItems: number;
  /** Sum of line totals, in whole Naira. */
  subtotal: number;
}

/** An expected failure, safe to show the customer verbatim. */
export class CartError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "CartError";
  }
}

const CART_COLUMNS = "id, product_id, color, size, quantity, updated_at";
const PRODUCT_COLUMNS =
  "id, slug, name, price, category, colors, sizes, description, details, swatch, images, featured, badge, in_stock";

function rowToProduct(row: Record<string, unknown>): Product {
  return {
    id: String(row.id),
    slug: String(row.slug),
    name: String(row.name),
    price: Number(row.price),
    category: row.category as Product["category"],
    colors: (row.colors as string[]) ?? [],
    sizes: (row.sizes as string[]) ?? [],
    description: String(row.description ?? ""),
    details: (row.details as string[]) ?? [],
    swatch: String(row.swatch ?? "#2f2f2f"),
    images: (row.images as string[]) ?? [],
    featured: Boolean(row.featured),
    badge: row.badge ? String(row.badge) : undefined,
    inStock: Boolean(row.in_stock),
  };
}

/**
 * Join cart lines to their products and price every line.
 *
 * Lines whose product has since been deleted, or marked out of stock, are
 * dropped rather than returned. A cart that cannot be bought should not look
 * buyable — the website would hide them anyway, and returning them would leave
 * the two clients disagreeing about what is in the bag.
 */
async function buildCart(supabase: SupabaseClient, userId: string): Promise<CartDto> {
  const { data, error } = await supabase
    .from("cart_items")
    .select(CART_COLUMNS)
    .eq("user_id", userId)
    .order("updated_at", { ascending: false });

  if (error) throw new CartError("We could not read your bag. Please try again.");
  if (!data || data.length === 0) return { items: [], totalItems: 0, subtotal: 0 };

  const rows = data as unknown as CartRow[];
  const productIds = [...new Set(rows.map((row) => row.product_id))];

  const { data: productData, error: productError } = await supabase
    .from("products")
    .select(PRODUCT_COLUMNS)
    .in("id", productIds);

  if (productError) throw new CartError("We could not load your bag. Please try again.");

  const products = new Map<string, Product>();
  for (const row of (productData ?? []) as unknown as Record<string, unknown>[]) {
    const product = rowToProduct(row);
    products.set(product.id, product);
  }

  const items: CartItemDto[] = [];
  for (const row of rows) {
    const product = products.get(row.product_id);
    if (!product || !product.inStock) continue;
    items.push({
      id: row.id,
      productId: row.product_id,
      color: row.color,
      size: row.size,
      quantity: row.quantity,
      product,
      lineTotal: product.price * row.quantity,
    });
  }

  return {
    items,
    totalItems: items.reduce((sum, item) => sum + item.quantity, 0),
    subtotal: items.reduce((sum, item) => sum + item.lineTotal, 0),
  };
}

/** The signed-in customer's priced cart. */
export async function getCart(supabase: SupabaseClient, userId: string): Promise<CartDto> {
  return buildCart(supabase, userId);
}

export interface AddToCartInput {
  productId: string;
  color?: string;
  size?: string;
  quantity?: number;
}

/**
 * Add a line, or top up one that already exists.
 *
 * The existing quantity is read BEFORE the write, not after. Doing it the other
 * way round would be a real bug: the upsert replaces the row, so reading
 * afterwards would only ever see the value just written, and every repeat add
 * would top up from 1 instead of from what was already in the bag.
 */
export async function addToCart(
  supabase: SupabaseClient,
  userId: string,
  input: AddToCartInput,
): Promise<CartDto> {
  const productId = String(input.productId ?? "").trim();
  if (!productId) throw new CartError("No product was given.");

  const requested = Math.min(
    MAX_QUANTITY,
    Math.max(1, Math.round(Number(input.quantity ?? 1) || 1)),
  );
  const color = String(input.color ?? "").trim();
  const size = String(input.size ?? "").trim();

  // Reject an unknown or sold-out product before writing. The client could
  // otherwise fill the bag with junk rows, which would then need filtering out
  // forever.
  const { data: product, error: productError } = await supabase
    .from("products")
    .select("id, in_stock")
    .eq("id", productId)
    .maybeSingle();

  if (productError) throw new CartError("We could not add that item. Please try again.");
  if (!product) throw new CartError("That item is no longer available.");
  if (!product.in_stock) throw new CartError("That item is sold out.");

  const { data: existing } = await supabase
    .from("cart_items")
    .select("quantity")
    .eq("user_id", userId)
    .eq("product_id", productId)
    .eq("color", color)
    .eq("size", size)
    .maybeSingle();

  // A brand new line still has to respect the line ceiling.
  if (!existing) {
    const { count } = await supabase
      .from("cart_items")
      .select("id", { count: "exact", head: true })
      .eq("user_id", userId);

    if ((count ?? 0) >= MAX_LINES) {
      throw new CartError("Your bag is full. Remove an item to add another.");
    }
  }

  const quantity = Math.min(MAX_QUANTITY, (existing?.quantity ?? 0) + requested);

  const { error } = await supabase.from("cart_items").upsert(
    {
      user_id: userId,
      product_id: productId,
      color,
      size,
      quantity,
      updated_at: new Date().toISOString(),
    },
    { onConflict: "user_id,product_id,color,size" },
  );

  if (error) throw new CartError("We could not add that item. Please try again.");

  return buildCart(supabase, userId);
}

/** Change a line's quantity. Quantity 0 or less removes the line. */
export async function updateCartItem(
  supabase: SupabaseClient,
  userId: string,
  lineId: string,
  quantity: number,
): Promise<CartDto> {
  const wanted = Math.round(Number(quantity) || 0);

  if (wanted <= 0) {
    return removeCartItem(supabase, userId, lineId);
  }

  const { error } = await supabase
    .from("cart_items")
    .update({ quantity: Math.min(MAX_QUANTITY, wanted), updated_at: new Date().toISOString() })
    .eq("id", lineId)
    .eq("user_id", userId);

  if (error) throw new CartError("We could not change that item.");

  return buildCart(supabase, userId);
}

/** Remove one line. Scoped by user_id, so a guessed id cannot reach a stranger's cart. */
export async function removeCartItem(
  supabase: SupabaseClient,
  userId: string,
  lineId: string,
): Promise<CartDto> {
  const { error } = await supabase
    .from("cart_items")
    .delete()
    .eq("id", lineId)
    .eq("user_id", userId);

  if (error) throw new CartError("We could not remove that item.");
  return buildCart(supabase, userId);
}

/** Empty the cart. */
export async function clearCart(supabase: SupabaseClient, userId: string): Promise<CartDto> {
  const { error } = await supabase.from("cart_items").delete().eq("user_id", userId);
  if (error) throw new CartError("We could not empty your bag.");
  return { items: [], totalItems: 0, subtotal: 0 };
}

/**
 * Merge a guest's local cart into the signed-in one, on sign-in.
 *
 * Each line's quantity is the sum of both carts, capped at the ceiling, so
 * signing in on a second device adds to what was already there rather than
 * silently replacing it.
 */
export async function mergeGuestCart(
  supabase: SupabaseClient,
  userId: string,
  guestLines: { productId: string; color?: string; size?: string; quantity?: number }[],
): Promise<CartDto> {
  for (const line of guestLines.slice(0, MAX_LINES)) {
    try {
      await addToCart(supabase, userId, {
        productId: line.productId,
        color: line.color,
        size: line.size,
        quantity: line.quantity,
      });
    } catch (error) {
      // One bad line must not abandon the rest of the merge. It is dropped and
      // the others still come across.
      console.warn("[cart] Skipped a guest line during merge:", error);
    }
  }

  return buildCart(supabase, userId);
}