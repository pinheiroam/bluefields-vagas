import { AppShell } from "@/components/layout/AppShell";
import { requireUser } from "@/lib/supabase/auth";
import { createSupabaseServerClient } from "@/lib/supabase/server";

export default async function ProtectedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await requireUser();
  const supabase = await createSupabaseServerClient();

  const profileResult = await supabase
    .from("profiles")
    .select("full_name, email")
    .eq("id", user.id)
    .maybeSingle();

  const profile = profileResult.data;
  const userName = profile?.full_name ?? profile?.email ?? user.email ?? "Usuário";

  return <AppShell userName={userName}>{children}</AppShell>;
}
