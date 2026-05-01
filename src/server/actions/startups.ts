"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import { ROUTES } from "@/lib/constants/routes";
import { ERROR_MESSAGES } from "@/lib/constants/messages";
import { getCurrentUser } from "@/lib/supabase/auth";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import {
  createStartupSchema,
  updateStartupSchema,
} from "@/lib/validations/startup";

import {
  failure,
  fromZodError,
  success,
  type ActionResult,
} from "./result";

function readStartupForm(formData: FormData) {
  return {
    name: formData.get("name"),
    segment: formData.get("segment"),
    phase: formData.get("phase"),
    responsibleId: formData.get("responsibleId"),
  };
}

export async function createStartupAction(
  _prev: ActionResult<{ id: string }> | null,
  formData: FormData,
): Promise<ActionResult<{ id: string }>> {
  const parsed = createStartupSchema.safeParse(readStartupForm(formData));
  if (!parsed.success) return fromZodError(parsed.error);

  const user = await getCurrentUser();
  if (!user) return failure(ERROR_MESSAGES.UNAUTHENTICATED);

  const supabase = await createSupabaseServerClient();
  const { data, error } = await supabase
    .from("startups")
    .insert({
      name: parsed.data.name,
      segment: parsed.data.segment,
      phase: parsed.data.phase,
      responsible_id: parsed.data.responsibleId,
    })
    .select("id")
    .single();

  if (error || !data) {
    console.error("[createStartupAction]", error?.code, error?.message);
    return failure(ERROR_MESSAGES.GENERIC);
  }

  revalidatePath(ROUTES.STARTUPS);
  revalidatePath(ROUTES.DASHBOARD);
  redirect(ROUTES.startup(data.id));
}

export async function updateStartupAction(
  _prev: ActionResult<{ id: string }> | null,
  formData: FormData,
): Promise<ActionResult<{ id: string }>> {
  const parsed = updateStartupSchema.safeParse({
    id: formData.get("id"),
    ...readStartupForm(formData),
  });
  if (!parsed.success) return fromZodError(parsed.error);

  const supabase = await createSupabaseServerClient();
  const { error } = await supabase
    .from("startups")
    .update({
      name: parsed.data.name,
      segment: parsed.data.segment,
      phase: parsed.data.phase,
      responsible_id: parsed.data.responsibleId,
    })
    .eq("id", parsed.data.id);

  if (error) {
    console.error("[updateStartupAction]", error.code, error.message);
    return failure(ERROR_MESSAGES.GENERIC);
  }

  revalidatePath(ROUTES.STARTUPS);
  revalidatePath(ROUTES.DASHBOARD);
  revalidatePath(ROUTES.startup(parsed.data.id));
  redirect(ROUTES.startup(parsed.data.id));
}

export async function deleteStartupAction(formData: FormData): Promise<void> {
  const id = formData.get("id");
  if (typeof id !== "string" || id.length === 0) return;

  const supabase = await createSupabaseServerClient();
  const { error } = await supabase.from("startups").delete().eq("id", id);

  if (error) {
    console.error("[deleteStartupAction]", error.code, error.message);
    return;
  }

  revalidatePath(ROUTES.STARTUPS);
  revalidatePath(ROUTES.DASHBOARD);
  redirect(ROUTES.STARTUPS);
}

export async function returnSuccess(): Promise<ActionResult<null>> {
  return success(null);
}
