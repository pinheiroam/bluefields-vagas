import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import {
  RISK_LEVELS_ORDERED,
  RISK_LEVEL_DESCRIPTION,
  RISK_LEVEL_LABEL,
  type RiskLevel,
} from "@/lib/constants/risk-levels";
import { RISK_SUMMARY_TONE } from "@/lib/constants/ui-tokens";

interface RiskSummaryProps {
  total: number;
  byRisk: Record<RiskLevel, number>;
  noRisk: number;
}

export function RiskSummary({ total, byRisk, noRisk }: RiskSummaryProps) {
  return (
    <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
      <Card>
        <CardContent className="space-y-1 p-4">
          <p className="text-xs uppercase tracking-wide text-muted-foreground">
            Startups acompanhadas
          </p>
          <p className="text-3xl font-semibold">{total}</p>
          <p className="text-xs text-muted-foreground">
            {noRisk > 0
              ? `${noRisk} sem update registrado`
              : "Todas com pelo menos um update"}
          </p>
        </CardContent>
      </Card>

      {RISK_LEVELS_ORDERED.map((level) => (
        <Card
          key={level}
          className={cn("border-2 transition", RISK_SUMMARY_TONE[level])}
        >
          <CardContent className="space-y-1 p-4">
            <p className="text-xs uppercase tracking-wide text-muted-foreground">
              Risco {RISK_LEVEL_LABEL[level]}
            </p>
            <p className="text-3xl font-semibold">{byRisk[level]}</p>
            <p className="text-xs text-muted-foreground">
              {RISK_LEVEL_DESCRIPTION[level]}
            </p>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
