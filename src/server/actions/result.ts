import type { ZodError } from "zod";

export type FieldErrors = Record<string, string[] | undefined>;

export type ActionSuccess<T = void> = {
  ok: true;
  data: T;
};

export type ActionFailure = {
  ok: false;
  error: string;
  fieldErrors?: FieldErrors;
};

export type ActionResult<T = void> = ActionSuccess<T> | ActionFailure;

export function success<T>(data: T): ActionSuccess<T> {
  return { ok: true, data };
}

export function failure(error: string, fieldErrors?: FieldErrors): ActionFailure {
  return { ok: false, error, fieldErrors };
}

export function fromZodError(error: ZodError): ActionFailure {
  const flat = error.flatten();
  return {
    ok: false,
    error: "Há campos inválidos no formulário.",
    fieldErrors: flat.fieldErrors as FieldErrors,
  };
}
