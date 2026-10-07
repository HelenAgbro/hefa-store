import { NextResponse } from "next/server";
import { getApiSession } from "@/lib/api-auth";
import { getOrdersForUser } from "@/lib/orders/repository";

/**
 * The signed-in customer's order history.
 *
 *   GET /api/orders   ->  { orders: [...] }
 *
 * The website's /account/orders page still renders sample data, so this is the
 * first place real order history is actually served. It goes through
 * getOrdersForUser(), which reads the same orders table the checkout wrote to.
 *
 * Ownership is not taken from the request — it comes from the session. A caller
 * cannot ask for someone else's orders because there is no field in which to
 * name them; the id is whatever the bearer token (or cookie) resolves to.
 */

export const dynamic = "force-dynamic";

export async function GET() {
  const session = await getApiSession();

  if (!session) {
    return NextResponse.json({ error: "Please sign in to see your orders." }, { status: 401 });
  }

  try {
    const orders = await getOrdersForUser(session.user.id);
    return NextResponse.json({ orders });
  } catch (error) {
    console.error("[api/orders] Could not load orders:", error);
    return NextResponse.json({ error: "We could not load your orders." }, { status: 500 });
  }
}
