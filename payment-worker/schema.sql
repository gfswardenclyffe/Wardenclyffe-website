-- No payment card information is stored. Minimal order data for sandbox verification/delivery.
CREATE TABLE IF NOT EXISTS orders (
  id TEXT PRIMARY KEY,
  provider TEXT NOT NULL CHECK (provider IN ('stripe','paypal')),
  provider_order_id TEXT UNIQUE,
  sku TEXT NOT NULL,
  customer_email TEXT NOT NULL,
  currency TEXT NOT NULL,
  amount INTEGER NOT NULL,
  status TEXT NOT NULL CHECK (status IN ('pending','processing','fulfilled','failed')),
  created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  fulfilled_at TEXT,
  last_error TEXT
);
CREATE INDEX IF NOT EXISTS idx_orders_provider ON orders(provider,provider_order_id);
