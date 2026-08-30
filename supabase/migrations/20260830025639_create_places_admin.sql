-- The public schema is exposed through the Supabase Data API.  Access is
-- therefore defined explicitly with grants and RLS policies in this migration.

create schema if not exists private;
revoke all on schema private from public;
grant usage on schema private to authenticated;

create table public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  display_name text,
  is_admin boolean not null default false,
  created_at timestamptz not null default now()
);

create table public.places (
  id uuid primary key default gen_random_uuid(),
  source_id text unique,
  slug text not null unique check (slug ~ '^[a-z0-9]+(?:-[a-z0-9]+)*$'),
  title text not null check (length(trim(title)) > 0),
  date date not null,
  date_end date,
  days smallint,
  category text not null check (length(trim(category)) > 0),
  external_url text not null check (length(trim(external_url)) > 0),
  organizer text not null default 'Trekking Lazio',
  location text not null check (length(trim(location)) > 0),
  municipality text,
  province text,
  region text,
  latitude double precision not null check (latitude between -90 and 90),
  longitude double precision not null check (longitude between -180 and 180),
  cost text,
  cost_amount numeric(10, 2) check (cost_amount is null or cost_amount >= 0),
  time text,
  distance_km numeric(7, 2) check (distance_km is null or distance_km >= 0),
  elevation_m integer check (elevation_m is null or elevation_m >= 0),
  duration_hours numeric(5, 2) check (duration_hours is null or duration_hours >= 0),
  mountain_group text,
  transport text,
  private_car boolean,
  start_place text,
  coordinates_quality text,
  summary text,
  activity_type text,
  terrain text,
  difficulty_note text,
  cover_image_path text,
  status text not null default 'draft' check (status in ('draft', 'published')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  check (date_end is null or date_end >= date),
  check (days is null or days > 0)
);

create index places_public_listing_idx on public.places (status, date);
create index places_region_idx on public.places (region);

create or replace function private.set_updated_at()
returns trigger
language plpgsql
security invoker
set search_path = ''
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create trigger places_set_updated_at
before update on public.places
for each row execute procedure private.set_updated_at();

-- Keeping this function in a non-exposed schema prevents it from becoming a
-- public API endpoint.  It is used only by RLS policies.
create or replace function private.is_admin()
returns boolean
language sql
stable
security definer
set search_path = ''
as $$
  select coalesce(
    (select profiles.is_admin from public.profiles where profiles.id = (select auth.uid())),
    false
  );
$$;

revoke all on function private.is_admin() from public;
grant execute on function private.is_admin() to authenticated;

create or replace function private.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
begin
  insert into public.profiles (id, display_name)
  values (
    new.id,
    coalesce(new.raw_user_meta_data ->> 'display_name', split_part(new.email, '@', 1))
  )
  on conflict (id) do nothing;
  return new;
end;
$$;

revoke all on function private.handle_new_user() from public;

create trigger on_auth_user_created
after insert on auth.users
for each row execute procedure private.handle_new_user();

-- Backfill profiles if Auth users existed before this migration.
insert into public.profiles (id, display_name)
select
  users.id,
  coalesce(users.raw_user_meta_data ->> 'display_name', split_part(users.email, '@', 1))
from auth.users as users
on conflict (id) do nothing;

alter table public.profiles enable row level security;
alter table public.places enable row level security;

revoke all on public.profiles from anon;
revoke all on public.places from anon;
revoke all on public.places from authenticated;
grant select on public.profiles to authenticated;
grant select on public.places to anon, authenticated;
grant insert, update, delete on public.places to authenticated;

create policy "profiles: users read their own profile"
on public.profiles for select
to authenticated
using ((select auth.uid()) = id);

create policy "profiles: admins read profiles"
on public.profiles for select
to authenticated
using ((select private.is_admin()));

create policy "places: anyone reads published places"
on public.places for select
to anon, authenticated
using (status = 'published');

create policy "places: admins read every place"
on public.places for select
to authenticated
using ((select private.is_admin()));

create policy "places: admins insert"
on public.places for insert
to authenticated
with check ((select private.is_admin()));

create policy "places: admins update"
on public.places for update
to authenticated
using ((select private.is_admin()))
with check ((select private.is_admin()));

create policy "places: admins delete"
on public.places for delete
to authenticated
using ((select private.is_admin()));

insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'place-images',
  'place-images',
  true,
  5242880,
  array['image/jpeg', 'image/png', 'image/webp']
)
on conflict (id) do update
set
  public = excluded.public,
  file_size_limit = excluded.file_size_limit,
  allowed_mime_types = excluded.allowed_mime_types;

create policy "place images: admins manage files"
on storage.objects for all
to authenticated
using (
  bucket_id = 'place-images'
  and (select private.is_admin())
)
with check (
  bucket_id = 'place-images'
  and (select private.is_admin())
);

-- Create the first user from Authentication > Users, then run this once in
-- the SQL editor as the project owner:
-- update public.profiles set is_admin = true where id = '<auth-user-uuid>';
