import { Card, CardContent } from "@/components/ui/card";
import { PageHeader } from "@/components/layout/PageHeader";
import {
  StartupForm,
  STARTUP_FORM_MODE,
} from "@/components/startups/StartupForm";
import { getCurrentUser } from "@/lib/supabase/auth";
import { listProfiles } from "@/server/queries/startups";

export default async function NewStartupPage() {
  const user = await getCurrentUser();
  const profiles = await listProfiles();

  const responsibles = profiles.map((profile) => ({
    id: profile.id,
    fullName: profile.full_name,
  }));

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
            responsibles={responsibles}
            defaultValues={{ responsibleId: user?.id }}
          />
        </CardContent>
      </Card>
    </div>
  );
}
