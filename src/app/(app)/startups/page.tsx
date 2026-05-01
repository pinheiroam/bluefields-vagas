import Link from "next/link";
import { Plus } from "lucide-react";

import { Button } from "@/components/ui/button";
import { PageHeader } from "@/components/layout/PageHeader";
import { StartupList } from "@/components/startups/StartupList";
import { DashboardFilters } from "@/components/dashboard/DashboardFilters";
import { ROUTES } from "@/lib/constants/routes";
import {
  ALL_FILTER_VALUE,
  FILTER_PARAM,
} from "@/lib/constants/input-limits";
import { isRiskLevel } from "@/lib/constants/risk-levels";
import { isStartupPhase } from "@/lib/constants/startup-phases";
import { getSearchParamString } from "@/lib/utils";
import { listStartupOverviews } from "@/server/queries/startups";

interface StartupsPageProps {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}

export default async function StartupsPage({ searchParams }: StartupsPageProps) {
  const params = await searchParams;
  const riskParam = getSearchParamString(params[FILTER_PARAM.RISK]);
  const phaseParam = getSearchParamString(params[FILTER_PARAM.PHASE]);

  const risk =
    riskParam && riskParam !== ALL_FILTER_VALUE && isRiskLevel(riskParam)
      ? riskParam
      : null;
  const phase =
    phaseParam && phaseParam !== ALL_FILTER_VALUE && isStartupPhase(phaseParam)
      ? phaseParam
      : null;

  const items = await listStartupOverviews({ risk, phase });

  return (
    <div className="space-y-6">
      <PageHeader
        title="Startups"
        description="Todas as startups acompanhadas pelo time."
        actions={
          <Button asChild>
            <Link href={ROUTES.STARTUP_NEW}>
              <Plus className="h-4 w-4" />
              Nova startup
            </Link>
          </Button>
        }
      />

      <DashboardFilters />

      <StartupList items={items} />
    </div>
  );
}
