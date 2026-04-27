create extension if not exists pgcrypto;

create or replace function public.set_updated_at()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create table public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  display_name text,
  role text check (role in ('azubi', 'mtla', 'lehrer', 'andere')) default 'mtla',
  ausbildungsjahr smallint check (ausbildungsjahr between 1 and 3),
  preferred_language text default 'de',
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create table public.timer_templates (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete cascade,
  name text not null,
  duration_seconds integer not null check (duration_seconds > 0),
  bereich text check (bereich in ('mibi','haema','chemie','histo','general','learn')),
  description text,
  is_public boolean default false,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create table public.timer_runs (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete cascade,
  template_id uuid references public.timer_templates(id) on delete set null,
  name text not null,
  duration_seconds integer not null,
  started_at timestamptz not null,
  completed_at timestamptz,
  cancelled boolean default false,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create table public.protokolle (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete cascade,
  name text not null,
  bereich text not null check (bereich in ('mibi','haema','chemie','histo','general','learn')),
  description text,
  steps jsonb not null,
  is_public boolean default false,
  source text,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create table public.protokoll_runs (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete cascade,
  protokoll_id uuid references public.protokolle(id) on delete set null,
  protokoll_snapshot jsonb not null,
  started_at timestamptz not null,
  completed_at timestamptz,
  notes text,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create table public.kolonie_counts (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete cascade,
  name text,
  patient_id_local text,
  agar_type text,
  dilution text,
  counts jsonb not null,
  total_cfu integer,
  notes text,
  photo_path text,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create table public.differential_counts (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete cascade,
  name text,
  patient_id_local text,
  counts jsonb not null,
  total_cells integer not null default 100,
  notes text,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create table public.subscriptions (
  user_id uuid primary key references auth.users(id) on delete cascade,
  revenuecat_app_user_id text not null,
  active_entitlements text[] default '{}',
  expires_at timestamptz,
  product_id text,
  store text check (store in ('app_store', 'play_store', 'stripe')),
  updated_at timestamptz default now()
);

create index timer_templates_user_updated_idx on public.timer_templates (user_id, updated_at desc);
create index timer_templates_public_idx on public.timer_templates (is_public) where is_public = true;
create index timer_runs_user_started_idx on public.timer_runs (user_id, started_at desc);
create index protokolle_user_updated_idx on public.protokolle (user_id, updated_at desc);
create index protokolle_public_idx on public.protokolle (is_public) where is_public = true;
create index protokoll_runs_user_started_idx on public.protokoll_runs (user_id, started_at desc);
create index kolonie_counts_user_created_idx on public.kolonie_counts (user_id, created_at desc);
create index differential_counts_user_created_idx on public.differential_counts (user_id, created_at desc);

create trigger profiles_set_updated_at before update on public.profiles for each row execute function public.set_updated_at();
create trigger timer_templates_set_updated_at before update on public.timer_templates for each row execute function public.set_updated_at();
create trigger timer_runs_set_updated_at before update on public.timer_runs for each row execute function public.set_updated_at();
create trigger protokolle_set_updated_at before update on public.protokolle for each row execute function public.set_updated_at();
create trigger protokoll_runs_set_updated_at before update on public.protokoll_runs for each row execute function public.set_updated_at();
create trigger kolonie_counts_set_updated_at before update on public.kolonie_counts for each row execute function public.set_updated_at();
create trigger differential_counts_set_updated_at before update on public.differential_counts for each row execute function public.set_updated_at();

create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (id, display_name, preferred_language)
  values (
    new.id,
    coalesce(new.raw_user_meta_data ->> 'full_name', new.raw_user_meta_data ->> 'name'),
    coalesce(new.raw_user_meta_data ->> 'preferred_language', 'de')
  )
  on conflict (id) do nothing;
  return new;
end;
$$;

create trigger on_auth_user_created
after insert on auth.users
for each row execute function public.handle_new_user();

alter table public.profiles enable row level security;
alter table public.timer_templates enable row level security;
alter table public.timer_runs enable row level security;
alter table public.protokolle enable row level security;
alter table public.protokoll_runs enable row level security;
alter table public.kolonie_counts enable row level security;
alter table public.differential_counts enable row level security;
alter table public.subscriptions enable row level security;

create policy "profiles_select_own" on public.profiles for select using ((select auth.uid()) = id);
create policy "profiles_update_own" on public.profiles for update using ((select auth.uid()) = id) with check ((select auth.uid()) = id);

create policy "timer_templates_select_own_or_public" on public.timer_templates for select using ((select auth.uid()) = user_id or is_public = true);
create policy "timer_templates_insert_own" on public.timer_templates for insert with check ((select auth.uid()) = user_id);
create policy "timer_templates_update_own" on public.timer_templates for update using ((select auth.uid()) = user_id) with check ((select auth.uid()) = user_id);
create policy "timer_templates_delete_own" on public.timer_templates for delete using ((select auth.uid()) = user_id);

create policy "timer_runs_select_own" on public.timer_runs for select using ((select auth.uid()) = user_id);
create policy "timer_runs_insert_own" on public.timer_runs for insert with check ((select auth.uid()) = user_id);
create policy "timer_runs_update_own" on public.timer_runs for update using ((select auth.uid()) = user_id) with check ((select auth.uid()) = user_id);
create policy "timer_runs_delete_own" on public.timer_runs for delete using ((select auth.uid()) = user_id);

create policy "protokolle_select_own_or_public" on public.protokolle for select using ((select auth.uid()) = user_id or is_public = true);
create policy "protokolle_insert_own" on public.protokolle for insert with check ((select auth.uid()) = user_id);
create policy "protokolle_update_own" on public.protokolle for update using ((select auth.uid()) = user_id) with check ((select auth.uid()) = user_id);
create policy "protokolle_delete_own" on public.protokolle for delete using ((select auth.uid()) = user_id);

create policy "protokoll_runs_select_own" on public.protokoll_runs for select using ((select auth.uid()) = user_id);
create policy "protokoll_runs_insert_own" on public.protokoll_runs for insert with check ((select auth.uid()) = user_id);
create policy "protokoll_runs_update_own" on public.protokoll_runs for update using ((select auth.uid()) = user_id) with check ((select auth.uid()) = user_id);
create policy "protokoll_runs_delete_own" on public.protokoll_runs for delete using ((select auth.uid()) = user_id);

create policy "kolonie_counts_select_own" on public.kolonie_counts for select using ((select auth.uid()) = user_id);
create policy "kolonie_counts_insert_own" on public.kolonie_counts for insert with check ((select auth.uid()) = user_id);
create policy "kolonie_counts_update_own" on public.kolonie_counts for update using ((select auth.uid()) = user_id) with check ((select auth.uid()) = user_id);
create policy "kolonie_counts_delete_own" on public.kolonie_counts for delete using ((select auth.uid()) = user_id);

create policy "differential_counts_select_own" on public.differential_counts for select using ((select auth.uid()) = user_id);
create policy "differential_counts_insert_own" on public.differential_counts for insert with check ((select auth.uid()) = user_id);
create policy "differential_counts_update_own" on public.differential_counts for update using ((select auth.uid()) = user_id) with check ((select auth.uid()) = user_id);
create policy "differential_counts_delete_own" on public.differential_counts for delete using ((select auth.uid()) = user_id);

create policy "subscriptions_select_own" on public.subscriptions for select using ((select auth.uid()) = user_id);

insert into storage.buckets (id, name, public)
values ('kolonie-photos', 'kolonie-photos', false), ('avatars', 'avatars', true)
on conflict (id) do nothing;

create policy "kolonie_photos_select_own" on storage.objects for select using (
  bucket_id = 'kolonie-photos'
  and (select auth.uid())::text = (storage.foldername(name))[1]
);

create policy "kolonie_photos_insert_own" on storage.objects for insert with check (
  bucket_id = 'kolonie-photos'
  and (select auth.uid())::text = (storage.foldername(name))[1]
);

create policy "kolonie_photos_update_own" on storage.objects for update using (
  bucket_id = 'kolonie-photos'
  and (select auth.uid())::text = (storage.foldername(name))[1]
) with check (
  bucket_id = 'kolonie-photos'
  and (select auth.uid())::text = (storage.foldername(name))[1]
);

create policy "kolonie_photos_delete_own" on storage.objects for delete using (
  bucket_id = 'kolonie-photos'
  and (select auth.uid())::text = (storage.foldername(name))[1]
);

create policy "avatars_public_read" on storage.objects for select using (bucket_id = 'avatars');
create policy "avatars_write_own" on storage.objects for insert with check (
  bucket_id = 'avatars'
  and (select auth.uid())::text = (storage.foldername(name))[1]
);
create policy "avatars_update_own" on storage.objects for update using (
  bucket_id = 'avatars'
  and (select auth.uid())::text = (storage.foldername(name))[1]
) with check (
  bucket_id = 'avatars'
  and (select auth.uid())::text = (storage.foldername(name))[1]
);
