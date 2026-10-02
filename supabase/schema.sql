-- ============================================================================
-- HEFA — Supabase schema (Phase 1: products)
--
-- HOW TO RUN THIS
--   1. Open your Supabase dashboard → SQL Editor → New query
--   2. Paste this whole file in
--   3. Click "Run"
--
-- It is safe to run more than once: every statement is idempotent.
-- ============================================================================

-- ---------------------------------------------------------------------------
-- Table
-- ---------------------------------------------------------------------------
create table if not exists public.products (
  id          text primary key,
  slug        text unique not null,
  name        text        not null,
  price       integer     not null check (price >= 0),
  category    text        not null check (category in ('Corporate', 'Casual')),
  colors      text[]      not null default '{}',
  sizes       text[]      not null default '{}',
  description text        not null default '',
  details     text[]      not null default '{}',
  swatch      text        not null default '#2f2f2f',
  images      text[]      not null default '{}',
  featured    boolean     not null default false,
  badge       text,
  in_stock    boolean     not null default true,
  created_at  timestamptz not null default now()
);

-- ---------------------------------------------------------------------------
-- Row Level Security
--
-- The storefront only ever *reads* products from the browser, so we allow
-- public SELECT and nothing else. Writes will be done server-side later.
-- ---------------------------------------------------------------------------
alter table public.products enable row level security;

drop policy if exists "Public can read products" on public.products;
create policy "Public can read products"
  on public.products
  for select
  using (true);

-- ---------------------------------------------------------------------------
-- Seed data — your 8 products
-- Re-running this refreshes the catalogue without creating duplicates.
-- ---------------------------------------------------------------------------
insert into public.products
  (id, slug, name, price, category, colors, sizes, description, details, swatch, images, featured, badge, in_stock)
values
  (
    'hefa-001', 'adeola-tailored-trouser', 'Adeola Tailored Trouser', 68000, 'Corporate',
    array['Charcoal', 'Black'], array['30', '32', '34', '36', '38'],
    'A clean, straight-leg trouser with a sharp centre crease — the backbone of the corporate wardrobe.',
    array['Mid-weight wool blend', 'Straight leg, mid-rise', 'Dry clean only'],
    '#2f2f2f',
    array['/images/products/adeola-tailored-trouser-1.svg', '/images/products/adeola-tailored-trouser-2.svg', '/images/products/adeola-tailored-trouser-3.svg'],
    true, 'Best seller', true
  ),
  (
    'hefa-002', 'ngozi-wide-leg-pant', 'Ngozi Wide-Leg Pant', 74000, 'Corporate',
    array['Black', 'Forest'], array['30', '32', '34', '36', '38'],
    'A fluid wide-leg silhouette with a high waist, cut to elongate and move effortlessly.',
    array['Crepe suiting', 'Wide leg, high-rise', 'Dry clean only'],
    '#0b0b0b',
    array['/images/products/ngozi-wide-leg-pant-1.svg', '/images/products/ngozi-wide-leg-pant-2.svg', '/images/products/ngozi-wide-leg-pant-3.svg'],
    true, null, true
  ),
  (
    'hefa-003', 'iwe-pleated-trouser', 'Ìwé Pleated Trouser', 76000, 'Corporate',
    array['Forest', 'Charcoal'], array['30', '32', '34', '36', '38'],
    'Front-pleated trousers in a deep forest tone, tailored for a crisp, modern office look.',
    array['Double pleat', 'Tapered leg', 'Machine wash cold'],
    '#1e3a2f',
    array['/images/products/iwe-pleated-trouser-1.svg', '/images/products/iwe-pleated-trouser-2.svg', '/images/products/iwe-pleated-trouser-3.svg'],
    false, null, true
  ),
  (
    'hefa-004', 'amara-high-waist-pant', 'Amara High-Waist Pant', 58000, 'Casual',
    array['Ochre', 'Cream'], array['28', '30', '32', '34'],
    'A relaxed high-waist pant in warm ochre — an effortless anchor for weekend dressing.',
    array['Cotton twill', 'High-waist, relaxed leg', 'Machine wash cold'],
    '#b8860b',
    array['/images/products/amara-high-waist-pant-1.svg', '/images/products/amara-high-waist-pant-2.svg', '/images/products/amara-high-waist-pant-3.svg'],
    true, 'New', true
  )
