"use client";

import { useRouter, useSearchParams, usePathname } from "next/navigation";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  ALL_FILTER_VALUE,
  FILTER_PARAM,
} from "@/lib/constants/input-limits";
import {
  RISK_LEVELS_ORDERED,
  RISK_LEVEL_LABEL,
} from "@/lib/constants/risk-levels";
import {
  STARTUP_PHASES_ORDERED,
  STARTUP_PHASE_LABEL,
} from "@/lib/constants/startup-phases";

const FILTER_LABELS = {
  risk: "Risco",
  phase: "Fase",
} as const;

export function DashboardFilters() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const currentRisk = searchParams.get(FILTER_PARAM.RISK) ?? ALL_FILTER_VALUE;
  const currentPhase = searchParams.get(FILTER_PARAM.PHASE) ?? ALL_FILTER_VALUE;

  function updateParam(key: string, value: string) {
    const params = new URLSearchParams(searchParams.toString());
    if (value === ALL_FILTER_VALUE) {
      params.delete(key);
    } else {
      params.set(key, value);
    }
    const query = params.toString();
    router.push(query ? `${pathname}?${query}` : pathname);
  }

  return (
    <div className="flex flex-wrap items-center gap-3">
      <div className="min-w-[180px]">
        <Select
          value={currentRisk}
          onValueChange={(value) => updateParam(FILTER_PARAM.RISK, value)}
        >
          <SelectTrigger>
            <SelectValue placeholder={FILTER_LABELS.risk} />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value={ALL_FILTER_VALUE}>Todos os riscos</SelectItem>
            {RISK_LEVELS_ORDERED.map((level) => (
              <SelectItem key={level} value={level}>
                {RISK_LEVEL_LABEL[level]}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="min-w-[180px]">
        <Select
          value={currentPhase}
          onValueChange={(value) => updateParam(FILTER_PARAM.PHASE, value)}
        >
          <SelectTrigger>
            <SelectValue placeholder={FILTER_LABELS.phase} />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value={ALL_FILTER_VALUE}>Todas as fases</SelectItem>
            {STARTUP_PHASES_ORDERED.map((phase) => (
              <SelectItem key={phase} value={phase}>
                {STARTUP_PHASE_LABEL[phase]}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </div>
  );
}
