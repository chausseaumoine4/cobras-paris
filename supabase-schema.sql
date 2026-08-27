create table if not exists public.site_content (
  content_key text primary key,
  content_data jsonb not null default '[]'::jsonb,
  updated_at timestamptz not null default now()
);

alter table public.site_content enable row level security;

drop policy if exists "Public can read site content" on public.site_content;
create policy "Public can read site content"
  on public.site_content for select
  to anon, authenticated
  using (true);

drop policy if exists "Authenticated staff can insert site content" on public.site_content;
create policy "Authenticated staff can insert site content"
  on public.site_content for insert
  to authenticated
  with check (true);

drop policy if exists "Authenticated staff can update site content" on public.site_content;
create policy "Authenticated staff can update site content"
  on public.site_content for update
  to authenticated
  using (true)
  with check (true);

insert into public.site_content (content_key, content_data)
values
  ('news', '[]'::jsonb),
  ('matches', '[]'::jsonb),
  ('users', '[]'::jsonb),
  ('activities', '[]'::jsonb)
on conflict (content_key) do nothing;
