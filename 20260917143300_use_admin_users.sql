create table if not exists public.admin_users (
  user_id uuid primary key references auth.users(id) on delete cascade,
  created_at timestamptz not null default now()
);

alter table public.admin_users enable row level security;

drop policy if exists "Admins can view their own membership" on public.admin_users;
create policy "Admins can view their own membership"
  on public.admin_users for select
  using (auth.uid() = user_id);

-- Membership is provisioned manually from the Supabase SQL editor.
-- Authenticated users cannot insert, update, or delete admin membership.
revoke all on table public.admin_users from public;
grant select on table public.admin_users to authenticated;

drop policy if exists "Public can view photos" on public.photos;
drop policy if exists "Admin can insert photos" on public.photos;
drop policy if exists "Admin can delete photos" on public.photos;

create policy "Public can view photos"
  on public.photos for select
  using (true);

create policy "Admin can insert photos"
  on public.photos for insert
  with check (
    exists (
      select 1
      from public.admin_users
      where admin_users.user_id = auth.uid()
    )
  );

create policy "Admin can delete photos"
  on public.photos for delete
  using (
    exists (
      select 1
      from public.admin_users
      where admin_users.user_id = auth.uid()
    )
  );

drop policy if exists "Admin photos uploads" on storage.objects;
drop policy if exists "Admin photos deletes" on storage.objects;

create policy "Admin photos uploads"
  on storage.objects for insert
  with check (
    bucket_id = 'photos' and
    exists (
      select 1
      from public.admin_users
      where admin_users.user_id = auth.uid()
    )
  );

create policy "Admin photos deletes"
  on storage.objects for delete
  using (
    bucket_id = 'photos' and
    exists (
      select 1
      from public.admin_users
      where admin_users.user_id = auth.uid()
    )
  );

drop function if exists public.is_portfolio_admin();
drop table if exists public.admin_config;
