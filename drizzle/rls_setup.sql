-- ============================================================================
-- Row-Level Security (RLS) — Defesa em profundidade do multi-tenant
-- ============================================================================
--
-- Estratégia: o app conecta como `postgres` via Drizzle (bypassa RLS),
-- mas o cliente Supabase em rotas de portal (futuro: pais, atletas) usa
-- a anon/authenticated role do PostgREST/Supabase Auth. Nesse cenário
-- RLS é mandatório.
--
-- Aqui só ATIVAMOS RLS + criamos uma policy permissiva para `postgres`
-- (mantém o app funcionando) e uma policy stronger para `authenticated`
-- (Supabase Auth) baseada em current_setting('app.tenant_id').
--
-- Como o Drizzle conecta como `postgres`, ele continua tendo acesso total —
-- a defesa RLS aqui é pra eventual exposição via PostgREST/Supabase Realtime.
--
-- Idempotente: pode rodar várias vezes.
-- ============================================================================

-- Helper: extrai tenant_id do JWT do Supabase Auth (claim app_metadata.tenant_id)
create or replace function public.current_tenant_id() returns uuid
language sql stable
as $$
  select coalesce(
    nullif(current_setting('request.jwt.claims', true)::jsonb->'app_metadata'->>'tenant_id', ''),
    nullif(current_setting('app.tenant_id', true), '')
  )::uuid;
$$;

-- ============================================================================
-- Função genérica para ativar RLS + policies em todas as tabelas com tenant_id
-- ============================================================================
do $$
declare
  tbl text;
  tenant_tables text[] := array[
    'tenants',
    'users',
    'categories',
    'athletes',
    'guardians',
    'audit_log',
    'evaluations',
    'anthropometry_records',
    'physical_tests',
    'training_sessions',
    'matches',
    'injuries'
  ];
begin
  foreach tbl in array tenant_tables loop
    -- Ativa RLS
    execute format('alter table public.%I enable row level security', tbl);

    -- Drop policies existentes (idempotente)
    execute format('drop policy if exists "tenant_isolation_select" on public.%I', tbl);
    execute format('drop policy if exists "tenant_isolation_insert" on public.%I', tbl);
    execute format('drop policy if exists "tenant_isolation_update" on public.%I', tbl);
    execute format('drop policy if exists "tenant_isolation_delete" on public.%I', tbl);
    execute format('drop policy if exists "service_role_all" on public.%I', tbl);

    -- Service role: bypass total (usado pelo app via DATABASE_URL)
    execute format($f$
      create policy "service_role_all" on public.%I
        as permissive
        for all
        to service_role
        using (true) with check (true)
    $f$, tbl);

    -- Authenticated users: filtro por tenant_id (quando tabela tem tenant_id)
    if tbl <> 'tenants' then
      execute format($f$
        create policy "tenant_isolation_select" on public.%I
          as permissive
          for select
          to authenticated
          using (tenant_id = public.current_tenant_id())
      $f$, tbl);

      execute format($f$
        create policy "tenant_isolation_insert" on public.%I
          as permissive
          for insert
          to authenticated
          with check (tenant_id = public.current_tenant_id())
      $f$, tbl);

      execute format($f$
        create policy "tenant_isolation_update" on public.%I
          as permissive
          for update
          to authenticated
          using (tenant_id = public.current_tenant_id())
          with check (tenant_id = public.current_tenant_id())
      $f$, tbl);

      execute format($f$
        create policy "tenant_isolation_delete" on public.%I
          as permissive
          for delete
          to authenticated
          using (tenant_id = public.current_tenant_id())
      $f$, tbl);
    else
      -- Tabela tenants: usuário autenticado vê só o tenant dele
      execute format($f$
        create policy "tenant_isolation_select" on public.%I
          as permissive
          for select
          to authenticated
          using (id = public.current_tenant_id())
      $f$, tbl);
    end if;

    raise notice 'RLS habilitado: %', tbl;
  end loop;
end $$;

-- ============================================================================
-- Tabelas relacionais sem tenant_id direto (FK pro pai)
-- ============================================================================
do $$
declare
  tbl text;
  parent_table text;
  parent_fk text;
  rel record;
  pairs text[][] := array[
    array['athlete_guardians', 'athletes', 'athlete_id'],
    array['athlete_categories', 'athletes', 'athlete_id'],
    array['eval_technical', 'evaluations', 'evaluation_id'],
    array['eval_tactical', 'evaluations', 'evaluation_id'],
    array['eval_psych', 'evaluations', 'evaluation_id'],
    array['attendance', 'training_sessions', 'session_id'],
    array['match_stats', 'matches', 'match_id']
  ];
begin
  for i in 1..array_length(pairs, 1) loop
    tbl := pairs[i][1];
    parent_table := pairs[i][2];
    parent_fk := pairs[i][3];

    execute format('alter table public.%I enable row level security', tbl);

    execute format('drop policy if exists "service_role_all" on public.%I', tbl);
    execute format('drop policy if exists "tenant_isolation_via_parent" on public.%I', tbl);

    execute format($f$
      create policy "service_role_all" on public.%I
        as permissive for all to service_role
        using (true) with check (true)
    $f$, tbl);

    -- Filtra via JOIN no tenant da tabela pai
    execute format($f$
      create policy "tenant_isolation_via_parent" on public.%I
        as permissive for all to authenticated
        using (
          exists (
            select 1 from public.%I p
            where p.id = public.%I.%I
              and p.tenant_id = public.current_tenant_id()
          )
        )
    $f$, tbl, parent_table, tbl, parent_fk);

    raise notice 'RLS habilitado (relacional): % via %', tbl, parent_table;
  end loop;
end $$;
