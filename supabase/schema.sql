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
    array['Navy', 'Indigo'], array['30', '32', '34', '36', '38'],
    'A navy pinstripe wide-leg trouser in a crisp suiting — sharp for the boardroom, easy for every other day.',
    array['Pinstripe suiting', 'Wide leg, mid-rise', 'Dry clean only'],
    '#1f2a44',
    array['/images/products/adeola-tailored-trouser-1.jpg'],
    true, 'Best seller', true
  ),
  (
    'hefa-002', 'ngozi-wide-leg-pant', 'Ngozi Wide-Leg Pant', 74000, 'Casual',
    array['Multicolour', 'Red'], array['30', '32', '34', '36', '38'],
    'A statement wide-leg in signature Afro-print, finished with patch pockets and a full, flowing hem.',
    array['Printed viscose', 'Wide leg, high-rise', 'Machine wash cold'],
    '#b03a2e',
    array['/images/products/ngozi-wide-leg-pant-1.jpg', '/images/products/ngozi-wide-leg-pant-2.jpg', '/images/products/ngozi-wide-leg-pant-3.jpg'],
    true, null, true
  ),
  (
    'hefa-003', 'iwe-pleated-trouser', 'Ìwé Pleated Trouser', 76000, 'Corporate',
    array['Aubergine', 'Plum'], array['30', '32', '34', '36'],
    'A deep aubergine pleated wide-leg — polished in the office, striking after hours.',
    array['Double pleat', 'Wide leg, high-rise', 'Dry clean only'],
    '#4a2540',
    array['/images/products/iwe-pleated-trouser-1.jpg'],
    false, null, true
  ),
  (
    'hefa-004', 'amara-high-waist-pant', 'Amara High-Waist Pant', 58000, 'Casual',
    array['Ochre', 'Mustard'], array['28', '30', '32', '34'],
    'A relaxed high-waist harem pant in warm mustard — an effortless anchor for weekend dressing.',
    array['Printed cotton', 'Elastic high-waist, relaxed leg', 'Machine wash cold'],
    '#e0a526',
    array['/images/products/amara-high-waist-pant-1.jpg'],
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
    array['Grey', 'Charcoal'], array['28', '30', '32', '34'],
    'A cropped tailored trouser in cool grey with an asymmetric wrap panel — made to be worn with loafers.',
    array['Wool blend', 'Cropped, tapered leg', 'Dry clean only'],
    '#6b7280',
    array['/images/products/zara-cropped-pant-1.jpg'],
    false, null, true
  ),
  (
    'hefa-006', 'ifeoma-fluid-pant', 'Ifeoma Fluid Pant', 62000, 'Casual',
    array['Cream', 'Ivory'], array['28', '30', '32', '34'],
    'A soft ivory wide-leg with a clean pleated front — comfort that still holds its shape.',
    array['Tencel blend', 'Pleated wide leg, mid-rise', 'Machine wash cold'],
    '#e9e2d2',
    array['/images/products/ifeoma-fluid-pant-1.jpg'],
    true, null, true
  ),
  (
    'hefa-007', 'dami-classic-trouser', 'Dami Classic Trouser', 66000, 'Corporate',
    array['Camel', 'Ochre'], array['30', '32', '34', '36', '38'],
    'A warm camel pleated trouser — the classic neutral that quietly carries a whole wardrobe.',
    array['Wool blend', 'Pleated wide leg', 'Dry clean only'],
    '#b98b5e',
    array['/images/products/dami-classic-trouser-1.jpg'],
    false, null, true
  ),
  (
    'hefa-008', 'kehinde-relaxed-pant', 'Kehinde Relaxed Pant', 56000, 'Casual',
    array['Olive', 'Forest'], array['28', '30', '32', '34', '36'],
    'A relaxed, easy pant in olive green, balancing comfort with a considered, modern line.',
    array['Heavy cotton', 'Relaxed wide leg', 'Machine wash cold'],
    '#6b7d3a',
    array['/images/products/kehinde-relaxed-pant-1.jpg'],
    false, null, true
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
