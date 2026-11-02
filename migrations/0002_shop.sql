create table if not exists products (
  id serial primary key,
  slug text unique not null,
  name text not null,
  price integer not null,
  category text not null,
  description text not null default '',
  details text not null default '[]',
  images text not null default '[]',
  sizes text not null default '["S","M","L","XL"]',
  featured boolean not null default false,
  active boolean not null default true,
  created_at timestamptz not null default now()
);

create table if not exists stock (
  id serial primary key,
  product_id integer not null references products(id) on delete cascade,
  size text not null,
  qty integer not null default 0,
  unique (product_id, size)
);

create table if not exists ledger (
  id serial primary key,
  kind text not null,
  source text not null,
  amount integer not null,
  note text not null default '',
  order_id text,
  created_at timestamptz not null default now()
);

create index if not exists products_slug_idx on products (slug);
create index if not exists stock_product_id_idx on stock (product_id);
create index if not exists ledger_created_at_idx on ledger (created_at desc);
