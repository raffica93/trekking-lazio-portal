-- Machine classification is kept separate from editorial/admin fields on places.
-- Reclassification can therefore never replace title, status, activity_type,
-- terrain, difficulty_note, cover_image_path, or other curated place values.
create table public.place_classifications (
  source_id text primary key references public.places(source_id) on delete restrict,
  decision text not null check (decision in ('trekking', 'non_trekking', 'da_verificare')),
  category text not null check (category in (
    'a piedi', 'ciaspole', 'alpinismo/ferrata', 'bici', 'sci',
    'sociale/culturale', 'corso/riunione', 'altro'
  )),
  confidence double precision check (confidence is null or confidence between 0 and 1),
  probability double precision check (probability is null or probability between 0 and 1),
  rationale text not null check (length(trim(rationale)) > 0),
  evidence_original text not null check (length(trim(evidence_original)) > 0),
  fingerprint text not null check (length(trim(fingerprint)) > 0),
  method text not null check (method in ('rules-v1', 'mercury-decide')),
  model_requested text,
  response_model text,
  model_attested boolean not null,
  policy_version text not null check (length(trim(policy_version)) > 0),
  model_version text,
  classified_at timestamptz not null default now(),
  check (
    (
      method = 'mercury-decide'
      and model_requested = 'inception/mercury-decide'
      and (
        (model_attested
          and response_model in ('inception/mercury-decide', 'inception/mercury-decide-20260930')
          and model_version = response_model)
        or (not model_attested and response_model is null and model_version is null)
      )
    )
    or (
      method = 'rules-v1'
      and model_requested is null
      and response_model is null
      and not model_attested
      and model_version is null
    )
  )
);

create index place_classifications_decision_idx
  on public.place_classifications (decision, source_id);

alter table public.place_classifications enable row level security;
revoke all on public.place_classifications from public;
revoke all on public.place_classifications from anon, authenticated;
grant select on public.place_classifications to anon, authenticated;
grant all on public.place_classifications to service_role;

create policy "place classifications: public reads published places"
on public.place_classifications for select
to anon, authenticated
using (
  exists (
    select 1
    from public.places
    where places.source_id = place_classifications.source_id
      and places.status = 'published'
  )
);

create policy "place classifications: service role manages rows"
on public.place_classifications for all
to service_role
using (true)
with check (true);
