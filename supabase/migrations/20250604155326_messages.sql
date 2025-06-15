create type sender_type as enum ('user', 'assistant');

create table public.messages (
  id uuid primary key default gen_random_uuid(),
  thread_id uuid not null references threads(id) on delete cascade,
  sender sender_type not null default 'user',
  content text,
  created_at timestamptz not null default now()
);

alter table public.messages enable row level security;

create policy "messages owner select"
  on public.messages
  for select
  using (
    thread_id in (
      select id from public.threads where user_id = auth.uid()
    )
  );

create policy "messages owner insert"
  on public.messages
  for insert
  with check (
    thread_id in (
      select id from public.threads where user_id = auth.uid()
    )
  );

create policy "messages owner update"
  on public.messages
  for update
  using (
    thread_id in (
      select id
      from public.threads
      where user_id = auth.uid()
    )
  )
  with check (
    thread_id in (
      select id
      from public.threads
      where user_id = auth.uid()
    )
  );

create policy "messages owner delete"
  on public.messages
  for delete
  using (
    thread_id in (select id from public.threads where user_id = auth.uid())
  );

