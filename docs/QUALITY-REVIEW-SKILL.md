---
name: Quality Review Skill (AI-Generated Code)
description: Skill reutilizável para revisar a qualidade, segurança, manutenibilidade e maturidade de código gerado por IA. Use sempre que um agente de IA produzir um diff não trivial — antes de commitar, abrir PR ou subir para produção.
applies_to: "Qualquer mudança de código gerada por IA (Cursor, Claude Code, Codex, Copilot)."
---

# QUALITY-REVIEW-SKILL — Como revisar código gerado por IA

> **Objetivo:** transformar revisão de código em uma rotina **objetiva e repetível**, especialmente quando o código vem de um agente de IA. Não substitui revisão humana — mas garante que a revisão humana foque no que importa.

## 1. Quando aplicar esta skill

Aplicar **sempre** que houver:

- Alteração em código que envolve autenticação, autorização, RLS, validação ou input de usuário.
- Criação de novas Server Actions, rotas, ou queries no banco.
- Geração de UI reutilizável.
- Mudança de schema de banco / migrations.
- Mais de ~30 linhas geradas em sequência.

**Não** é necessário aplicar para:
- Comentários de código, documentação isolada, renomeações triviais.
- Ajustes cosméticos de UI controlados por design tokens.

## 2. Como aplicar (3 passos)

### Passo 1 — Fazer o diff falar

Antes de revisar, peça ao agente para descrever **em uma frase** o que cada arquivo alterado faz. Se a IA não consegue resumir, o humano também não vai conseguir revisar com confiança.

### Passo 2 — Rodar a checklist (Seção 4)

Marcar cada item:
- **OK** — o código respeita.
- **VIOL** — o código viola; precisa correção.
- **N/A** — não se aplica a este diff.

### Passo 3 — Classificar violações

Para cada **VIOL**:
- **B (bloqueante):** não pode ir para produção. Corrigir antes do commit.
- **D (débito consciente):** pode ir, mas vai para `REVIEW.md` com motivo e prazo.

## 3. Anti-padrões frequentes em código gerado por IA

| # | Padrão | Como detectar |
|---|---|---|
| AP1 | Strings de status hardcoded em comparações (`x === 'red'`) | grep por aspas em condições |
| AP2 | Cores e dimensões inline em vez de tokens | grep por `#`, `rgb(`, `px`, `ms` em componentes |
| AP3 | Duplicação de UI em vez de extrair componente | dois trechos quase iguais em pages diferentes |
| AP4 | Validação só no client | Server Action sem `zod.parse` |
| AP5 | RLS desligada ou política `using (true)` | abrir SQL e checar |
| AP6 | Service role do Supabase no client | grep por `SUPABASE_SERVICE_ROLE_KEY` em arquivos do client |
| AP7 | Catch silencioso (`} catch {}`) | grep por `catch` sem log/return |
| AP8 | Tipos `any` ou `as any` | grep por `: any` e `as any` |
| AP9 | Schema de banco e tipos TS divergindo | rodar `supabase gen types` e ver diff |
| AP10 | Use de `useEffect` para dados que poderiam ser RSC | revisar componentes client com fetch no mount |
| AP11 | Falta de `revalidatePath` após mutação | grep em Server Actions |
| AP12 | Mensagens de erro vazando stack/PII para o cliente | revisar respostas das actions |
| AP13 | Imports relativos profundos (`../../../`) em vez de aliases | grep por `../../` |
| AP14 | Texto da UI hardcoded espalhado | considerar centralizar quando aplicável |
| AP15 | Testes que validam o output atual em vez da regra | revisar nome e asserts dos testes |

## 4. Checklist (5 categorias)

### 4.1. Qualidade de código

- [ ] Sem strings hardcoded em comparações de domínio (uso de constantes/enums).
- [ ] Sem cores/dimensões mágicas em componentes (uso de tokens/Tailwind).
- [ ] Sem duplicação significativa: blocos repetidos viraram componentes em `src/components/`.
- [ ] Páginas (`page.tsx`) ficam finas: dados + composição de componentes.
- [ ] Tipos explícitos: zero `any`, zero `as any` exceto borda do mundo externo bem documentada.
- [ ] Imports usam alias do projeto (`@/...`), não caminhos relativos profundos.
- [ ] Funções pequenas e com nome que descreve a regra de negócio.

### 4.2. Segurança

