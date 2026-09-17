create extension if not exists pgcrypto;

create table if not exists public.admin_config (
  id boolean primary key default true check (id),
  admin_email text not null check (admin_email = lower(admin_email))
);

alter table public.admin_config enable row level security;
revoke all on table public.admin_config from anon, authenticated;

-- Replace this value with the exact ADMIN_EMAIL from .env.local or Vercel.
insert into public.admin_config (id, admin_email)
values (true, 'you@example.com')
on conflict (id) do update set admin_email = excluded.admin_email;

create or replace function public.is_portfolio_admin()
returns boolean
language sql
security definer
set search_path = public
as $$
  select lower(coalesce(auth.jwt() ->> 'email', '')) =
    (select admin_email from public.admin_config where id = true);
$$;

revoke all on function public.is_portfolio_admin() from public;
grant execute on function public.is_portfolio_admin() to anon, authenticated;

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

create policy "Public can view photos"
  on public.photos for select
  using (true);

create policy "Admin can insert photos"
  on public.photos for insert
  with check (public.is_portfolio_admin());

create policy "Admin can delete photos"
  on public.photos for delete
  using (public.is_portfolio_admin());

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

create policy "Public photos images"
  on storage.objects for select
  using (bucket_id = 'photos');

create policy "Admin photos uploads"
  on storage.objects for insert
  with check (
    bucket_id = 'photos' and
    public.is_portfolio_admin()
  );

create policy "Admin photos deletes"
  on storage.objects for delete
  using (
    bucket_id = 'photos' and
    public.is_portfolio_admin()
  );
