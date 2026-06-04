-- Migration to add stock and price columns to products table
ALTER TABLE products ADD COLUMN IF NOT EXISTS stock INTEGER NOT NULL DEFAULT 0;
ALTER TABLE products ADD COLUMN IF NOT EXISTS price NUMERIC NOT NULL;
