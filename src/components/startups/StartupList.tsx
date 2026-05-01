import Link from "next/link";

import { Card, CardContent } from "@/components/ui/card";
import { PhaseBadge } from "@/components/startups/PhaseBadge";
import { RiskBadge } from "@/components/dashboard/RiskBadge";
import { ROUTES } from "@/lib/constants/routes";
import type { StartupOverviewRow } from "@/types/db";
import { formatDate } from "@/lib/utils";

interface StartupListProps {
  items: StartupOverviewRow[];
  emptyMessage?: string;
}

const DEFAULT_EMPTY = "Nenhuma startup encontrada com os filtros atuais.";

export function StartupList({ items, emptyMessage = DEFAULT_EMPTY }: StartupListProps) {
  if (items.length === 0) {
    return (
      <Card>
        <CardContent className="py-10 text-center text-sm text-muted-foreground">
          {emptyMessage}
        </CardContent>
      </Card>
    );
  }

  return (
    <ul className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
      {items.map((startup) => (
        <li key={startup.id}>
          <Link
            href={ROUTES.startup(startup.id)}
            className="group block h-full rounded-lg border bg-card p-4 transition hover:border-primary/40 hover:shadow-sm"
          >
            <div className="flex items-start justify-between gap-2">
              <div className="space-y-1">
                <h3 className="font-medium leading-tight group-hover:text-primary">
                  {startup.name}
                </h3>
                <p className="text-xs text-muted-foreground">{startup.segment}</p>
              </div>
              <RiskBadge risk={startup.current_risk} />
            </div>
            <div className="mt-3 flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
              <PhaseBadge phase={startup.phase} />
              <span>
                Resp.: {startup.responsible_name ?? "—"}
              </span>
              <span>
                Último update: {formatDate(startup.last_update_date)}
              </span>
            </div>
          </Link>
        </li>
      ))}
    </ul>
  );
}
