# REVIEW — Autoavaliação do MVP

> Honesta, sem maquiar trade-offs. Atende ao entregável 7 do desafio.

## 1. O que ficou bom

### Produto
- **Escopo do MVP foi respeitado e priorizado.** Foi entregue exatamente o que o desafio pediu: cadastro de startups, updates periódicos, indicador de risco, dashboard consolidado, autenticação e persistência reais.
- **Filtros por risco e por fase** no dashboard atendem JTBD-2 e JTBD-5 com custo desprezível e tornam o painel utilizável mesmo com poucas startups.
- **Mensagens, labels e descrições em PT-BR**, alinhado ao público interno da Bluefields.

### Engenharia
- **`general_rules.mdc` aplicada em todo o código:**
  - Enums de domínio centralizados (`RISK_LEVEL`, `STARTUP_PHASE`, `ROUTES`).
  - Tokens visuais em `ui-tokens.ts`; nada de hex inline em componentes.
  - Limites de input centralizados em `input-limits.ts`.
  - Componentes UI 100% em `src/components/<dominio>/`. Páginas (`page.tsx`) são finas: dados + composição.
- **Validação `zod` em todas as Server Actions**, schemas reutilizados entre form e action.
- **RLS habilitada em todas as tabelas**; updates só podem ser editados pelo autor.
- **TypeScript estrito**, zero `any`, zero `as any`. Type-check limpo.
- **Lint limpo**, build de produção verde, 15 testes unitários passando.
- **Cliente Supabase com tipos manuais alinhados ao schema**, evitando dependência da CLI no setup local.
- **Server Actions retornam estado discriminado** (`{ ok, data } | { ok, error, fieldErrors }`) — UX previsível em forms.

### Documentação
- **PRD, AI-PLAN, ARCHITECTURE e QUALITY-REVIEW-SKILL escritos antes da implementação**, funcionando como guardrails para o próprio uso de IA.
- `QUALITY-REVIEW-SKILL.md` foi escrita como **skill reutilizável** (com `applies_to`, anti-padrões e checklist objetiva), não como um README descartável.

## 2. Aplicação da QUALITY-REVIEW-SKILL contra o próprio MVP

Apliquei a checklist no diff completo. Resumo dos achados (e como foram tratados):

### 2.1. Qualidade de código

- [OK] Sem strings de status hardcoded em comparação. Tudo via `RISK_LEVEL.*` / `STARTUP_PHASE.*` / `isRiskLevel()`.
- [OK] Sem cores/dimensões mágicas em componentes — cores de risco em CSS variables (`--risk-*`) e classes Tailwind via `RISK_BADGE_TONE`.
- [OK] Páginas em `app/` são finas. Lógica de dados em `server/queries/*` e `server/actions/*`.
- [OK] Zero `any`, zero `as any`. Único cast pontual: `latest as UpdateWithAuthor[]` na query com join, justificado pela limitação da inferência do query builder.
- [OK] Imports usando alias `@/`.

### 2.2. Segurança

- [OK] **RLS ativa** em `profiles`, `startups`, `updates`. View `startup_overview` com `security_invoker = true` herda RLS.
- [OK] **Service role nunca é usada** — sequer existe import em código de runtime. Apenas mencionada em `.env.example` para uso administrativo opcional.
- [OK] **`zod.parse` antes de tocar no banco** em todas as Server Actions (`createStartupAction`, `updateStartupAction`, `createUpdateAction`, `loginAction`, `signupAction`).
- [OK] **Erros do banco mapeados** para `ERROR_MESSAGES.GENERIC` em PT-BR; stack/PII só vai para o log do servidor.
- [OK] Nenhum segredo exposto via `NEXT_PUBLIC_*`. Apenas URL e anon key (públicas por design).
- [OK] `dangerouslySetInnerHTML` não é usado.
- [OK] `redirect` do `auth` valida que o destino começa com `/` e não com `//` (proteção contra open redirect).

### 2.3. Manutenibilidade

- [OK] Constantes de domínio em `src/lib/constants/*`.
- [OK] Schemas zod em `src/lib/validations/*`.
- [OK] Server Actions agrupadas por domínio em `src/server/actions/*`; queries em `src/server/queries/*`.
- [OK] Migration única, idempotente, com nome descritivo (`0001_init.sql`).
- [OK] `revalidatePath` chamado após cada mutação relevante (dashboard, lista, detalhe da startup).

### 2.4. Testes