- [ ] RLS habilitada em **toda** tabela tocada; políticas testadas com usuário deslogado e logado.
- [ ] Service role nunca importada/usada em arquivo `'use client'`.
- [ ] Toda Server Action faz `zod.parse(input)` antes de tocar no banco.
- [ ] Erros do banco são mapeados para mensagens amigáveis em PT-BR — sem stack/PII.
- [ ] Nenhum segredo em `process.env` é exposto via `NEXT_PUBLIC_*` indevidamente.
- [ ] Sem `eval`, `Function()`, `dangerouslySetInnerHTML` sem necessidade explícita.
- [ ] Sem concatenação de SQL — usar query builder do Supabase.
- [ ] CSRF: Server Actions invocadas por `<form action={...}>` ou `useFormState`/`useActionState` (Next.js já cuida do Origin check; checar se não foi burlado).

### 4.3. Manutenibilidade

- [ ] Constantes de domínio em `src/lib/constants/*` — uma fonte de verdade.
- [ ] Schemas zod em `src/lib/validations/*` reutilizados entre form e action.
- [ ] Server Actions agrupadas por domínio em `src/server/actions/*`.
- [ ] Componentes em `src/components/<dominio>/`, com responsabilidade clara.
- [ ] Migrations idempotentes (ou versionadas) e com nome descritivo.
- [ ] `revalidatePath`/`revalidateTag` chamado após mutação para evitar UI stale.
- [ ] README e docs `.md` refletem o estado atual quando algo material muda.

### 4.4. Testes

- [ ] Há teste **da regra**, não só do código. Renomear um valor de enum quebra o teste correspondente.
- [ ] Validators zod críticos têm pelo menos 1 caso "feliz" e 1 "inválido".
- [ ] Lógica derivada (ex.: ordenação de risco, mapeamento `RISK_LEVEL → token`) tem teste.
- [ ] Testes não dependem de banco real (mockar ou usar funções puras).

### 4.5. Operação / observabilidade

- [ ] Erros de Server Action são logados no servidor (sem PII) e retornam mensagem amigável.
- [ ] Variáveis de ambiente novas estão em `.env.example`.
- [ ] Campos sensíveis nunca são logados (senha, token, payload completo).
- [ ] Mudanças que afetam deploy estão refletidas no README (variáveis novas, comandos extras).

## 5. Exemplo de uso (template de relatório)

```
Diff revisado: feat: criar Server Action createUpdate
Arquivos: src/server/actions/updates.ts, src/components/updates/UpdateForm.tsx, src/lib/validations/update.ts

Resumo (1 frase por arquivo):
- updates.ts: insere update validado e revalida path da startup.
- UpdateForm.tsx: form client com react-hook-form + zod.
- validation/update.ts: schema createUpdateSchema.

Checklist:
- 4.1 Qualidade
  - [x] Sem string hardcoded
  - [VIOL/B] Componente UpdateForm tem cor #FBBF24 inline → mover para ui-tokens.ts
- 4.2 Segurança
  - [x] zod.parse OK
  - [x] RLS ativa
  - [x] Sem service role no client
- 4.3 Manutenibilidade [x todos]
- 4.4 Testes [VIOL/D] Falta teste do validador → débito até C8
- 4.5 Operação [x todos]

Decisão: corrigir VIOL/B antes de commit; VIOL/D vai para REVIEW.md.
```

## 6. Anti-checklist (o que esta skill NÃO é)

- Não é code style enforcement (isso é trabalho do linter/Prettier).
- Não é revisão de design visual.
- Não é revisão de UX.
- Não é gate burocrático: deve caber em 5–10 minutos para um diff típico.

## 7. Como evoluir esta skill

Adicionar um novo item à checklist quando:
- Um bug não trivial em produção poderia ter sido pego por um item na checklist.
- Um anti-padrão recorrente apareceu em mais de um diff.
- Uma decisão de arquitetura nova introduziu uma classe de risco antes inexistente.

Remover um item quando:
- Está sempre em **OK** há vários ciclos seguidos (provavelmente o linter/tipos já resolvem).
- Mudou para outro lugar (linter, CI, hook).

## 8. Aplicação neste repositório

- A skill foi aplicada em **cada checkpoint** descrito em [`docs/AI-PLAN.md`](AI-PLAN.md).
- Resultados (violações encontradas e como foram tratadas) ficam registrados em [`docs/REVIEW.md`](REVIEW.md).
- O agente de IA é instruído a auto-revisar o próprio diff usando esta skill antes de entregar.
