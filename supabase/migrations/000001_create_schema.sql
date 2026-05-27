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

alter table products enable row level security;
create policy allow_authenticated_select_products on products
  for select using (true);
create policy allow_authenticated_insert_products on products
  for insert with check (auth.role() = 'authenticated');
create policy allow_authenticated_update_products on products
  for update using (auth.role() = 'authenticated') with check (auth.role() = 'authenticated');
create policy allow_authenticated_delete_products on products
  for delete using (auth.role() = 'authenticated');
