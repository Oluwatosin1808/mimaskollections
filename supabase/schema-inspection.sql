-- Supabase schema inspection snapshot.
-- This file reflects the public schema and can be used for reference or manual inspection.

create extension if not exists pgcrypto;

create table if not exists categories (
  id text primary key,
  title text not null,
  subtitle text,
  href text,
  icon text
);

create table if not exists products (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  description text,
  price numeric not null default 0,
  category text not null references categories(id),
  image text,
  stock int not null default 0,
  in_stock boolean generated always as (stock > 0) stored
);

create table if not exists orders (
  id uuid primary key default gen_random_uuid(),
  order_number text unique not null,
  name text not null,
  email text not null,
  phone text not null,
  address text not null,
  location text not null,
  notes text,
  subtotal numeric not null default 0,
  delivery_fee numeric not null default 0,
  total numeric not null default 0,
  status text not null default 'Pending',
  items jsonb not null,
  invoice_pdf_base64 text,
  created_at timestamp with time zone not null default now()
);

alter table products enable row level security;
create policy allow_authenticated_select_products on products
  for select using (true);
create policy allow_authenticated_insert_products on products
  for insert with check (auth.role() = 'authenticated');
create policy allow_authenticated_update_products on products
  for update using (auth.role() = 'authenticated') with check (auth.role() = 'authenticated');
create policy allow_authenticated_delete_products on products
  for delete using (auth.role() = 'authenticated');

alter table orders enable row level security;
create policy allow_authenticated_select_orders on orders
  for select using (auth.role() = 'authenticated');
create policy allow_authenticated_insert_orders on orders
  for insert with check (auth.role() = 'authenticated');
create policy allow_authenticated_update_orders on orders
  for update using (auth.role() = 'authenticated') with check (auth.role() = 'authenticated');
create policy allow_authenticated_delete_orders on orders
  for delete using (auth.role() = 'authenticated');
-- Allow public (anon) checkout flow
create policy allow_anon_insert_orders on orders
  for insert with check (true);
create policy allow_anon_select_orders on orders
  for select using (true);
