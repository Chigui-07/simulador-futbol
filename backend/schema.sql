-- Chigui World Cup · esquema preparado para un proyecto Supabase NUEVO.
-- No ejecutar sobre Academia Nexora. Este archivo NO activa por sí solo el multijugador.
create table if not exists public.cwc_profiles (
  user_id uuid primary key references auth.users(id) on delete cascade,
  nickname text not null check (char_length(nickname) between 2 and 30),
  coins integer not null default 1000 check (coins >= 0),
  correct_predictions integer not null default 0 check(correct_predictions >= 0),
  created_at timestamptz not null default now()
);
create table if not exists public.cwc_rooms (
  id uuid primary key default gen_random_uuid(),
  code text not null unique check (char_length(code) between 6 and 10),
  host_id uuid not null references auth.users(id) on delete cascade,
  title text not null check (char_length(title) between 1 and 80),
  status text not null default 'lobby' check(status in ('lobby','playing','finished')),
  tournament jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);
create table if not exists public.cwc_room_members (
  room_id uuid not null references public.cwc_rooms(id) on delete cascade,
  user_id uuid not null references auth.users(id) on delete cascade,
  joined_at timestamptz not null default now(),
  primary key(room_id,user_id)
);
create table if not exists public.cwc_predictions (
  id uuid primary key default gen_random_uuid(),
  room_id uuid not null references public.cwc_rooms(id) on delete cascade,
  user_id uuid not null references auth.users(id) on delete cascade,
  match_id text not null,
  selection text not null check(selection in ('a','draw','b')),
  stake integer not null check(stake between 10 and 500),
  settled boolean not null default false,
  won boolean,
  created_at timestamptz not null default now(),
  unique(room_id,user_id,match_id)
);
alter table public.cwc_profiles enable row level security;
alter table public.cwc_rooms enable row level security;
alter table public.cwc_room_members enable row level security;
alter table public.cwc_predictions enable row level security;

-- Perfiles: lectura general para rankings; escritura solo de nickname propia.
create policy "profile read" on public.cwc_profiles for select to authenticated using (true);
-- Sin política UPDATE de perfiles: monedas y estadísticas son server-only.
-- Participantes pueden consultar salas de las que sean anfitriones o integrantes.
create policy "room read own" on public.cwc_rooms for select to authenticated
using (host_id = (select auth.uid()) or exists (
 select 1 from public.cwc_room_members m where m.room_id = id and m.user_id=(select auth.uid())
));
-- Solo lectura de miembros propios (no exposición pública de listas).
create policy "member read own" on public.cwc_room_members for select to authenticated
using (user_id=(select auth.uid()));
create policy "prediction read own" on public.cwc_predictions for select to authenticated
using (user_id=(select auth.uid()));

-- ATENCIÓN: sin políticas INSERT/UPDATE/DELETE para evitar trampas y códigos de sala adivinados.
-- Crear/unirse a salas, simular partidos, apuestas y liquidar saldos
-- requiere funciones de servidor validadas y no está implementado todavía.
