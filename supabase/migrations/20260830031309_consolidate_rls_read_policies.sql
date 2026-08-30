-- Keep the same authorization model while avoiding multiple permissive SELECT
-- policies for the same role. This prevents redundant policy checks.

drop policy "profiles: users read their own profile" on public.profiles;
drop policy "profiles: admins read profiles" on public.profiles;

create policy "profiles: users read themselves or admins read all"
on public.profiles for select
to authenticated
using (
  (select auth.uid()) = id
  or (select private.is_admin())
);

drop policy "places: anyone reads published places" on public.places;
drop policy "places: admins read every place" on public.places;

create policy "places: visitors read published, admins read all"
on public.places for select
to anon
using (status = 'published');

create policy "places: signed-in users read published, admins read all"
on public.places for select
to authenticated
using (
  status = 'published'
  or (select private.is_admin())
);
