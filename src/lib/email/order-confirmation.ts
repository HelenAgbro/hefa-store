import { BRAND } from "@/lib/constants";
import { sendEmail } from "@/lib/email/client";
import { formatNaira } from "@/lib/format";
import { isEmailConfigured } from "@/lib/supabase/config";
import type { Order } from "@/lib/types";

/**
 * The order confirmation ("receipt") email.
 *
 * Two rules shape this file:
 *
 *   1. It never throws. By the time it runs the payment is already confirmed, so
 *      a mail failure must not turn a successful purchase into an error page.
 *   2. It escapes everything the customer typed. The address comes from the
 *      checkout form, and left unescaped a crafted address could inject markup
 *      into the email, or into the studio's inbox.
 */

/** Escape the five characters that matter inside HTML. */
function esc(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

export interface ConfirmationResult {
  sent: boolean;
  skippedReason?: string;
}

/** Brand colours, mirroring globals.css so the email matches the site. */
const CREAM = "#f6f2ea";
const INK = "#0b0b0b";
const CHARCOAL = "#2f2f2f";
const BURNT_ORANGE = "#b4551f";

/** The full delivery address, one line per part, already escaped. */
function addressLines(order: Order): string[] {
  return [
    order.address1,
    order.address2 ?? "",
    `${order.city}, ${order.region}`,
    order.postalCode,
    order.country,
  ].filter((line) => line.trim().length > 0);
}

/**
 * Build the subject, HTML and plain-text forms of the receipt.
 *
 * Both bodies are produced because a text alternative is not optional: many
 * clients show it, and its absence is a strong spam signal.
 */
function build(order: Order): { subject: string; html: string; text: string } {
  const subject = `Your HEFA order ${order.reference} is confirmed`;

  const itemRows = order.items
    .map((item) => {
      const variant = [item.color, item.size].filter(Boolean).join(" · ");
      return `
              <tr>
                <td style="padding:10px 0;border-bottom:1px solid #e4ded2;color:${CHARCOAL};font-size:14px;">
                  ${esc(item.productName)}
                  <span style="color:#6b6b6b;">${variant ? ` — ${esc(variant)}` : ""}</span>
                  <span style="color:#6b6b6b;"> ×${item.quantity}</span>
                </td>
                <td align="right" style="padding:10px 0;border-bottom:1px solid #e4ded2;color:${INK};font-size:14px;white-space:nowrap;">
                  ${esc(formatNaira(item.lineTotal))}
                </td>
              </tr>`;
    })
    .join("");

  const shippingLine =
    order.shipping === 0 ? "Free" : esc(formatNaira(order.shipping));

  const html = `<!doctype html>
<html lang="en">
  <body style="margin:0;padding:0;background:${CREAM};">
    <div style="max-width:600px;margin:0 auto;padding:32px 20px;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Helvetica,Arial,sans-serif;">

      <p style="margin:0 0 24px;color:${BURNT_ORANGE};font-size:11px;letter-spacing:3px;text-transform:uppercase;">
        ${esc(BRAND.name)}
      </p>

      <div style="background:#ffffff;border:1px solid #e4ded2;padding:28px;">
        <h1 style="margin:0;color:${INK};font-size:24px;font-weight:500;">Thank you — your order is confirmed</h1>
        <p style="margin:12px 0 0;color:${CHARCOAL};font-size:14px;line-height:1.6;">
          We have received your payment and your order is now with our studio.
          Keep this email: your reference is how we find your order.
        </p>

        <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin:24px 0 0;border-top:1px solid #e4ded2;">
          <tr>
            <td style="padding:14px 0 0;color:#6b6b6b;font-size:11px;letter-spacing:2px;text-transform:uppercase;">Reference</td>
            <td align="right" style="padding:14px 0 0;color:${INK};font-size:14px;font-weight:600;">${esc(order.reference)}</td>
          </tr>
          <tr>
            <td style="padding:10px 0 0;color:#6b6b6b;font-size:11px;letter-spacing:2px;text-transform:uppercase;">Status</td>
            <td align="right" style="padding:10px 0 0;color:${INK};font-size:14px;">Paid</td>
          </tr>
          <tr>
            <td style="padding:10px 0 0;color:#6b6b6b;font-size:11px;letter-spacing:2px;text-transform:uppercase;">Delivery</td>
            <td align="right" style="padding:10px 0 0;color:${INK};font-size:14px;">${esc(order.shippingLabel)}</td>
          </tr>
        </table>

        <h2 style="margin:28px 0 0;color:${INK};font-size:16px;font-weight:600;">Your items</h2>
        <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin:4px 0 0;">
          ${itemRows}
        </table>

        <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin:16px 0 0;">
          <tr>
            <td style="padding:6px 0;color:#6b6b6b;font-size:14px;">Subtotal</td>
            <td align="right" style="padding:6px 0;color:${INK};font-size:14px;">${esc(formatNaira(order.subtotal))}</td>
          </tr>
          <tr>
            <td style="padding:6px 0;color:#6b6b6b;font-size:14px;">Shipping</td>
            <td align="right" style="padding:6px 0;color:${INK};font-size:14px;">${shippingLine}</td>
          </tr>
          <tr>
            <td style="padding:10px 0 0;border-top:1px solid #e4ded2;color:${INK};font-size:15px;font-weight:600;">Total paid</td>
            <td align="right" style="padding:10px 0 0;border-top:1px solid #e4ded2;color:${INK};font-size:15px;font-weight:600;">${esc(formatNaira(order.total))}</td>
          </tr>
        </table>

        <h2 style="margin:28px 0 0;color:${INK};font-size:16px;font-weight:600;">Delivering to</h2>
        <p style="margin:8px 0 0;color:${CHARCOAL};font-size:14px;line-height:1.6;">
          ${addressLines(order).map((line) => esc(line)).join("<br />")}
        </p>
      </div>

      <p style="margin:20px 0 0;color:${CHARCOAL};font-size:12px;line-height:1.6;">
        Questions about this order? Reply to this email or write to
        <a href="mailto:${esc(BRAND.email)}" style="color:${BURNT_ORANGE};">${esc(BRAND.email)}</a>
        and quote <strong>${esc(order.reference)}</strong>.
      </p>
      <p style="margin:8px 0 0;color:#6b6b6b;font-size:12px;">
        ${esc(BRAND.name)} · ${esc(BRAND.location)}
      </p>
    </div>
  </body>
</html>`;

  const text = [
    `${BRAND.name} — order ${order.reference} confirmed`,
    "",
    "Thank you. We have received your payment and your order is now with our studio.",
    "",
    `Reference: ${order.reference}`,
    "Status:    Paid",
    `Delivery:  ${order.shippingLabel}`,
    "",
    "Your items",
    ...order.items.map((item) => {
      const variant = [item.color, item.size].filter(Boolean).join(" · ");
      return `  ${item.quantity} × ${item.productName}${variant ? ` (${variant})` : ""} — ${formatNaira(item.lineTotal)}`;
    }),
    "",
    `Subtotal:     ${formatNaira(order.subtotal)}`,
    `Shipping:     ${order.shipping === 0 ? "Free" : formatNaira(order.shipping)}`,
    `Total paid:   ${formatNaira(order.total)}`,
    "",
    "Delivering to",
    ...addressLines(order).map((line) => `  ${line}`),
    "",
    `Questions? Reply to this email or write to ${BRAND.email} and quote ${order.reference}.`,
    `${BRAND.name} · ${BRAND.location}`,
  ].join("\n");

  return { subject, html, text };
}

/**
 * Send the receipt for a confirmed order.
 *
 * Best-effort by design: the return value is for logging, never for deciding
 * whether the customer's payment succeeded. Callers should ignore a false
 * `sent` where the customer is concerned — the order is already recorded.
 */
export async function sendOrderConfirmation(order: Order): Promise<ConfirmationResult> {
  if (!isEmailConfigured) {
    return { sent: false, skippedReason: "RESEND_API_KEY is not set" };
  }

  try {
    const { subject, html, text } = build(order);
    const result = await sendEmail({
      to: order.email,
      subject,
      html,
      text,
      replyTo: BRAND.email,
    });

    return { sent: result.sent, skippedReason: result.skippedReason };
  } catch (error) {
    // Swallowed on purpose. A rejected send must never surface as a failed
    // payment, and the log line is what the studio acts on.
    console.error(`[email] Confirmation for ${order.reference} failed:`, error);
    return {
      sent: false,
      skippedReason: error instanceof Error ? error.message : "send failed",
    };
  }
}
