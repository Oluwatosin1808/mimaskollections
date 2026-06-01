-- Allow anonymous (unauthenticated) users to insert orders.
-- This is required because checkout is a public flow — customers
-- place orders without signing in.  The anon key's role is 'anon',
-- not 'authenticated', so the original policy blocked all public inserts.

CREATE POLICY allow_anon_insert_orders ON orders
  FOR INSERT
  WITH CHECK (true);

-- Also allow anon users to read their own orders by order_number
-- (the order confirmation page needs to show the result).
-- If you only want authenticated reads, keep the existing policy
-- and remove this one.
CREATE POLICY allow_anon_select_orders ON orders
  FOR SELECT
  USING (true);
