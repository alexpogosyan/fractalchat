create table public.threads (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  parent_id uuid references threads(id) on delete cascade,
  title text,
  created_at timestamptz not null default now()
);

alter table public.threads  enable row level security;

create policy "threads owner select" on public.threads for select using (user_id = auth.uid());
create policy "threads owner insert" on public.threads for insert with check (user_id = auth.uid());
create policy "threads owner update" on public.threads for update using (user_id = auth.uid());
create policy "threads owner delete" on public.threads for delete using (user_id = auth.uid());