- [OK] 15 testes unitários em `tests/`, cobrindo:
  - `risk-levels`: ordem, mapeamento, type guard.
  - `startup-phases`: ordem, mapeamento, type guard.
  - `validations`: `createStartupSchema` e `createUpdateSchema` (casos felizes, defaults, inválidos).
- [VIOL/D] **Sem teste E2E** — débito consciente (ver Seção 4).

### 2.5. Operação / observabilidade

- [OK] Erros de Server Action logados via `console.error` no servidor com prefixo `[<actionName>]` (sem PII).
- [OK] Variáveis novas em `.env.example`.
- [VIOL/D] **Sem integração com Sentry/Logtail** — para produção real isso seria mandatório. Débito (ver Seção 4).

## 3. O que faria depois (próxima iteração)

| # | Item | Tipo | Por quê não agora |
|---|---|---|---|
| 1 | Convites por e-mail + roles (`admin`, `member`) | Produto | MVP é time pequeno e coeso |
| 2 | Anexos em updates (links/imagens) | Produto | Volume baixo justifica texto puro |
| 3 | Histórico de risco em série temporal (gráfico) | Produto | Vale quando houver semanas de dado |
| 4 | Notificação "startups sem update há N dias" | Produto | Exige infra de e-mail/cron |
| 5 | Testes E2E (Playwright) cobrindo os 3 fluxos do PRD | Engenharia | Fora da janela de 6–10h |
| 6 | Sentry + logs estruturados | Engenharia | MVP usa console.error; vale antes de ir a produção real |
| 7 | Soft delete em `startups` e `updates` | Engenharia | Hoje delete é definitivo; ok para MVP, ruim para produção |
| 8 | Paginação na listagem | Engenharia | Listagem ainda é pequena; vira problema com >200 itens |
| 9 | Geração automatizada de tipos via `supabase gen types` | Engenharia | Tipos hoje são manuais; sustentável até o schema crescer |
| 10 | Auditoria (quem alterou o quê e quando) | Compliance | Não pedido, mas Bluefields pode querer |

## 4. Débitos técnicos assumidos conscientemente

| Débito | Risco se não pagar | Quando pagar |
|---|---|---|
| Sem testes E2E | Regressão silenciosa em fluxo crítico | Antes da v2 ou ao adicionar a primeira feature de complexidade |
| Sem Sentry / observabilidade externa | Erros em produção passam despercebidos | Antes de abrir para todo o time Bluefields |
| Tipos do banco mantidos manualmente | Drift entre schema e código se outra pessoa alterar SQL | Ao crescer o schema (3+ novas tabelas) |
| Permissões "todos podem tudo nas startups" | Membro júnior pode editar carteira de outro membro | Quando o time crescer ou houver convidados externos |
| Política de senha apenas a do Supabase Auth padrão | UX de senha fraca | Ao adicionar onboarding formal |
| Sem soft delete | Exclusão acidental é definitiva | Antes de entrar em uso real |

## 5. O que aprendi durante a execução

- **A regra de "documentação antes do código" funcionou.** O PRD me forçou a fechar o escopo de "risco derivado do último update" antes de criar a tabela — economizou retrabalho.
- **A `QUALITY-REVIEW-SKILL` fez diferença concreta.** Apontou cedo a tentação de usar `colors` inline no `RiskBadge`. Refatorei para `RISK_BADGE_TONE` em `ui-tokens.ts` antes do primeiro commit.
- **Versão de `@supabase/ssr` x `@supabase/supabase-js` é uma armadilha real.** A combinação que o `npm install` me deu na primeira tentativa (`ssr@0.5.2` + `supabase-js@2.45+`) tinha incompatibilidade nos tipos (a v2.45 reorganizou paths internos). A correção foi alinhar para `@supabase/ssr@latest`. **Lição:** quando uma lib é "BaaS-adjacent", manter SDK e cliente sempre na mesma faixa de versão.
- **Server Actions + `useActionState` é uma redução de boilerplate enorme** comparado com REST + react-query, ainda mais com validação compartilhada via zod.

## 6. Conclusão honesta

Em 6–8h de trabalho focado:
- Entreguei um MVP fullstack funcional, com auth, persistência, dashboard, CRUD e timeline.
- Documentei todo o processo, incluindo uma skill reutilizável de revisão.
- Mantive disciplina de constantes/enums e arquitetura limpa, mesmo sob pressão de tempo.
- Deixei o código em estado em que **outra pessoa entra e consegue evoluir** sem precisar me perguntar.

Ainda há débitos — todos listados acima, conscientes e priorizáveis. Não tentei esconder nenhum deles atrás de "depois eu arrumo".
