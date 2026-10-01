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

## Adding your product photography

All product images are driven by one file: **`src/lib/data/products.ts`**.

**1. Save your files** in `public/images/products/`.

**2. Point a product at your files** by editing its `images` array:

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

## Current status

- Product, order, address and account data are **temporary local data** — no database is connected yet.
- **Payments** are not connected. The checkout is a visual demo only.
- **Authentication** is not connected. The login/account pages are layouts only.
- **Email** delivery is not connected. The contact form validates but does not send.

