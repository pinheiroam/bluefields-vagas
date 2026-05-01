import { redirect } from "next/navigation";
import type { User } from "@supabase/supabase-js";

import { ROUTES } from "@/lib/constants/routes";
import { createSupabaseServerClient } from "@/lib/supabase/server";

// Retorna o usuário autenticado pelos cookies da requisição, ou null se não houver sessão.
// Use em Server Components / Server Actions que precisam saber se há usuário,
// mas que **não** querem disparar redirect automaticamente.
export async function getCurrentUser(): Promise<User | null> {
  const supabase = await createSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  return user;
}

// Retorna o usuário autenticado ou redireciona para a tela de login.
// Use em Server Components / layouts protegidos onde a presença do usuário é obrigatória.
export async function requireUser(): Promise<User> {
  const user = await getCurrentUser();
  if (!user) redirect(ROUTES.LOGIN);
  return user;
}
