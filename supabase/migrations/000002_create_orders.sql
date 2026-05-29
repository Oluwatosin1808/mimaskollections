-- Create orders table for checkout persistence
CREATE TABLE IF NOT EXISTS orders (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  order_number text UNIQUE NOT NULL,
  name text NOT NULL,
  email text NOT NULL,
  phone text NOT NULL,
  address text NOT NULL,
  location text NOT NULL,
  notes text,
  subtotal numeric NOT NULL DEFAULT 0,
  delivery_fee numeric NOT NULL DEFAULT 0,
  total numeric NOT NULL DEFAULT 0,
  status text NOT NULL DEFAULT 'Pending',
  items jsonb NOT NULL,
  invoice_pdf_base64 text,
  created_at timestamp with time zone NOT NULL DEFAULT now()
);

alter table orders enable row level security;
create policy allow_authenticated_select_orders on orders
  for select using (auth.role() = 'authenticated');
create policy allow_authenticated_insert_orders on orders
  for insert with check (auth.role() = 'authenticated');
create policy allow_authenticated_update_orders on orders
  for update using (auth.role() = 'authenticated') with check (auth.role() = 'authenticated');
create policy allow_authenticated_delete_orders on orders
  for delete using (auth.role() = 'authenticated');
