"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";

import { ROUTES } from "@/lib/constants/routes";
import { ERROR_MESSAGES } from "@/lib/constants/messages";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { loginSchema, signupSchema } from "@/lib/validations/auth";

import { failure, fromZodError, success, type ActionResult } from "./result";

const REDIRECT_KEY = "redirect";

function safeRedirectTarget(value: FormDataEntryValue | null): string {
  if (typeof value !== "string") return ROUTES.DASHBOARD;
  if (!value.startsWith("/") || value.startsWith("//")) return ROUTES.DASHBOARD;
  return value;
}

export async function loginAction(
  _prev: ActionResult<null> | null,
  formData: FormData,
): Promise<ActionResult<null>> {
  const parsed = loginSchema.safeParse({
    email: formData.get("email"),
    password: formData.get("password"),
  });

  if (!parsed.success) return fromZodError(parsed.error);

  const supabase = await createSupabaseServerClient();
  const { error } = await supabase.auth.signInWithPassword(parsed.data);

  if (error) {
    return failure(ERROR_MESSAGES.INVALID_CREDENTIALS);
  }

  const redirectTo = safeRedirectTarget(formData.get(REDIRECT_KEY));

  revalidatePath(ROUTES.DASHBOARD);
  redirect(redirectTo);
}

function mapSignupError(message: string | undefined): string {
  if (!message) return ERROR_MESSAGES.SIGNUP_FAILED;
  const lower = message.toLowerCase();
  if (lower.includes("rate limit")) return ERROR_MESSAGES.EMAIL_RATE_LIMIT;
  return message;
}

export async function signupAction(
  _prev: ActionResult<null> | null,
  formData: FormData,
): Promise<ActionResult<null>> {
  const parsed = signupSchema.safeParse({
    email: formData.get("email"),
    password: formData.get("password"),
    fullName: formData.get("fullName"),
  });

  if (!parsed.success) return fromZodError(parsed.error);

  const supabase = await createSupabaseServerClient();
  const { data, error } = await supabase.auth.signUp({
    email: parsed.data.email,
    password: parsed.data.password,
    options: {
      data: { full_name: parsed.data.fullName },
    },
  });

  if (error) {
    return failure(mapSignupError(error.message));
  }

  // Quando a confirmação por e-mail está desligada no Supabase, o signUp
  // já devolve uma sessão ativa — leve o usuário direto ao dashboard.
  if (data.session) {
    revalidatePath(ROUTES.DASHBOARD);
    redirect(ROUTES.DASHBOARD);
  }

  return success(null);
}

export async function logoutAction(): Promise<void> {
  const supabase = await createSupabaseServerClient();
  await supabase.auth.signOut();
  revalidatePath(ROUTES.HOME);
  redirect(ROUTES.LOGIN);
}
