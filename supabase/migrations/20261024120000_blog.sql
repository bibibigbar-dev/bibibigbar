-- Blog tables live in the amatdda Supabase project.
-- Every blog table name starts with blog_.

create table if not exists public.blog_posts (
  id text primary key,
  slug text not null unique,
  title text not null,
  excerpt text not null default '',
  content text not null default '',
  cover_image_url text not null default '',
  destination text not null default '',
  tags text[] not null default '{}',
  status text not null default 'draft' check (status in ('draft', 'scheduled', 'published')),
  published_at timestamptz,
  scheduled_at timestamptz,
  seo_title text not null default '',
  seo_description text not null default '',
  author_name text not null default '',
  reading_minutes integer not null default 1,
  source text not null default 'manual' check (source in ('manual', 'ai')),
  ai_prompt text not null default '',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.blog_topics (
  id text primary key,
  title text not null,
  destination text not null default '',
  angle text not null default '',
  keywords text[] not null default '{}',
  notes text not null default '',
  status text not null default 'queued' check (status in ('queued', 'generating', 'drafted', 'published', 'failed')),
  post_id text references public.blog_posts (id) on delete set null,
  error text not null default '',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists blog_posts_status_published_idx
  on public.blog_posts (status, published_at desc);

create index if not exists blog_topics_status_created_idx
  on public.blog_topics (status, created_at);

alter table public.blog_posts enable row level security;
alter table public.blog_topics enable row level security;

grant select on public.blog_posts to anon, authenticated;

drop policy if exists "public can read published posts" on public.blog_posts;
create policy "public can read published posts"
  on public.blog_posts
  for select
  to anon, authenticated
  using (status = 'published');
