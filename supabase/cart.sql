-- ============================================================================
-- HEFA — Supabase shared cart
--
-- HOW TO RUN THIS
--   1. Open your Supabase dashboard → SQL Editor → New query
--   2. Paste this whole file in
--   3. Click "Run"
--
-- It is safe to run more than once: every statement is idempotent.
--
-- ---------------------------------------------------------------------------
-- WHAT THIS IS FOR
-- ---------------------------------------------------------------------------
-- Until now each customer's cart lived only in their own browser
-- (localStorage, key "hefa.cart.v1"). That works for one device and nothing
-- else: the website could not see what the phone had, and the phone could not
-- see what the website had.
--
-- This table is the shared cart. Once a customer signs in, both the website
-- and the mobile app read and write the same rows, so adding a pair of trousers
-- on the phone shows up on the website and vice versa.
--
-- Guests are deliberately NOT given a cart row. A guest has no account to
-- attach one to, so their cart stays in localStorage exactly as it is today and
-- merges into this table the moment they sign in.
--
-- ---------------------------------------------------------------------------
-- WHY NO PRICES ARE STORED HERE
-- ---------------------------------------------------------------------------
-- There is no price, subtotal or total column anywhere in this table, and that
-- is the most important decision in the file.
--
-- Anything a browser or a phone sends can be edited by hand. If the cart
-- stored what the client claimed things cost, someone could add a 200,000 naira
-- trouser, rewrite the figure to 1, and check out for 1.
--
-- So this table records only WHAT was chosen — which product, which colour,
-- which size, how many. Every price is re-read from the products table on the
-- server when the cart is read, exactly as priceCart() already does for
-- checkout. The amount charged is always the database figure.
--
-- ---------------------------------------------------------------------------
-- SECURITY MODEL
-- ---------------------------------------------------------------------------
-- Row Level Security does the work. `auth.uid()` is the signed-in customer's own
-- id, supplied by Supabase and not editable by the client, so a policy of
--   using (auth.uid() = user_id)
-- means a customer can only ever see, change or delete their own cart — and
-- cannot touch anybody else's, even by guessing an id.
--
-- Unlike orders, a cart is safe to write from the client: it holds no money
-- and no personal data beyond what is already in the customer's account. That
-- is what lets both apps talk to it directly.
-- ============================================================================
-- ---------------------------------------------------------------------------
-- Table
-- ---------------------------------------------------------------------------

create table if not exists public.cart_items (
  id          uuid primary key default gen_random_uuid(),
  -- The cart belongs to an account. Null is not allowed here: a guest has no
  -- row in this table at all (see the note above).
  user_id     uuid        not null references auth.users(id) on delete cascade,
  -- A product id from the products table, e.g. 'hefa-001'. Deliberately not a
  -- foreign key: the catalogue is seeded and re-synced by schema.sql, and a
  -- hard reference would block those updates. An unknown id is simply ignored
  -- when the cart is read.
  product_id  text        not null,
  -- Colour and size are part of what identifies a line, not decoration: the
  -- same trouser in Navy 32 is a different line from Navy 34.
  color       text        not null default '',
  size        text        not null default '',
  -- Ceiling of 10 matches MAX_QUANTITY in src/lib/cart.ts, so both clients
  -- agree on what "as many as you can add" means.
  quantity    integer     not null check (quantity > 0 and quantity <= 10),
  -- Used to tell which device wrote last when the same cart is open in two
  -- places at once.
  updated_at  timestamptz not null default now(),

  -- One row per product/colour/size combination. Adding the same item again
  -- then increases the quantity on the existing row rather than creating a
  -- second identical line, which is what a shopper expects.
  constraint cart_items_unique_line
    unique (user_id, product_id, color, size)
);

-- ---------------------------------------------------------------------------
-- Indexes
--
-- Every read is "this customer's cart", so the unique constraint's index
-- already covers it (it leads with user_id). This second index supports
-- trimming stale carts, which has to sweep the whole table by age.
-- ---------------------------------------------------------------------------

create index if not exists cart_items_user_id_idx on public.cart_items (user_id);
create index if not exists cart_items_updated_at_idx on public.cart_items (updated_at);

-- ---------------------------------------------------------------------------
-- Row Level Security
-- ---------------------------------------------------------------------------

alter table public.cart_items enable row level security;

-- Grants for the client roles. Supabase applies these by default for new
-- tables, but stating them here means this file is complete on its own and does
-- not silently depend on a dashboard default.
grant select, insert, update, delete on public.cart_items to authenticated;
grant select on public.cart_items to anon;

drop policy if exists "Customers can read their own cart" on public.cart_items;
create policy "Customers can read their own cart"
  on public.cart_items
  for select
  using (auth.uid() = user_id);

drop policy if exists "Customers can add to their own cart" on public.cart_items;
create policy "Customers can add to their own cart"
  on public.cart_items
  for insert
  with check (auth.uid() = user_id);

drop policy if exists "Customers can update their own cart" on public.cart_items;
create policy "Customers can update their own cart"
  on public.cart_items
  for update
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

drop policy if exists "Customers can remove from their own cart" on public.cart_items;
create policy "Customers can remove from their own cart"
  on public.cart_items
  for delete
  using (auth.uid() = user_id);

-- ---------------------------------------------------------------------------
-- How the apps talk to this table
-- ---------------------------------------------------------------------------
--   GET    /api/cart            list the signed-in customer's lines, priced
--   POST   /api/cart/items      add a line (or increase an existing one)
--   PATCH  /api/cart/items/[id] change a quantity
--   DELETE /api/cart/items/[id] remove a line
--   DELETE /api/cart            empty the cart
--
-- Every one of them re-reads the products table before returning a price.
-- See src/lib/cart-server.ts.
-- ---------------------------------------------------------------------------