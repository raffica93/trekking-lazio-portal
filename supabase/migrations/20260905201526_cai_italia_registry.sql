-- A section's region describes its organizer, not the excursion destination.
alter table public.places
  add column organizer_region text,
  add column cai_section_id text;

alter table public.places alter column organizer set default 'Sezione CAI';

create index places_published_date_end_idx on public.places (date_end)
  where status = 'published' and date_end is not null;
create index places_published_section_idx on public.places (organizer_region, organizer, date, id)
  where status = 'published';

create table public.cai_sections (
  id text primary key,
  name text not null,
  organizer_region text,
  directory_id text,
  section_type text,
  parent_section_id text,
  website_url text,
  directory_url text,
  calendar_urls jsonb not null default '[]'::jsonb check (jsonb_typeof(calendar_urls) = 'array'),
  adapter text,
  discovery_status text not null default 'pending',
  scrape_status text,
  event_count integer not null default 0 check (event_count >= 0),
  checked_at timestamptz,
  updated_at timestamptz not null default now()
);
create index cai_sections_region_idx on public.cai_sections (organizer_region, name);
alter table public.cai_sections enable row level security;
revoke all on public.cai_sections from anon, authenticated;
grant select on public.cai_sections to anon, authenticated;
grant all on public.cai_sections to service_role;
create policy "cai_sections: public directory" on public.cai_sections
  for select to anon, authenticated using (true);

comment on column public.places.organizer_region is 'Region of the CAI organizer; places.region is the destination region.';
comment on table public.cai_sections is 'Official national CAI registry with independently tracked calendar discovery and extraction coverage.';
