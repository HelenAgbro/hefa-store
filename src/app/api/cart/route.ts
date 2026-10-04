import { NextResponse } from "next/server";
import { getApiSession } from "@/lib/api-auth";
import { CartError, clearCart, getCart } from "@/lib/cart-server";

/**
 * The signed-in customer's shared cart.
 *
 *   GET    /api/cart   read the cart, priced from the products table
 *   DELETE /api/cart   empty it
 *
 * ---------------------------------------------------------------------------
 * ONE ENDPOINT, TWO APPS
 * ---------------------------------------------------------------------------
 * The website reaches this over its own cookie session and the mobile app over
 * a bearer token; getApiSession() handles both and Row Level Security keeps each
 * caller inside their own cart. Neither client knows anything about how the
 * other authenticates, and neither could read another's data even if it tried.
 *
 * Guests get 401 rather than an empty cart. A guest's cart lives in that
 * device's localStorage and has no server row to read; the website treats it
 * as local, and the app does the same, so returning an empty array here would
 * look like the bag had been emptied somewhere else.
 */

export const dynamic = "force-dynamic";

export async function GET() {
  const session = await getApiSession();

  if (!session) {
    return NextResponse.json({ error: "Please sign in to see your bag." }, { status: 401 });
  }

  try {
    return NextResponse.json(await getCart(session.supabase, session.user.id));
  } catch (error) {
    console.error("[api/cart] Could not read the cart:", error);
    const message = error instanceof CartError ? error.message : "We could not read your bag.";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function DELETE() {
  const session = await getApiSession();

  if (!session) {
    return NextResponse.json({ error: "Please sign in to empty your bag." }, { status: 401 });
  }

  try {
    return NextResponse.json(await clearCart(session.supabase, session.user.id));
  } catch (error) {
    console.error("[api/cart] Could not clear the cart:", error);
    const message = error instanceof CartError ? error.message : "We could not empty your bag.";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}