import Link from "next/link";
import { notFound } from "next/navigation";
import { Pencil, Trash2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { PageHeader } from "@/components/layout/PageHeader";
import { PhaseBadge } from "@/components/startups/PhaseBadge";
import { RiskBadge } from "@/components/dashboard/RiskBadge";
import { UpdateForm } from "@/components/updates/UpdateForm";
import { UpdatesTimeline } from "@/components/updates/UpdatesTimeline";
import { ROUTES } from "@/lib/constants/routes";
import { formatDate, todayIso } from "@/lib/utils";
import { deleteStartupAction } from "@/server/actions/startups";
import {
  getStartupOverview,
  listUpdatesByStartup,
} from "@/server/queries/startups";

interface StartupDetailPageProps {
  params: Promise<{ id: string }>;
}

export default async function StartupDetailPage({
  params,
}: StartupDetailPageProps) {
  const { id } = await params;
  const [overview, updates] = await Promise.all([
    getStartupOverview(id),
    listUpdatesByStartup(id),
  ]);

  if (!overview) notFound();

  return (
    <div className="space-y-6">
      <PageHeader
        title={overview.name}
        description={`Segmento: ${overview.segment}`}
        actions={
          <div className="flex items-center gap-2">
            <Button asChild variant="outline" size="sm">
              <Link href={ROUTES.startupEdit(overview.id)}>
                <Pencil className="h-4 w-4" />
                Editar
              </Link>
            </Button>
            <form action={deleteStartupAction}>
              <input type="hidden" name="id" value={overview.id} />
              <Button
                type="submit"
                variant="ghost"
                size="sm"
                className="text-destructive hover:text-destructive"
              >
                <Trash2 className="h-4 w-4" />
                Excluir
              </Button>
            </form>
          </div>
        }
      />

      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <SummaryStat label="Fase atual">
          <PhaseBadge phase={overview.phase} />
        </SummaryStat>
        <SummaryStat label="Risco atual">
          <RiskBadge risk={overview.current_risk} />
        </SummaryStat>
        <SummaryStat label="Responsável">
          <span className="text-sm">{overview.responsible_name ?? "—"}</span>
        </SummaryStat>
        <SummaryStat label="Último update">
          <span className="text-sm">{formatDate(overview.last_update_date)}</span>
        </SummaryStat>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Registrar update</CardTitle>
        </CardHeader>
        <CardContent>
          <UpdateForm startupId={overview.id} defaultDate={todayIso()} />
        </CardContent>
      </Card>

      <section className="space-y-3">
        <h2 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">
          Histórico
        </h2>
        <UpdatesTimeline updates={updates} />
      </section>
    </div>
  );
}

function SummaryStat({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <Card>
      <CardContent className="space-y-1 p-4">
        <p className="text-xs uppercase tracking-wide text-muted-foreground">
          {label}
        </p>
        <div>{children}</div>
      </CardContent>
    </Card>
  );
}
