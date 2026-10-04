import { NextResponse, type NextRequest } from "next/server";
import { getApiSession } from "@/lib/api-auth";
import { CartError, removeCartItem, updateCartItem } from "@/lib/cart-server";

/**
 * One line in the cart.
 *
 *   PATCH  /api/cart/items/[id]   { quantity }  — change or, at 0, remove
 *   DELETE /api/cart/items/[id]                 — remove
 *
 * Both scope their query by user_id as well as by id. That is what stops a
 * customer who guessed or leaked another line's id from altering it: the row
 * simply does not match, and the request falls through to an ordinary response
 * rather than touching someone else's bag.
 *
 * A quantity of 0 is treated as a removal, so a client can shrink a line away
 * without having to know which verb it wants first.
 */

export const dynamic = "force-dynamic";

/** Next.js 16 hands route params in as a promise. */
type RouteContext = { params: Promise<{ id: string }> };

export async function PATCH(request: NextRequest, context: RouteContext) {
  const session = await getApiSession();

  if (!session) {
    return NextResponse.json({ error: "Please sign in to change your bag." }, { status: 401 });
  }

  const { id } = await context.params;

  let body: Record<string, unknown>;
  try {
    body = (await request.json()) as Record<string, unknown>;
  } catch {
    return NextResponse.json({ error: "That request was not understood." }, { status: 400 });
  }

  const quantity = Number(body.quantity);

  if (!Number.isFinite(quantity)) {
    return NextResponse.json({ error: "That quantity was not understood." }, { status: 400 });
  }

  try {
    return NextResponse.json(
      await updateCartItem(session.supabase, session.user.id, id, quantity),
    );
  } catch (error) {
    if (error instanceof CartError) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }
    console.error("[api/cart/items] Could not change a line:", error);
    return NextResponse.json(
      { error: "We could not change that item. Please try again." },
      { status: 500 },
    );
  }
}

export async function DELETE(_request: NextRequest, context: RouteContext) {
  const session = await getApiSession();

  if (!session) {
    return NextResponse.json({ error: "Please sign in to change your bag." }, { status: 401 });
  }

  const { id } = await context.params;

  try {
    return NextResponse.json(await removeCartItem(session.supabase, session.user.id, id));
  } catch (error) {
    if (error instanceof CartError) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }
    console.error("[api/cart/items] Could not remove a line:", error);
    return NextResponse.json(
      { error: "We could not remove that item. Please try again." },
      { status: 500 },
    );
  }
}