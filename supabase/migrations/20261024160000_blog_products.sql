-- Shop products live beside the blog tables in the amatdda project.
-- Every table name starts with blog_.

create table if not exists public.blog_products (
  id text primary key,
  name text not null,
  image_url text not null default '',
  price_label text not null default '',
  category text not null default '',
  amazon_url text not null,
  is_visible boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists blog_products_visible_updated_idx
  on public.blog_products (is_visible, updated_at desc);

alter table public.blog_products enable row level security;

grant select on public.blog_products to anon, authenticated;

drop policy if exists "public can read visible products" on public.blog_products;
create policy "public can read visible products"
  on public.blog_products
  for select
  to anon, authenticated
  using (is_visible = true);
