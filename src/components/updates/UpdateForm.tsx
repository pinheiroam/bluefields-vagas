"use client";

import { useActionState } from "react";

import { Button } from "@/components/ui/button";
import { FormField } from "@/components/ui/form-field";
import { FormStatus } from "@/components/ui/form-status";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import {
  RISK_LEVELS_ORDERED,
  RISK_LEVEL,
  RISK_LEVEL_DESCRIPTION,
  RISK_LEVEL_LABEL,
} from "@/lib/constants/risk-levels";
import { createUpdateAction } from "@/server/actions/updates";
import type { ActionResult } from "@/server/actions/result";

interface UpdateFormProps {
  startupId: string;
  defaultDate: string;
}

const initialState: ActionResult<{ id: string }> | null = null;

export function UpdateForm({ startupId, defaultDate }: UpdateFormProps) {
  const [state, formAction, isPending] = useActionState(
    createUpdateAction,
    initialState,
  );
  const fieldErrors = state && !state.ok ? state.fieldErrors : undefined;

  return (
    <form action={formAction} className="space-y-4" noValidate>
      <input type="hidden" name="startupId" value={startupId} />

      <div className="grid gap-4 sm:grid-cols-[160px_1fr]">
        <FormField
          label="Data"
          htmlFor="updateDate"
          required
          error={fieldErrors?.updateDate?.[0]}
        >
          <Input
            id="updateDate"
            name="updateDate"
            type="date"
            defaultValue={defaultDate}
            required
          />
        </FormField>

        <FormField
          label="Nível de risco"
          htmlFor="risk"
          required
          error={fieldErrors?.risk?.[0]}
          hint={RISK_LEVEL_DESCRIPTION[RISK_LEVEL.YELLOW]}
        >
          <Select name="risk" defaultValue={RISK_LEVEL.GREEN}>
            <SelectTrigger id="risk">
              <SelectValue placeholder="Selecione o risco" />
            </SelectTrigger>
            <SelectContent>
              {RISK_LEVELS_ORDERED.map((level) => (
                <SelectItem key={level} value={level}>
                  {RISK_LEVEL_LABEL[level]}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </FormField>
      </div>

      <FormField
        label="O que aconteceu nesta semana?"
        htmlFor="whatHappened"
        required
        error={fieldErrors?.whatHappened?.[0]}
      >
        <Textarea
          id="whatHappened"
          name="whatHappened"
          rows={3}
          placeholder="Resumo do que aconteceu, conquistas, marcos atingidos..."
          required
        />
      </FormField>

      <FormField
        label="Bloqueios"
        htmlFor="blockers"
        error={fieldErrors?.blockers?.[0]}
        hint="Opcional. Descreva impedimentos ou riscos relevantes."
      >
        <Textarea
          id="blockers"
          name="blockers"
          rows={3}
          placeholder="Ex.: integração travada com fornecedor X."
        />
      </FormField>

      <FormField
        label="Próximos passos"
        htmlFor="nextSteps"
        error={fieldErrors?.nextSteps?.[0]}
        hint="Opcional. O que está combinado para a próxima semana?"
      >
        <Textarea
          id="nextSteps"
          name="nextSteps"
          rows={3}
          placeholder="Ex.: validar pricing com 3 leads."
        />
      </FormField>

      <FormStatus state={state} />

      <div className="flex justify-end">
        <Button type="submit" disabled={isPending}>
          {isPending ? "Salvando..." : "Registrar update"}
        </Button>
      </div>
    </form>
  );
}
