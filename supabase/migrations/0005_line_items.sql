-- ============================================================
-- Per-item line items (dry cleaning + household items) on orders
-- ============================================================

alter table public.orders
  add column if not exists line_items jsonb not null default '[]'::jsonb;
