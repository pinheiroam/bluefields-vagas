"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import { ROUTES } from "@/lib/constants/routes";
import { ERROR_MESSAGES } from "@/lib/constants/messages";
import { getCurrentUser } from "@/lib/supabase/auth";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { createUpdateSchema } from "@/lib/validations/update";

import {
  failure,
  fromZodError,
  type ActionResult,
} from "./result";

export async function createUpdateAction(
  _prev: ActionResult<{ id: string }> | null,
  formData: FormData,
): Promise<ActionResult<{ id: string }>> {
  const parsed = createUpdateSchema.safeParse({
    startupId: formData.get("startupId"),
    updateDate: formData.get("updateDate"),
    whatHappened: formData.get("whatHappened"),
    blockers: formData.get("blockers") ?? "",
    nextSteps: formData.get("nextSteps") ?? "",
    risk: formData.get("risk"),
  });

  if (!parsed.success) return fromZodError(parsed.error);

  const user = await getCurrentUser();
  if (!user) return failure(ERROR_MESSAGES.UNAUTHENTICATED);

  const supabase = await createSupabaseServerClient();
  const { data, error } = await supabase
    .from("updates")
    .insert({
      startup_id: parsed.data.startupId,
      author_id: user.id,
      update_date: parsed.data.updateDate,
      what_happened: parsed.data.whatHappened,
      blockers: parsed.data.blockers,
      next_steps: parsed.data.nextSteps,
      risk_at_update: parsed.data.risk,
    })
    .select("id")
    .single();

  if (error || !data) {
    console.error("[createUpdateAction]", error?.code, error?.message);
    return failure(ERROR_MESSAGES.GENERIC);
  }

  revalidatePath(ROUTES.startup(parsed.data.startupId));
  revalidatePath(ROUTES.DASHBOARD);
  revalidatePath(ROUTES.STARTUPS);
  redirect(ROUTES.startup(parsed.data.startupId));
}

export async function deleteUpdateAction(formData: FormData): Promise<void> {
  const id = formData.get("id");
  const startupId = formData.get("startupId");
  if (typeof id !== "string" || typeof startupId !== "string") return;

  const supabase = await createSupabaseServerClient();
  const { error } = await supabase.from("updates").delete().eq("id", id);

  if (error) {
    console.error("[deleteUpdateAction]", error.code, error.message);
    return;
  }

  revalidatePath(ROUTES.startup(startupId));
  revalidatePath(ROUTES.DASHBOARD);
  revalidatePath(ROUTES.STARTUPS);
  redirect(ROUTES.startup(startupId));
}
