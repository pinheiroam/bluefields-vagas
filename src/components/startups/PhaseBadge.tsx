import { cn } from "@/lib/utils";
import {
  STARTUP_PHASE_LABEL,
  isStartupPhase,
  type StartupPhase,
} from "@/lib/constants/startup-phases";

interface PhaseBadgeProps {
  phase: StartupPhase | string | null | undefined;
  className?: string;
}

export function PhaseBadge({ phase, className }: PhaseBadgeProps) {
  const label = isStartupPhase(phase) ? STARTUP_PHASE_LABEL[phase] : "—";
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-md border border-border bg-secondary px-2 py-0.5 text-xs font-medium text-secondary-foreground",
        className,
      )}
    >
      {label}
    </span>
  );
}
