import Link from "next/link";
import { Plus } from "lucide-react";

import { Button } from "@/components/ui/button";
import { DashboardFilters } from "@/components/dashboard/DashboardFilters";
import { PageHeader } from "@/components/layout/PageHeader";
import { RiskSummary } from "@/components/dashboard/RiskSummary";
import { StartupList } from "@/components/startups/StartupList";
import { ROUTES } from "@/lib/constants/routes";
import {
  ALL_FILTER_VALUE,
  FILTER_PARAM,
} from "@/lib/constants/input-limits";
import { isRiskLevel } from "@/lib/constants/risk-levels";
import { isStartupPhase } from "@/lib/constants/startup-phases";
import { getSearchParamString } from "@/lib/utils";
import {
  countByRisk,
  listStartupOverviews,
} from "@/server/queries/startups";

interface DashboardPageProps {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}

export default async function DashboardPage({ searchParams }: DashboardPageProps) {
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

  const [counts, items] = await Promise.all([
    countByRisk(),
    listStartupOverviews({ risk, phase }),
  ]);

  return (
    <div className="space-y-6">
      <PageHeader
        title="Dashboard"
        description="Visão consolidada do portfólio acelerado pela Bluefields."
        actions={
          <Button asChild>
            <Link href={ROUTES.STARTUP_NEW}>
              <Plus className="h-4 w-4" />
              Nova startup
            </Link>
          </Button>
        }
      />

      <RiskSummary
        total={counts.total}
        byRisk={counts.byRisk}
        noRisk={counts.noRisk}
      />

      <div className="space-y-3">
        <div className="flex items-center justify-between gap-3">
          <h2 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">
            Startups
          </h2>
          <DashboardFilters />
        </div>
        <StartupList items={items} />
      </div>
    </div>
  );
}
