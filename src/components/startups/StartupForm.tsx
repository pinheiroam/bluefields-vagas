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
import {
  STARTUP_PHASES_ORDERED,
  STARTUP_PHASE_LABEL,
  type StartupPhase,
} from "@/lib/constants/startup-phases";
import type { ActionResult } from "@/server/actions/result";

import {
  STARTUP_FORM_MODE,
  type StartupFormMode,
} from "./startup-form-mode";

type StartupFormAction = (
  prev: ActionResult<{ id: string }> | null,
  formData: FormData,
) => Promise<ActionResult<{ id: string }>>;

interface ResponsibleOption {
  id: string;
  fullName: string;
}

interface StartupFormProps {
  responsibles: ResponsibleOption[];
  defaultValues?: {
    id?: string;
    name?: string;
    segment?: string;
    phase?: StartupPhase;
    responsibleId?: string;
  };
  mode: StartupFormMode;
  action: StartupFormAction;
}

const initialState: ActionResult<{ id: string }> | null = null;
const PHASE_FIELD_NAME = "phase";
const RESPONSIBLE_FIELD_NAME = "responsibleId";

export function StartupForm({
  responsibles,
  defaultValues,
  mode,
  action,
}: StartupFormProps) {
  const [state, formAction, isPending] = useActionState(action, initialState);
  const fieldErrors = state && !state.ok ? state.fieldErrors : undefined;

  return (
    <form action={formAction} className="space-y-6" noValidate>
      {mode === STARTUP_FORM_MODE.EDIT && defaultValues?.id ? (
        <input type="hidden" name="id" value={defaultValues.id} />
      ) : null}

      <FormField
        label="Nome da startup"
        htmlFor="name"
        required
        error={fieldErrors?.name?.[0]}
      >
        <Input
          id="name"
          name="name"
          defaultValue={defaultValues?.name}
          placeholder="Ex.: Aurora Health"
          required
        />
      </FormField>

      <FormField
        label="Segmento"
        htmlFor="segment"
        required
        error={fieldErrors?.segment?.[0]}
      >
        <Input
          id="segment"
          name="segment"
          defaultValue={defaultValues?.segment}
          placeholder="Ex.: Healthtech"
          required
        />
      </FormField>

      <FormField
        label="Fase"
        htmlFor={PHASE_FIELD_NAME}
        required
        error={fieldErrors?.phase?.[0]}
      >
        <Select name={PHASE_FIELD_NAME} defaultValue={defaultValues?.phase}>
          <SelectTrigger id={PHASE_FIELD_NAME}>
            <SelectValue placeholder="Selecione a fase" />
          </SelectTrigger>
          <SelectContent>
            {STARTUP_PHASES_ORDERED.map((phase) => (
              <SelectItem key={phase} value={phase}>
                {STARTUP_PHASE_LABEL[phase]}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </FormField>

      <FormField
        label="Responsável Bluefields"
        htmlFor={RESPONSIBLE_FIELD_NAME}
        required
        error={fieldErrors?.responsibleId?.[0]}
      >
        <Select
          name={RESPONSIBLE_FIELD_NAME}
          defaultValue={defaultValues?.responsibleId}
        >
          <SelectTrigger id={RESPONSIBLE_FIELD_NAME}>
            <SelectValue placeholder="Selecione o responsável" />
          </SelectTrigger>
          <SelectContent>
            {responsibles.map((person) => (
              <SelectItem key={person.id} value={person.id}>
                {person.fullName}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </FormField>

      <FormStatus state={state} />

      <div className="flex justify-end gap-2">
        <Button type="submit" disabled={isPending}>
          {isPending
            ? "Salvando..."
            : mode === STARTUP_FORM_MODE.CREATE
              ? "Cadastrar startup"
              : "Salvar alterações"}
        </Button>
      </div>
    </form>
  );
}
