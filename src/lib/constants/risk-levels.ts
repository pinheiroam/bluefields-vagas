export const RISK_LEVEL = {
  GREEN: "green",
  YELLOW: "yellow",
  RED: "red",
} as const;

export type RiskLevel = (typeof RISK_LEVEL)[keyof typeof RISK_LEVEL];

export const RISK_LEVELS_ORDERED: readonly RiskLevel[] = [
  RISK_LEVEL.RED,
  RISK_LEVEL.YELLOW,
  RISK_LEVEL.GREEN,
] as const;

export const RISK_LEVEL_LABEL: Record<RiskLevel, string> = {
  [RISK_LEVEL.GREEN]: "Verde",
  [RISK_LEVEL.YELLOW]: "Amarelo",
  [RISK_LEVEL.RED]: "Vermelho",
};

export const RISK_LEVEL_DESCRIPTION: Record<RiskLevel, string> = {
  [RISK_LEVEL.GREEN]: "Tudo correndo bem, sem necessidade de atenção imediata.",
  [RISK_LEVEL.YELLOW]: "Sinais de atenção, vale acompanhar de perto na próxima semana.",
  [RISK_LEVEL.RED]: "Risco crítico, requer ação prioritária do time Bluefields.",
};

export const NO_RISK_LABEL = "Sem informação";

export function isRiskLevel(value: unknown): value is RiskLevel {
  return (
    value === RISK_LEVEL.GREEN ||
    value === RISK_LEVEL.YELLOW ||
    value === RISK_LEVEL.RED
  );
}

export function getRiskOrder(level: RiskLevel | null | undefined): number {
  if (level === RISK_LEVEL.RED) return 0;
  if (level === RISK_LEVEL.YELLOW) return 1;
  if (level === RISK_LEVEL.GREEN) return 2;
  return 3;
}
