# AI-PLAN — Plano de execução AI-first

> Como a IA (Cursor) foi usada para entregar o MVP do desafio Bluefields.

## 1. Premissas de uso da IA

- **Ferramenta única:** Cursor (modelos das famílias Claude/GPT disponíveis no editor).
- **Princípio:** IA é **aceleradora**, não substituta de decisão. Toda saída de IA passa por revisão humana com critério explícito.
- **Guardrails do repositório** (já no `.cursor/general_rules.mdc`):
  - Sem literais soltos (números, cores, tokens repetidos).
  - UI sempre em `src/components/`.
  - Sem strings em comparação — usar enums/constantes.
- **Guardrails de runtime:**
  - Validação `zod` em toda Server Action (input/output).
  - RLS habilitada em todas as tabelas no Supabase.
  - Variáveis sensíveis somente em `.env.local` / env da Vercel; `.env.example` versionado.
- **Guardrails de revisão:**
  - Antes de qualquer commit, rodar mentalmente a `QUALITY-REVIEW-SKILL` sobre os arquivos alterados.

## 2. Como o problema foi quebrado

A divisão segue do mais ambíguo para o mais executável, e a IA participa em todas as etapas, com papéis diferentes:

```mermaid
flowchart LR
    A[Problema cru no README] --> B[PRD.md]
    B --> C[ARCHITECTURE.md]
    C --> D[QUALITY-REVIEW-SKILL.md]
    D --> E[Migration + RLS]
    E --> F[Constantes + tipos]
    F --> G[Auth + middleware]
    G --> H[CRUD Startups]
    H --> I[Updates + timeline]
    I --> J[Dashboard]
    J --> K[Qualidade + testes]
    K --> L[Deploy]
    L --> M[REVIEW.md]
```

A regra é: **nada de código sem PRD; nada de PRD sem entender a dor**. A IA é parceira em cada etapa, mas com nível de autonomia decrescente conforme a etapa fica mais crítica (auth, RLS, validação).

## 3. Papéis da IA por fase

| Fase | Papel da IA | Papel humano | Tipo de prompt |
|---|---|---|---|
| Entender o problema | Reformular em linguagem de produto e listar perguntas em aberto | Decidir quais perguntas valem ser feitas ao "cliente" | Conversa exploratória |
| PRD | Estruturar JTBD, escopo, métricas, trade-offs | Validar persona, escopo e priorização | Pedir esqueleto, depois iterar seção por seção |
| Arquitetura | Propor opções de stack e modelagem com prós/contras | Escolher stack e travar decisões | Pedir alternativas com trade-offs explícitos |
| Skill de revisão | Gerar checklist; auto-criticar a própria saída | Editar para o contexto do projeto | "Crie um checklist e depois aponte 3 itens que você mesmo violaria" |
| Setup | Gerar comandos e configs | Rodar e conferir | Comandos prontos, sem "explicação criativa" |
| Migration / RLS | Gerar SQL, mas com revisão linha a linha | Auditar política RLS | Pedir SQL idempotente + comentários por política |
| Constantes / tipos | Gerar boilerplate | Conferir alinhamento ao domínio | Pedir baseado no PRD |
| Auth / middleware | Gerar com base na doc oficial; flag de "verificou docs?" | Testar manualmente login/logout/proteção | Pedir referência à versão atual do `@supabase/ssr` |
| CRUD / forms | Gerar Server Actions + componentes | Garantir uso de constantes e validação | Pedir conforme `general_rules.mdc` |
| Dashboard | Gerar agregações e UI | Conferir consistência com escopo | Iterativo |
| Testes | Gerar unitários para validators e regra de risco | Garantir que falham se a regra mudar | "Escreva o teste antes do refator" |
| Deploy | Gerar checklist e comandos | Executar | Checklist |
| REVIEW | Gerar autoavaliação honesta | Editar para refletir decisões reais | Crítico |

## 4. Abordagem prática de prompting (estilo padrão usado neste projeto)

Em vez de prompts mágicos, usamos **três tipos de prompt recorrentes** no Cursor:

### 4.1. Prompt de contexto (uso do plano + regras)

Sempre que uma nova sessão começa em uma fase, o contexto base inclui:

```
- README.md (problema)
- docs/PRD.md (escopo)
- docs/ARCHITECTURE.md (decisões técnicas)
- .cursor/general_rules.mdc (regras de código)
- docs/QUALITY-REVIEW-SKILL.md (como revisar)
```

A IA é orientada a **respeitar `general_rules.mdc`** (sem literais soltos, sem strings em comparação, componentes em `src/components/`).

### 4.2. Prompt de execução (vertical slice)

