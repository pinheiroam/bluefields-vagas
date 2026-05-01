"use client";

import { useActionState } from "react";

import { Button } from "@/components/ui/button";
import { FormField } from "@/components/ui/form-field";
import { Input } from "@/components/ui/input";
import { signupAction } from "@/server/actions/auth";
import type { ActionResult } from "@/server/actions/result";

const initialState: ActionResult<null> | null = null;

export function SignupForm() {
  const [state, formAction, isPending] = useActionState(signupAction, initialState);

  const fieldErrors = state && !state.ok ? state.fieldErrors : undefined;

  if (state?.ok) {
    return (
      <div className="rounded-md border border-risk-green/30 bg-risk-green/10 p-4 text-sm text-risk-green">
        Conta criada. Verifique a caixa de e-mail (se a confirmação por e-mail estiver
        ativada no Supabase) e faça login para continuar.
      </div>
    );
  }

  return (
    <form action={formAction} className="space-y-4" noValidate>
      <FormField
        label="Nome completo"
        htmlFor="fullName"
        required
        error={fieldErrors?.fullName?.[0]}
      >
        <Input
          id="fullName"
          name="fullName"
          autoComplete="name"
          placeholder="Maria Silva"
          required
        />
      </FormField>

      <FormField
        label="E-mail"
        htmlFor="signup-email"
        required
        error={fieldErrors?.email?.[0]}
      >
        <Input
          id="signup-email"
          name="email"
          type="email"
          autoComplete="email"
          required
        />
      </FormField>

      <FormField
        label="Senha"
        htmlFor="signup-password"
        required
        error={fieldErrors?.password?.[0]}
        hint="Mínimo de 8 caracteres."
      >
        <Input
          id="signup-password"
          name="password"
          type="password"
          autoComplete="new-password"
          required
        />
      </FormField>

      {state && !state.ok && !state.fieldErrors ? (
        <p className="text-sm text-destructive" role="alert">
          {state.error}
        </p>
      ) : null}

      <Button type="submit" variant="outline" className="w-full" disabled={isPending}>
        {isPending ? "Criando conta..." : "Criar conta"}
      </Button>
    </form>
  );
}
