-- Split blog taxonomy: category for browse filters, destination for country / travel-map.

alter table public.blog_posts
  add column if not exists category text not null default '';

alter table public.blog_topics
  add column if not exists category text not null default '';

-- Move current destination labels (e.g. 여행정보, 촬영지) into category.
update public.blog_posts
set category = trim(destination)
where coalesce(trim(category), '') = ''
  and coalesce(trim(destination), '') <> '';

update public.blog_topics
set category = '여행정보'
where coalesce(trim(category), '') = ''
  and coalesce(trim(destination), '') <> '';

-- Clear post destination so it can be refilled with country names only.
update public.blog_posts
set destination = ''
where trim(destination) = trim(category);

create index if not exists blog_posts_category_idx
  on public.blog_posts (category);

create index if not exists blog_posts_destination_idx
  on public.blog_posts (destination);
