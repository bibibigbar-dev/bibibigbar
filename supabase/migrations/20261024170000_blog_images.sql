-- Public images for travel posts. Uploads go through the admin server, not the browser key.

insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'blog-images',
  'blog-images',
  true,
  5242880,
  array['image/jpeg', 'image/png', 'image/webp', 'image/gif']
)
on conflict (id) do update
set
  public = excluded.public,
  file_size_limit = excluded.file_size_limit,
  allowed_mime_types = excluded.allowed_mime_types;

drop policy if exists "public can read blog images" on storage.objects;
create policy "public can read blog images"
  on storage.objects
  for select
  to anon, authenticated
  using (bucket_id = 'blog-images');
