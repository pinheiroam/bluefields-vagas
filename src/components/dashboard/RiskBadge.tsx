import { cn } from "@/lib/utils";
import {
  NO_RISK_LABEL,
  RISK_LEVEL_LABEL,
  type RiskLevel,
  isRiskLevel,
} from "@/lib/constants/risk-levels";
import { NO_RISK_TONE, RISK_BADGE_TONE } from "@/lib/constants/ui-tokens";

interface RiskBadgeProps {
  risk: RiskLevel | null | undefined;
  className?: string;
}

export function RiskBadge({ risk, className }: RiskBadgeProps) {
  const tone = isRiskLevel(risk) ? RISK_BADGE_TONE[risk] : NO_RISK_TONE;
  const label = isRiskLevel(risk) ? RISK_LEVEL_LABEL[risk] : NO_RISK_LABEL;

  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-medium",
        tone.container,
        className,
      )}
      aria-label={`Risco: ${label}`}
    >
      <span
        className={cn("h-1.5 w-1.5 rounded-full", tone.dot)}
        aria-hidden
      />
      {label}
    </span>
  );
}
