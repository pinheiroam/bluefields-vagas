import { Card, CardContent } from "@/components/ui/card";
import { PageHeader } from "@/components/layout/PageHeader";
import { StartupForm } from "@/components/startups/StartupForm";
import { STARTUP_FORM_MODE } from "@/components/startups/startup-form-mode";
import { getCurrentUser } from "@/lib/supabase/auth";
import { createStartupAction } from "@/server/actions/startups";
import { listProfiles } from "@/server/queries/startups";

export default async function NewStartupPage() {
  const user = await getCurrentUser();
  const profiles = await listProfiles();

  const responsibles = profiles.map((profile) => ({
    id: profile.id,
    fullName: profile.full_name,
  }));

  const defaultResponsibleId =
    user?.id && responsibles.some((r) => r.id === user.id)
      ? user.id
      : undefined;

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <PageHeader
        title="Nova startup"
        description="Cadastre uma nova startup do portfólio Bluefields."
      />

      <Card>
        <CardContent className="pt-6">
          <StartupForm
            mode={STARTUP_FORM_MODE.CREATE}
            action={createStartupAction}
            responsibles={responsibles}
            defaultValues={{ responsibleId: defaultResponsibleId }}
          />
        </CardContent>
      </Card>
    </div>
  );
}
