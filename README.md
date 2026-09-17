# Lumen photography portfolio

An accessible, responsive photography portfolio with a public gallery and passwordless, single-admin studio dashboard. Built with Next.js App Router, TypeScript, Tailwind CSS, and Supabase Storage/Postgres.

## Local setup

1. Create a Supabase project and enable email magic links in **Authentication → Providers → Email**.
2. Copy `.env.example` to `.env.local` and set `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY`, and deployed `NEXT_PUBLIC_SITE_URL`. Use the publishable key from Supabase; never add a service-role key to browser-exposed variables.
3. In Supabase SQL Editor, run the original migration [`supabase/migrations/20260917140000_create_photos.sql`](supabase/migrations/20260917140000_create_photos.sql) only for a new database, then run [`supabase/migrations/20260917143300_use_admin_users.sql`](supabase/migrations/20260917143300_use_admin_users.sql). Do not rerun migrations that have already been applied.
4. Install and run:

```bash
npm install
npm run dev
```

Open `http://localhost:3000`; manage the gallery at `/admin/login`.

## Production notes

The client validates JPEG, PNG, and WebP uploads to 10 MB; the `photos` storage bucket, Storage policies, and Postgres RLS enforce the same limits and admin boundary server-side. Files are uploaded without transformations, preserving the original bytes and quality. For larger originals, tune the bucket limits in the migration and add an image transformation/CDN policy.

## Supabase and Vercel deployment

1. In Supabase, enable **Authentication → Providers → Email** and create the first user under **Authentication → Users → Add user**. Copy that user's UUID from the users table.
3. In **SQL Editor**, insert the UUID into the admin allowlist:
   ```sql
   insert into public.admin_users (user_id)
   values ('PASTE_AUTH_USER_UUID_HERE');
   ```
   The UUID must belong to a row in `auth.users`; the foreign key rejects unknown users.
4. In Vercel, add `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY`, and `NEXT_PUBLIC_SITE_URL`. Do not expose a Supabase service-role key to the browser or commit `.env.local`.
5. Add the Vercel deployment URL to Supabase **Authentication → URL Configuration → Redirect URLs**, for example `https://your-domain.vercel.app/auth/callback`.
6. Deploy with `npm run build`. Public visitors can select rows and storage objects; only a session whose `auth.uid()` exists in `public.admin_users` can insert/delete.
