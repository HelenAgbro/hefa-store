-- ============================================================================
-- HEFA — Supabase orders (checkout)
--
-- HOW TO RUN THIS
--   1. Open your Supabase dashboard → SQL Editor → New query
--   2. Paste this whole file in
--   3. Click "Run"
--
-- It is safe to run more than once: every statement is idempotent.
--
-- ---------------------------------------------------------------------------
-- WHY THIS IS A SEPARATE FILE
-- ---------------------------------------------------------------------------
-- schema.sql owns the catalogue. Orders change for different reasons and are
-- applied independently, so adjusting shipping or payment never forces a
-- catalogue re-seed.
--
-- ---------------------------------------------------------------------------
-- SECURITY MODEL
-- ---------------------------------------------------------------------------
-- The browser never writes orders. Rows are created and updated by the server
-- using the service-role key, which bypasses the policies below — that is what
-- lets a guest checkout (no signed-in user) still record a purchase.
--
-- The policies only ever allow *reading* one's own orders, so a signed-in
-- customer can see their history without being able to read anyone else's or
-- alter their own.
--
-- Card details are never stored here. Card data lives entirely with Paystack;
-- this table records only the payment reference Paystack gives back.
-- ============================================================================

-- ---------------------------------------------------------------------------
-- Tables
-- ---------------------------------------------------------------------------

create table if not exists public.orders (
  id                uuid primary key default gen_random_uuid(),
  -- Short human reference shown to the customer, e.g. "HEFA-1042".
  reference         text        not null unique,
  -- Null for guest checkout; set when the customer is signed in.
  user_id           uuid        references auth.users(id) on delete set null,
  email             text        not null,
  phone             text        not null,
  status            text        not null default 'pending'
                    check (status in ('pending', 'paid', 'processing', 'shipped', 'delivered', 'cancelled', 'refunded')),
  -- Money is stored in whole Naira, matching the products table.
  subtotal          integer     not null check (subtotal >= 0),
  shipping          integer     not null default 0 check (shipping >= 0),
  total             integer     not null check (total >= 0),
  currency          text        not null default 'NGN',
  shipping_method   text        not null,
  shipping_label    text        not null default '',
  -- Delivery address, captured at checkout.
  address1          text        not null,
  address2          text,
  city              text        not null,
  region            text        not null,
  postal_code       text        not null default '',
  country           text        not null,
  -- The reference Paystack returns. Null until payment succeeds.
  payment_reference text,
  paid_at           timestamptz,
  created_at        timestamptz not null default now()
);

create table if not exists public.order_items (
  id           uuid primary key default gen_random_uuid(),
  order_id     uuid        not null references public.orders(id) on delete cascade,
  product_id   text        not null,
  -- Name, slug and price are snapshotted at purchase time so that later edits
  -- to the catalogue never rewrite what the customer actually bought.
  product_name text        not null,
  product_slug text        not null,
  color        text        not null default '',
  size         text        not null default '',
  quantity     integer     not null check (quantity > 0),
  unit_price   integer     not null check (unit_price >= 0),
  line_total   integer     not null check (line_total >= 0)
);

-- ---------------------------------------------------------------------------
-- Indexes
-- ---------------------------------------------------------------------------

create index if not exists orders_user_id_idx on public.orders (user_id, created_at desc);
create index if not exists orders_reference_idx on public.orders (reference);
create index if not exists order_items_order_id_idx on public.order_items (order_id);

-- ---------------------------------------------------------------------------
-- Row Level Security
-- ---------------------------------------------------------------------------

alter table public.orders enable row level security;
alter table public.order_items enable row level security;

-- Customers may read their own orders. No insert/update/delete policy exists on
-- purpose: those writes happen server-side with the service-role key only.
drop policy if exists "Users can read own orders" on public.orders;
create policy "Users can read own orders"
  on public.orders
  for select
  using (auth.uid() = user_id);

-- Line items follow the same rule, via their parent order.
drop policy if exists "Users can read own order items" on public.order_items;
create policy "Users can read own order items"
  on public.order_items
  for select
  using (
    exists (
      select 1
      from public.orders
      where orders.id = order_items.order_id
        and orders.user_id = auth.uid()
    )
  );

-- ---------------------------------------------------------------------------
-- How the app talks to these tables
-- ---------------------------------------------------------------------------
--   createOrder()          inserts a 'pending' order before redirecting to Paystack
--   markPaid()             flips 'pending' -> 'paid' from the Paystack webhook
--   getOrderByReference()  reads one order for the confirmation page
--   getOrdersForUser()     powers the /account/orders history
-- ---------------------------------------------------------------------------