Para cada feature, o prompt segue o formato:

```
Objetivo: <feature em uma frase>
Escopo: <arquivos que devem mudar>
Restrições:
  - Validar entrada com zod (schema em src/lib/validations).
  - Constantes em src/lib/constants. Sem literais inline.
  - Componentes em src/components/<dominio>.
  - Texto em português.
Critério de feito:
  - <lista de checks>
```

### 4.3. Prompt de revisão (auto-crítica)

Após gerar código não trivial:

```
Revise o diff a seguir aplicando docs/QUALITY-REVIEW-SKILL.md.
Liste violações por categoria (qualidade, segurança, manutenibilidade, testes).
Para cada violação, diga se é bloqueante ou débito consciente.
```

A IA é forçada a olhar o próprio output com a skill antes do humano olhar. Reduz idas-e-vindas.

## 5. Plano de execução (checkpoints e tempo-alvo)

Tempo total alvo: **6–10h**. Cada checkpoint termina com algo testável manualmente.

| # | Checkpoint | Saída testável | Tempo alvo |
|---|---|---|---|
| C0 | Documentação base (PRD + AI-PLAN + ARCHITECTURE + SKILL) | 4 arquivos em `docs/` | 1.5h |
| C1 | Setup do projeto (Next.js, Tailwind, shadcn, libs) | `pnpm dev` sobe a app vazia | 0.5h |
| C2 | Supabase + migration + RLS + tipos gerados | Tabelas criadas, RLS ativa | 0.5h |
| C3 | Constantes + validations + tipos | `src/lib` populada | 0.3h |
| C4 | Auth funcional + proteção de rotas | Login/logout funcionam | 1.0h |
| C5 | CRUD de startups | Criar/listar/editar/excluir | 1.5h |
| C6 | Updates + timeline | Update aparece na startup | 1.0h |
| C7 | Dashboard com risco e filtros | Painel consolidado funciona | 1.0h |
| C8 | Qualidade (zod completo, testes, RLS revisada) | Testes passando | 0.7h |
| C9 | Deploy na Vercel + seed | Link público funcionando | 0.5h |
| C10 | REVIEW.md + README atualizado | Docs finais | 0.5h |

Cada checkpoint tem uma **definição binária de feito** — sem ambiguidade.

## 6. Riscos do uso de IA neste projeto

| Risco | Probabilidade | Impacto | Mitigação |
|---|---|---|---|
| IA gerar código com strings de status hardcoded | Alta | Médio | `general_rules.mdc` carregada sempre + revisão usando QUALITY-REVIEW-SKILL |
| IA usar API antiga do `@supabase/ssr` (versões mudam rápido) | Alta | Alto | Apontar a documentação atual no prompt; testar login manualmente |
| IA gerar RLS errada (permitir acesso anônimo) | Média | Alto | Auditar política linha a linha; teste manual com usuário deslogado |
| IA inventar campos do banco que não existem | Média | Médio | Tipos gerados via `supabase gen types typescript` sempre que o schema muda |
| IA gerar testes que validam a saída atual em vez da regra | Média | Médio | Prompt explícito: "escreva o teste antes do refator" |
| IA preencher silêncios com escopo extra | Alta | Médio | PRD bem fechado; não-escopo explícito; trade-off documentado |
| Vazamento de chaves Supabase em commits | Baixa | Crítico | `.env.example` versionado, `.env.local` no `.gitignore`, lembrete no README |

## 7. Decisões fechadas (não revisitar sem motivo)

- Stack: Next.js 15 (App Router) + Supabase + Vercel.
- TypeScript estrito.
- shadcn/ui + Tailwind.
- Server Actions (sem REST formal).
- Email + senha no Supabase Auth.
- Risco da startup é o do último update (view SQL).
- Sem testes E2E neste MVP.

## 8. Decisões abertas (tratadas como custo se virar problema)

- ORM (atualmente nenhum). Se a complexidade crescer, considerar Drizzle.
- Observabilidade (atualmente apenas logs do Next/Vercel). Se virar produção real, adicionar Sentry/Logtail.
- Convites/roles. Hoje não existem. Anotado em `REVIEW.md` como próximo passo.

## 9. Como esta documentação é usada na prática

- **Antes de cada sessão de código:** abro `PRD.md` e `ARCHITECTURE.md` no Cursor para que a IA tenha contexto fresco.
- **Antes de cada PR/commit:** aplico `QUALITY-REVIEW-SKILL.md` ao diff.
- **Após cada checkpoint:** atualizo o `REVIEW.md` com o que ficou bom e os débitos assumidos, sem esperar o final.
