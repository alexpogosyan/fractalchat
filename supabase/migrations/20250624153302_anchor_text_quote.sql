alter table public.anchors
  add column selector jsonb not null;

alter table public.anchors
  drop column start_index,
  drop column end_index;