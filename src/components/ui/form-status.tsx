import type { ActionResult } from "@/server/actions/result";

interface FormStatusProps {
  state: ActionResult<unknown> | null;
}

// Mostra a mensagem geral de erro do formulário. Erros por campo são exibidos
// inline pelo `<FormField>` correspondente.
export function FormStatus({ state }: FormStatusProps) {
  if (!state || state.ok) return null;

  return (
    <p className="text-sm text-destructive" role="alert">
      {state.error}
    </p>
  );
}
