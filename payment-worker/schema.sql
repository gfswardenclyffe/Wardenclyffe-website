-- D1 database for sandbox orders. Contains no card or bank account credentials.
CREATE TABLE IF NOT EXISTS orders (
  id TEXT PRIMARY KEY,
  provider TEXT NOT NULL CHECK (provider IN ('stripe','paypal','openpay_card','openpay_spei','bank_chase','bank_bbva')),
  provider_order_id TEXT UNIQUE,
  sku TEXT NOT NULL,
  customer_email TEXT NOT NULL,
  currency TEXT NOT NULL CHECK (currency IN ('usd','mxn')),
  amount INTEGER NOT NULL CHECK (amount > 0),
  status TEXT NOT NULL CHECK (status IN ('pending','processing','fulfilled','failed')),
  created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  fulfilled_at TEXT,
  last_error TEXT
);
CREATE INDEX IF NOT EXISTS idx_orders_provider ON orders(provider,provider_order_id);

-- Openpay sends a verification code when a webhook endpoint is registered.
-- Stored privately for manual confirmation in the Openpay dashboard.
CREATE TABLE IF NOT EXISTS webhook_verifications (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  provider TEXT NOT NULL,
  verification_code TEXT NOT NULL,
  created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
);
-- Prevent the same cleared bank transfer from fulfilling multiple orders.
CREATE TABLE IF NOT EXISTS bank_reconciliations (
  order_id TEXT PRIMARY KEY REFERENCES orders(id),
  bank_transaction_id TEXT NOT NULL UNIQUE,
  bank_currency TEXT NOT NULL,
  bank_amount INTEGER NOT NULL,
  reviewer TEXT NOT NULL,
  verified_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
);
