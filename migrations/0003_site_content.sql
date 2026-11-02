alter table products add column if not exists baag_url text not null default '';

create table if not exists site_content (
  key text primary key,
  value text not null default '',
  updated_at timestamptz not null default now()
);
