import { NextResponse, type NextRequest } from "next/server";
import { verifyOrderAccessToken } from "@/lib/orders/access-token";
import { getOrderByReference, markPaid } from "@/lib/orders/repository";
import { verifyTransaction } from "@/lib/paystack/client";

/**
 * Confirm a payment for the mobile app.
 *
 *   GET /api/orders/[reference]?token=...  ->  { status, order }
 *
 * Same checks as the website's /checkout/verify page: token first, then our
 * order, then Paystack's own record. Marks a verified order paid, exactly as
 * the page does, so paying on the phone and paying in the browser agree.
 */
export const dynamic = "force-dynamic";

type RouteContext = { params: Promise<{ reference: string }> };

export async function GET(request: NextRequest, context: RouteContext) {
  const { reference } = await context.params;
  const token = new URL(request.url).searchParams.get("token");

  if (!verifyOrderAccessToken(reference, token)) {
    return NextResponse.json({ error: "We could not find that order." }, { status: 404 });
  }

  let order;
  try {
    order = await getOrderByReference(reference);
  } catch (error) {
    console.error("[api/orders] Could not load the order:", error);
    return NextResponse.json({ error: "We could not load that order." }, { status: 500 });
  }
  if (!order) {
    return NextResponse.json({ error: "We could not find that order." }, { status: 404 });
  }

  let status: string;
  let chargedNaira: number;
  try {
    const transaction = await verifyTransaction(reference);
    status = transaction.status;
    chargedNaira = transaction.amountNaira;
  } catch (error) {
    console.error("[api/orders] Could not verify with Paystack:", error);
    return NextResponse.json({ status: "unknown", order }, { status: 200 });
  }

  if (status !== "success") {
    return NextResponse.json({ status, order }, { status: 200 });
  }

  if (chargedNaira !== order.total) {
    console.error(
      `[api/orders] Amount mismatch on ${reference}: expected ${order.total}, charged ${chargedNaira}.`,
    );
    return NextResponse.json(
      { status: "mismatch", order, message: "The amount paid did not match. Contact us." },
      { status: 200 },
    );
  }

  try {
    const { order: paid } = await markPaid(reference, reference);
    return NextResponse.json({ status: "paid", order: paid ?? order }, { status: 200 });
  } catch (error) {
    console.error("[api/orders] Could not mark order as paid:", error);
    return NextResponse.json({ status: "paid", order }, { status: 200 });
  }
}
