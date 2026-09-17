create extension if not exists pgcrypto;

create table if not exists public.admin_users (
  user_id uuid primary key references auth.users(id) on delete cascade,
  created_at timestamptz not null default now()
);
alter table public.admin_users enable row level security;
create policy "Admins can view their own membership"
  on public.admin_users for select using (auth.uid() = user_id);

create table if not exists public.photos (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  category text not null default 'New work',
  description text,
  image_url text not null,
  storage_path text not null,
  featured boolean not null default false,
  created_at timestamptz not null default now()
);
alter table public.photos enable row level security;
drop policy if exists "Public can view photos" on public.photos;
drop policy if exists "Admin can insert photos" on public.photos;
drop policy if exists "Admin can delete photos" on public.photos;
create policy "Public can view photos" on public.photos for select using (true);
create policy "Admin can insert photos" on public.photos for insert
  with check (exists (select 1 from public.admin_users where user_id = auth.uid()));
create policy "Admin can delete photos" on public.photos for delete
  using (exists (select 1 from public.admin_users where user_id = auth.uid()));
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'photos',
  'photos',
  true,
  10485760,
  array['image/jpeg', 'image/png', 'image/webp']::text[]
)
on conflict (id) do update set
  public = excluded.public,
  file_size_limit = excluded.file_size_limit,
  allowed_mime_types = excluded.allowed_mime_types;
drop policy if exists "Public photos images" on storage.objects;
drop policy if exists "Admin photos uploads" on storage.objects;
drop policy if exists "Admin photos deletes" on storage.objects;
create policy "Public photos images" on storage.objects for select using (bucket_id = 'photos');
create policy "Admin photos uploads" on storage.objects for insert
  with check (bucket_id = 'photos' and exists (select 1 from public.admin_users where user_id = auth.uid()));
create policy "Admin photos deletes" on storage.objects for delete
  using (bucket_id = 'photos' and exists (select 1 from public.admin_users where user_id = auth.uid()));
