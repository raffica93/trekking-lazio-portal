-- Some excursions do not contain enough information for a reliable location.
-- Keep those coordinates empty instead of placing them at the Rome fallback.
alter table public.places
  alter column latitude drop not null,
  alter column longitude drop not null;
