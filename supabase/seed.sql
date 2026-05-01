-- =====================================================================
-- Seed mínimo para demo
-- =====================================================================
-- ATENÇÃO: este seed assume que você já tem um usuário cadastrado em
-- auth.users (criado via login na própria app). Substitua o e-mail
-- abaixo pelo seu antes de rodar.
-- =====================================================================

do $$
declare
  v_owner_email constant text := 'demo@bluefields.local';
  v_owner_id uuid;
  v_startup_a uuid;
  v_startup_b uuid;
  v_startup_c uuid;
begin
  select id into v_owner_id from public.profiles where email = v_owner_email limit 1;
  if v_owner_id is null then
    raise notice 'Nenhum perfil encontrado para %, abortando seed.', v_owner_email;
    return;
  end if;

  insert into public.startups (id, name, segment, phase, responsible_id)
  values
    (gen_random_uuid(), 'Aurora Health', 'Healthtech', 'mvp', v_owner_id),
    (gen_random_uuid(), 'Mango Logistics', 'Logística', 'traction', v_owner_id),
    (gen_random_uuid(), 'Quanta Energy', 'Energia', 'ideation', v_owner_id)
  returning id into v_startup_a;

  -- Pega os ids inseridos para criar updates de exemplo
  select id into v_startup_a from public.startups where name = 'Aurora Health' limit 1;
  select id into v_startup_b from public.startups where name = 'Mango Logistics' limit 1;
  select id into v_startup_c from public.startups where name = 'Quanta Energy' limit 1;

  insert into public.updates (startup_id, author_id, update_date, what_happened, blockers, next_steps, risk_at_update)
  values
    (v_startup_a, v_owner_id, current_date, 'Validamos o piloto com 3 clínicas parceiras.', 'Integração com prontuário ainda travada.', 'Reunião com fornecedor de API na quinta.', 'yellow'),
    (v_startup_b, v_owner_id, current_date - 7, 'Crescimento de 20% no MRR.', 'Sem bloqueios.', 'Foco em expansão para SP.', 'green'),
    (v_startup_c, v_owner_id, current_date - 2, 'Founder precisou se afastar por questões pessoais.', 'Time-chave parado, runway encurtando.', 'Avaliar bridge round e suporte da aceleradora.', 'red');
end$$;