on conflict (id) do update set
  slug = excluded.slug, name = excluded.name, price = excluded.price,
  category = excluded.category, colors = excluded.colors, sizes = excluded.sizes,
  description = excluded.description, details = excluded.details, swatch = excluded.swatch,
  images = excluded.images, featured = excluded.featured, badge = excluded.badge,
  in_stock = excluded.in_stock;

insert into public.products
  (id, slug, name, price, category, colors, sizes, description, details, swatch, images, featured, badge, in_stock)
values
  (
    'hefa-005', 'zara-cropped-pant', 'Zara Cropped Pant', 54000, 'Casual',
    array['Burnt Orange'], array['28', '30', '32', '34'],
    'A cropped, tapered pant in a rich burnt orange, designed to be worn with loafers or sneakers.',
    array['Structured cotton', 'Cropped, tapered leg', 'Machine wash cold'],
    '#b4551f',
    array['/images/products/zara-cropped-pant-1.svg', '/images/products/zara-cropped-pant-2.svg', '/images/products/zara-cropped-pant-3.svg'],
    false, null, true
  ),
  (
    'hefa-006', 'ifeoma-fluid-pant', 'Ifeoma Fluid Pant', 62000, 'Casual',
    array['Cream', 'Ochre'], array['28', '30', '32', '34'],
    'A soft, fluid pant in cream with a drawcord waist — comfort without losing shape.',
    array['Tencel blend', 'Drawcord waist', 'Machine wash cold'],
    '#e9e2d2',
    array['/images/products/ifeoma-fluid-pant-1.svg', '/images/products/ifeoma-fluid-pant-2.svg', '/images/products/ifeoma-fluid-pant-3.svg'],
    true, null, true
  ),
  (
    'hefa-007', 'dami-classic-trouser', 'Dami Classic Trouser', 66000, 'Corporate',
    array['Charcoal', 'Black'], array['30', '32', '34', '36', '38'],
    'An everyday tailored trouser with a slim leg and a subtle stretch for comfort in transit.',
    array['Stretch wool blend', 'Slim leg', 'Dry clean only'],
    '#3a3a3a',
    array['/images/products/dami-classic-trouser-1.svg', '/images/products/dami-classic-trouser-2.svg', '/images/products/dami-classic-trouser-3.svg'],
    false, null, true
  ),
  (
    'hefa-008', 'kehinde-relaxed-pant', 'Kehinde Relaxed Pant', 56000, 'Casual',
    array['Forest', 'Charcoal'], array['28', '30', '32', '34', '36'],
    'A relaxed, easy pant in forest green, balancing comfort with a considered, modern line.',
    array['Heavy cotton', 'Relaxed leg', 'Machine wash cold'],
    '#274b3a',
    array['/images/products/kehinde-relaxed-pant-1.svg', '/images/products/kehinde-relaxed-pant-2.svg', '/images/products/kehinde-relaxed-pant-3.svg'],
    false, null, false
  )
on conflict (id) do update set
  slug = excluded.slug, name = excluded.name, price = excluded.price,
  category = excluded.category, colors = excluded.colors, sizes = excluded.sizes,
  description = excluded.description, details = excluded.details, swatch = excluded.swatch,
  images = excluded.images, featured = excluded.featured, badge = excluded.badge,
  in_stock = excluded.in_stock;

-- ---------------------------------------------------------------------------
-- Optional: a view that only exposes the fields the storefront needs.
-- Not required — the app selects explicit columns anyway.
-- ---------------------------------------------------------------------------
