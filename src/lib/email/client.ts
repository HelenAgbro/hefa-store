import {
  RESEND_API_BASE,
  emailFrom,
  isEmailConfigured,
  resendApiKey,
} from "@/lib/supabase/config";

/**
 * Email transport — SERVER ONLY.
 *
 * Talks to Resend's REST API with `fetch` directly, for the same reason the
 * Paystack client does: it is a single HTTP call, and staying dependency-free
 * keeps the install footprint at nothing.
 *
 * This module only moves bytes. Deciding *what* to send lives in the templates
 * beside it, so adding a second email (a dispatch notice, say) needs no changes
 * here.
 */

/** A failure worth logging, as opposed to an unexpected crash. */
export class EmailError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "EmailError";
  }
}

export interface SendEmailInput {
  to: string;
  subject: string;
  html: string;
  text: string;
  /** Where a reply should go. Defaults to no reply-to header. */
  replyTo?: string;
}

export interface SendEmailResult {
  /** False when the send was skipped — callers treat this as non-fatal. */
  sent: boolean;
  /** Why nothing was sent, so a log line can explain it. */
  skippedReason?: string;
  /** Resend's message id, when it accepted the message. */
  id?: string;
}

/**
 * Send one email.
 *
 * Returns `{ sent: false }` rather than throwing when email is unconfigured, so
 * an order can still be recorded on a machine with no Resend key. Genuine API
 * failures do throw, and the caller decides whether that matters — for a receipt
 * it does not.
 */
export async function sendEmail(input: SendEmailInput): Promise<SendEmailResult> {
  if (!isEmailConfigured || !resendApiKey) {
    return { sent: false, skippedReason: "RESEND_API_KEY is not set" };
  }

  const response = await fetch(`${RESEND_API_BASE}/emails`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${resendApiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      from: emailFrom,
      to: [input.to],
      subject: input.subject,
      html: input.html,
      text: input.text,
      ...(input.replyTo ? { reply_to: input.replyTo } : {}),
    }),
    // Never let an email be served from, or stored in, a cache.
    cache: "no-store",
  });

  const payload = (await response.json().catch(() => null)) as
    | { id?: string; message?: string }
    | null;

  if (!response.ok) {
    throw new EmailError(payload?.message ?? `Resend returned HTTP ${response.status}.`);
  }

  return { sent: true, id: payload?.id };
}
