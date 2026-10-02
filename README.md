# HEFA — Modern Nigerian Tailoring

A premium Nigerian designer label storefront, built with **Next.js 16 (App Router)**, **TypeScript** and **Tailwind CSS v4**.

Design direction: *Modern Afro-Minimalism* — luxury neutrals (black, cream, charcoal) with earth-tone accents (burnt orange, deep ochre, forest green), serif headings and clean sans-serif body copy.

## Getting started

```bash
npm install
npm run dev     # start the dev server at http://localhost:3000
npm run build   # production build
npm run start   # serve the production build
npm run lint    # code quality checks
```

## Project layout

```
src/
  app/           routes (pages) — file-based routing
  components/    reusable UI (ui, layout, product, cart, checkout, home, account, auth, shop, contact)
  context/       CartProvider + useCart (shared cart state)
  lib/           data (local, temporary), helpers and validation logic
public/          static assets
```

## Product photography

Every product points at real photography in `public/images/products/`, named after
its own slug — `adeola-tailored-trouser-1.jpg`, `ngozi-wide-leg-pant-2.jpg`, etc.

**1. Save new files** in `public/images/products/`, keeping that `<slug>-<n>.jpg` naming.

**2. Reference them** on the product by editing its `images` array:

```ts
{
  slug: "adeola-tailored-trouser",
  images: [
    "/images/products/adeola-tailored-trouser-1.jpg",
    "/images/products/adeola-tailored-trouser-2.jpg",
  ],
}
```

That single change updates the **shop grid, homepage featured section, product page gallery, mini-cart, cart page and checkout summary**.

> **Note:** the live catalogue is read from Supabase, so the database is what visitors
> actually see. After editing `src/lib/data/products.ts`, re-run `supabase/schema.sql`
> in the Supabase SQL editor to sync the change. `src/lib/data/products.ts` is the
> offline fallback and the two are kept in sync deliberately.

### Recommendations

| Setting | Recommendation |
|---------|----------------|
| Images per product | 3 (front, side, detail) |
| Aspect ratio | Portrait **4:5** (e.g. 1200 x 1500 px) |
| Format | `.jpg` or `.webp` |
| File size | Under ~500 KB each |
| Background | Plain and uncluttered (the layout crops to 4:5) |

### Campaign / lookbook photos

Optional. Add an `image` field to any entry in `src/lib/data/lookbook.ts`:

```ts
{ id: "lb-1", title: "Lagos Mornings", swatch: "#2f2f2f", image: "/images/lookbook/lagos-mornings-1.jpg" }
```

### Using a CDN instead (Cloudinary, S3, etc.)

Point the paths at your full URLs — remote images are handled automatically:

```ts
images: ["https://res.cloudinary.com/.../adeola-1.jpg"]
```

## Orders

The `orders` and `order_items` tables are defined in **`supabase/orders.sql`** — run that
file in the Supabase SQL editor to create them. It is separate from `schema.sql` so that a
pricing change never forces a catalogue re-seed.

Orders are **never written from the browser**. The cart lives in `localStorage`, so its
prices and totals can be edited by hand, and the database policies deliberately refuse
client writes. Instead:

1. **`priceCart()`** (`src/lib/orders/repository.ts`) re-reads every product from the
   `products` table and rebuilds the totals from scratch, including the ₦150,000
   free-shipping rule. The amount charged is always the database figure.
2. **`createOrder()`** writes a `pending` order using the **service-role key** — that is
   what lets a guest, who has no signed-in session, still place an order.
3. **`markPaid()`** moves it to `paid` when Paystack's webhook arrives. The update only
   matches rows still `pending`, so Paystack's 72 hours of retries cannot double-mark an
   order or re-send a confirmation email.

Product name, slug and unit price are **snapshotted** onto `order_items`, so editing a
price later never rewrites what a customer actually paid.

### Required environment variable

```bash
# Supabase → Project Settings → API Keys → the service_role key
SUPABASE_SERVICE_ROLE_KEY=sb_secret_...
```

It must **not** have a `NEXT_PUBLIC_` prefix — that would inline it into the JavaScript
bundle and hand it to every visitor. `.env.example` lists it as a placeholder; the real
value only ever belongs in `.env.local`.

Without it, `getServiceClient()` throws a message explaining this rather than failing
somewhere obscure.

## Taking payments (Paystack)

Checkout is live and takes payment through **Paystack**. Four pieces:

| File | Role |
|------|------|
| `src/lib/checkout/actions.ts` | Prices the cart, saves a `pending` order, redirects to Paystack |
| `src/lib/paystack/client.ts` | Server-only REST calls + webhook signature verification |
| `src/app/checkout/verify/page.tsx` | Where the customer returns; confirms with Paystack |
| `src/app/api/webhooks/paystack/route.ts` | Authoritative "payment succeeded" signal |

### Required environment variables

```bash
PAYSTACK_SECRET_KEY=sk_test_...        # server only — signs calls and verifies webhooks
NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY=pk_test_...
```

Get them from **Paystack → Settings → API Keys & Webhooks** with **Test mode ON**. Test
keys move no real money. **Rotate the secret key before going live** if it has ever been
shared — a leaked `sk_` key lets anyone issue refunds against the account.

### Two independent checks confirm a payment

This is deliberate, and it is the most important part of the integration:

1. **The return page** asks Paystack directly whether the transaction succeeded, and
   compares the amount charged against the amount we expected. A mismatch is never
   confirmed. The redirect itself proves nothing — anyone can visit that URL.
2. **The webhook** is an outbound request from Paystack to us, verified with an HMAC-SHA512
   signature of the raw request body. Without this check, anyone who guessed the webhook
   URL could mark orders paid for free.

Both call the same idempotent `markPaid()`, so running twice changes nothing and Paystack's
72 hours of retries cannot re-send an email.

### Testing locally

Card payments work against `localhost` with **no setup**:

| Card | Outcome |
|------|---------|
| `4084 0840 8408 4081`, CVV `408` | ✅ succeeds |
| `4084 0800 0000 5408`, CVV `001` | ❌ declined |
| `4084 0800 0067 0037`, CVV `787` | ❌ insufficient funds |
| `5060 6666 6666 6666 666` | ✅ PIN `1234`, OTP `123456` |

Expiry can be any future date. The fallback on the return page means orders are still
marked paid without a webhook.

**Webhooks do need a public URL**, because Paystack cannot reach `localhost`:

```bash
brew install cloudflared
cloudflared tunnel --url http://localhost:3000
```

Paste the resulting `https://….trycloudflare.com` URL into
**Paystack → Settings → API Keys & Webhooks → Webhook URL**. The tunnel URL changes every
time you restart it, so the dashboard needs updating each session. Note that in test mode
Paystack only sends webhooks hourly, so do not wait on it — the return page covers you.

Card details are never handled by this site. They are entered on Paystack's page and only
the resulting reference comes back to us.

## Current status

- Product catalogue is **live** in Supabase; `src/lib/data/products.ts` is the offline fallback.
- **Authentication works** — Google and email/password, via Supabase Auth.
- **Payments work** — Paystack test mode, wired end to end.
- The **orders tables are ready** but must be created: run `supabase/orders.sql`.
- **No confirmation email yet** — the webhook logs the payment, and the next step is to
  send one from it.
- `/account` is **not protected** and still shows sample order data.
- Email confirmation is currently disabled in Supabase Auth — re-enable it and configure
  production SMTP before launch.
- Pending: `ngozi-wide-leg-pant-3.jpg` carries a third-party "FABADORE" watermark.
- Three or more commits are still unpushed on `main`.

