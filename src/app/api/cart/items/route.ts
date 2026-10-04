import { NextResponse, type NextRequest } from "next/server";
import { getApiSession } from "@/lib/api-auth";
import { CartError, addToCart } from "@/lib/cart-server";

/**
 * Add a line to the cart.
 *
 *   POST /api/cart/items   { productId, color, size, quantity? }
 *
 * Always answers with the whole recalculated cart rather than a bare "ok".
 *
 * That shape is deliberate. Every response re-prices from the products table, so
 * returning the full cart means the caller never has to keep its own totals in
 * step with the server's — it renders what it is told. It is also what makes the
 * two apps agree: whichever device made the change, both end up showing the same
 * figures.
 *
 * Only ids, options and a quantity are accepted. A price in the body is ignored,
 * because a client could send whatever it liked and the server would have no way
 * to tell a real price from a forgery.
 */

export const dynamic = "force-dynamic";

export async function POST(request: NextRequest) {
  const session = await getApiSession();

  if (!session) {
    return NextResponse.json({ error: "Please sign in to add to your bag." }, { status: 401 });
  }

  let body: Record<string, unknown>;
  try {
    body = (await request.json()) as Record<string, unknown>;
  } catch {
    // A body that is not JSON is a client bug, not a server fault.
    return NextResponse.json({ error: "That request was not understood." }, { status: 400 });
  }

  try {
    const cart = await addToCart(session.supabase, session.user.id, {
      productId: String(body.productId ?? ""),
      color: typeof body.color === "string" ? body.color : undefined,
      size: typeof body.size === "string" ? body.size : undefined,
      quantity: typeof body.quantity === "number" ? body.quantity : undefined,
    });

    return NextResponse.json(cart, { status: 201 });
  } catch (error) {
    if (error instanceof CartError) {
      // An expected refusal — sold out, unknown product, bag full. These are
      // 400s rather than 500s: nothing is broken, the request simply cannot be
      // carried out, and the client shows the message to the customer.
      return NextResponse.json({ error: error.message }, { status: 400 });
    }

    console.error("[api/cart/items] Could not add to the cart:", error);
    return NextResponse.json(
      { error: "We could not add that item. Please try again." },
      { status: 500 },
    );
  }
}