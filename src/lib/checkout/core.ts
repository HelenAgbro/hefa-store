import type { CartLine } from "@/lib/cart";
import {
  INITIAL_CHECKOUT_VALUES,
  validateCheckout,
  type CheckoutErrors,
  type CheckoutValues,
} from "@/lib/checkout";

/**
 * Checkout submission core, shared by the website form and the mobile API.
 *
 * The website's Server Action (src/lib/checkout/actions.ts) and the mobile
 * JSON route (src/app/api/checkout/route.ts) both translate their input into
 * the shape below and call startCheckoutCore(). One flow, two doors — a fix
 * to pricing or validation reaches both callers.
 */

export interface CheckoutState {
  error: string | null;
  fieldErrors?: CheckoutErrors;
}

export interface StartedCheckout {
  authorizationUrl: string;
  reference: string;
  token: string;
  total: number;
}

export const MAX_CART_LINES = 50;
export const MAX_QUANTITY_PER_LINE = 10;

export function parseCheckoutValues(source: Record<string, unknown>): CheckoutValues {
  const values = source as Partial<Record<keyof CheckoutValues, unknown>>;
  const read = (key: keyof CheckoutValues) => String(values[key] ?? "").trim();
  return {
    firstName: read("firstName"),
    lastName: read("lastName"),
    email: read("email"),
    phone: read("phone"),
    address1: read("address1"),
    address2: read("address2"),
    city: read("city"),
    region: read("region"),
    postalCode: read("postalCode"),
    country: read("country"),
    shippingMethod: read("shippingMethod") || INITIAL_CHECKOUT_VALUES.shippingMethod,
  };
}

export function parseCartLines(raw: unknown): CartLine[] | null {
  let parsed: unknown = raw;
  if (typeof raw === "string") {
    if (raw.length === 0) return null;
    try {
      parsed = JSON.parse(raw);
    } catch {
      return null;
    }
  }
  if (!Array.isArray(parsed) || parsed.length === 0 || parsed.length > MAX_CART_LINES) {
    return null;
  }
  const lines: CartLine[] = [];
  for (const entry of parsed) {
    if (typeof entry !== "object" || entry === null) return null;
    const candidate = entry as Record<string, unknown>;
    const productId = typeof candidate.productId === "string" ? candidate.productId : "";
    if (!productId) return null;
    lines.push({
      id: `${productId}::${String(candidate.color ?? "")}::${String(candidate.size ?? "")}`,
      productId,
      color: String(candidate.color ?? ""),
      size: String(candidate.size ?? ""),
      quantity: Math.min(
        MAX_QUANTITY_PER_LINE,
        Math.max(1, Math.floor(Number(candidate.quantity) || 1)),
      ),
    });
  }
  return lines;
}

export class CheckoutError extends Error {
  readonly fieldErrors?: CheckoutErrors;
  constructor(message: string, fieldErrors?: CheckoutErrors) {
    super(message);
    this.name = "CheckoutError";
    this.fieldErrors = fieldErrors;
  }
}

export async function startCheckoutCore(input: {
  values: CheckoutValues;
  lines: CartLine[] | null;
  userId: string | null;
  callbackUrl: string;
  createOrder: (args: {
    lines: CartLine[];
    values: CheckoutValues;
    userId: string | null;
  }) => Promise<{ reference: string; total: number; email: string; phone: string }>;
  initializeTransaction: (args: {
    reference: string;
    amount: number;
    email: string;
    firstName?: string;
    lastName?: string;
    phone?: string;
    callbackUrl: string;
  }) => Promise<{ authorization_url: string }>;
  createAccessToken: (reference: string) => string;
  paystackConfigured: boolean;
}): Promise<StartedCheckout> {
  if (!input.paystackConfigured) {
    throw new CheckoutError("Payments are not set up yet. Please contact us to place an order.");
  }
  const fieldErrors = validateCheckout(input.values);
  if (Object.keys(fieldErrors).length > 0) {
    throw new CheckoutError("Please correct the highlighted fields.", fieldErrors);
  }
  if (!input.lines) {
    throw new CheckoutError("We could not read your cart. Please refresh the page and try again.");
  }
  const order = await input.createOrder({
    lines: input.lines,
    values: input.values,
    userId: input.userId,
  });
  const token = input.createAccessToken(order.reference);
  const callbackUrl = input.callbackUrl
    .replace("{reference}", encodeURIComponent(order.reference))
    .replace("{token}", token);
  const transaction = await input.initializeTransaction({
    reference: order.reference,
    amount: order.total,
    email: order.email,
    firstName: input.values.firstName,
    lastName: input.values.lastName,
    phone: order.phone,
    callbackUrl,
  });
  return {
    authorizationUrl: transaction.authorization_url,
    reference: order.reference,
    token,
    total: order.total,
  };
}
