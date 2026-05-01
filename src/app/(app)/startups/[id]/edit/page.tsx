import { notFound } from "next/navigation";

import { Card, CardContent } from "@/components/ui/card";
import { PageHeader } from "@/components/layout/PageHeader";
import {
  StartupForm,
  STARTUP_FORM_MODE,
} from "@/components/startups/StartupForm";
import { getStartup, listProfiles } from "@/server/queries/startups";

interface EditStartupPageProps {
  params: Promise<{ id: string }>;
}

export default async function EditStartupPage({ params }: EditStartupPageProps) {
  const { id } = await params;
  const [startup, profiles] = await Promise.all([
    getStartup(id),
    listProfiles(),
  ]);

  if (!startup) notFound();

  const responsibles = profiles.map((profile) => ({
    id: profile.id,
    fullName: profile.full_name,
  }));

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <PageHeader
        title={`Editar ${startup.name}`}
        description="Atualize as informações básicas desta startup."
      />

      <Card>
        <CardContent className="pt-6">
          <StartupForm
            mode={STARTUP_FORM_MODE.EDIT}
            responsibles={responsibles}
            defaultValues={{
              id: startup.id,
              name: startup.name,
              segment: startup.segment,
              phase: startup.phase,
              responsibleId: startup.responsible_id,
            }}
          />
        </CardContent>
      </Card>
    </div>
  );
}
