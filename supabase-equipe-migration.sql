alter table public.profiles add column if not exists email text;
update public.profiles p set email = u.email from auth.users u where u.id = p.id and p.email is null;

create or replace function public.handle_new_user()
returns trigger language plpgsql security definer set search_path = public
as $$
begin
  insert into public.profiles (id, display_name, email, role)
  values (new.id, coalesce(new.raw_user_meta_data->>'display_name', split_part(new.email, '@', 1)), new.email,
    case when coalesce(new.raw_user_meta_data->>'app_role', 'player') = 'staff' then 'admin' else 'player' end)
  on conflict (id) do update set email = excluded.email;
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created after insert on auth.users
for each row execute procedure public.handle_new_user();

insert into public.profiles (id, display_name, email, role)
select id, coalesce(raw_user_meta_data->>'display_name', split_part(email, '@', 1)), email, 'player'
from auth.users
on conflict (id) do update set email = excluded.email;

drop policy if exists "Admins manage profiles" on public.profiles;
create policy "Admins manage profiles" on public.profiles for update to authenticated
using (exists (select 1 from public.profiles me where me.id = auth.uid() and me.role = 'admin'))
with check (true);

drop policy if exists "Coaches create events" on public.team_events;
create policy "Coaches create events" on public.team_events for insert to authenticated
with check (exists (select 1 from public.profiles p where p.id = auth.uid() and p.role in ('coach','admin')));

update public.profiles set role = 'admin' where email = 'estebandhm.arty@gmail.com';
