create extension if not exists pgcrypto;

do $$
begin
  if not exists (
    select 1
    from pg_type
    where typname = 'auto_estado'
  ) then
    create type public.auto_estado as enum ('Nuevo', 'Usado');
  end if;
end $$;

create table if not exists public.autos (
  id uuid primary key default gen_random_uuid(),
  marca text not null,
  modelo text not null,
  anio integer not null check (anio between 1900 and extract(year from now())::integer + 1),
  precio numeric(12,2) not null check (precio >= 0),
  descripcion text not null,
  estado public.auto_estado not null default 'Usado',
  fotos text[] not null default '{}',
  constraint autos_marca_not_blank check (length(trim(marca)) > 0),
  constraint autos_modelo_not_blank check (length(trim(modelo)) > 0),
  constraint autos_descripcion_not_blank check (length(trim(descripcion)) > 0),
  constraint autos_fotos_validas check (not ('' = any (fotos)))
);

create index if not exists idx_autos_estado on public.autos (estado);
create index if not exists idx_autos_precio on public.autos (precio desc);
create index if not exists idx_autos_anio on public.autos (anio desc);

alter table public.autos enable row level security;

drop policy if exists "Lectura pública de autos" on public.autos;
create policy "Lectura pública de autos"
on public.autos
for select
to anon, authenticated
using (true);

drop policy if exists "Escritura pública para demo admin frontend" on public.autos;
create policy "Escritura pública para demo admin frontend"
on public.autos
for all
to anon, authenticated
using (true)
with check (true);

insert into storage.buckets (id, name, public)
values ('fotos-autos', 'fotos-autos', true)
on conflict (id) do update
set public = excluded.public;

drop policy if exists "Lectura pública de fotos-autos" on storage.objects;
create policy "Lectura pública de fotos-autos"
on storage.objects
for select
to anon, authenticated
using (bucket_id = 'fotos-autos');

drop policy if exists "Escritura pública de fotos-autos para demo admin frontend" on storage.objects;
create policy "Escritura pública de fotos-autos para demo admin frontend"
on storage.objects
for all
to anon, authenticated
using (bucket_id = 'fotos-autos')
with check (bucket_id = 'fotos-autos');

comment on table public.autos is 'Catálogo principal de vehículos publicados en Centronea.';
comment on column public.autos.anio is 'Se guarda sin ñ por compatibilidad, pero en la interfaz siempre se muestra como Año.';
