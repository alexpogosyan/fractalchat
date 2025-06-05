create table public.anchors (
  id uuid primary key default gen_random_uuid(),
  message_id uuid not null references public.messages(id) on delete cascade,
  thread_id uuid not null references public.threads(id) on delete cascade,
  start_index integer not null,
  end_index integer not null
);

alter table public.anchors  enable row level security;

create policy "anchors owner select"
  on public.anchors
  for select
  using (
    message_id in (
      select id from public.messages
      where thread_id in (
        select id from public.threads where user_id = auth.uid()
      )
    )
  );

create policy "anchors owner insert"
  on public.anchors
  for insert
  with check (
    message_id in (
      select id from public.messages
      where thread_id in (
        select id from public.threads where user_id = auth.uid()
      )
    )
  );

create policy "anchors owner delete"
  on public.anchors
  for delete
  using (
    message_id in (
      select id from public.messages
      where thread_id in (
        select id from public.threads where user_id = auth.uid()
      )
    )
  );
