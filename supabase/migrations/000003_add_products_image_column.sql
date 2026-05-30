-- Ensure the products table has an image column for product metadata.
ALTER TABLE IF EXISTS products
  ADD COLUMN IF NOT EXISTS image text;

-- In case a legacy singular product table exists, ensure it also has an image field.
ALTER TABLE IF EXISTS product
  ADD COLUMN IF NOT EXISTS image text;
