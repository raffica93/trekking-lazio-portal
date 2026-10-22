-- Store coordinate provenance without backfilling or changing existing place rows.
alter table public.places
  add column if not exists geo_evidence jsonb;

alter table public.places
  drop constraint if exists places_geo_evidence_valid_check;

alter table public.places
  add constraint places_geo_evidence_valid_check check (
    geo_evidence is null
    or (
      jsonb_typeof(geo_evidence) = 'object'
      and geo_evidence ?& array['status', 'pointType', 'precision', 'sourceKind', 'sourceUrl']
      and geo_evidence - array['status', 'pointType', 'precision', 'sourceKind', 'sourceUrl'] = '{}'::jsonb
      and jsonb_typeof(geo_evidence->'status') = 'string'
      and geo_evidence->>'status' in ('verified', 'needs_review', 'unknown')
      and jsonb_typeof(geo_evidence->'pointType') = 'string'
      and geo_evidence->>'pointType' in ('start', 'summit', 'area')
      and jsonb_typeof(geo_evidence->'precision') = 'string'
      and geo_evidence->>'precision' in ('exact', 'high', 'medium', 'low', 'unknown')
      and (
        geo_evidence->'sourceKind' = 'null'::jsonb
        or geo_evidence->>'sourceKind' in ('official', 'gpx', 'map')
      )
      and (
        geo_evidence->'sourceUrl' = 'null'::jsonb
        or geo_evidence->>'sourceUrl' ~ '^https?://[^[:space:]]+$'
      )
      and (
        geo_evidence->>'status' <> 'verified'
        or (
          geo_evidence->>'sourceKind' is not null
          and geo_evidence->>'sourceKind' in ('official', 'gpx', 'map')
          and geo_evidence->>'sourceUrl' is not null
          and geo_evidence->>'sourceUrl' ~ '^https?://[^[:space:]]+$'
          and geo_evidence->>'precision' <> 'unknown'
          and latitude is not null and longitude is not null
          and latitude between -90 and 90
          and longitude between -180 and 180
        )
      )
    )
  );
