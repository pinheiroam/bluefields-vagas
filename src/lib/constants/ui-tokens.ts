import { RISK_LEVEL, type RiskLevel } from "@/lib/constants/risk-levels";

export const RISK_BADGE_TONE: Record<
  RiskLevel,
  { container: string; dot: string; text: string }
> = {
  [RISK_LEVEL.GREEN]: {
    container: "bg-risk-green/10 text-risk-green border border-risk-green/30",
    dot: "bg-risk-green",
    text: "text-risk-green",
  },
  [RISK_LEVEL.YELLOW]: {
    container: "bg-risk-yellow/10 text-risk-yellow border border-risk-yellow/30",
    dot: "bg-risk-yellow",
    text: "text-risk-yellow",
  },
  [RISK_LEVEL.RED]: {
    container: "bg-risk-red/10 text-risk-red border border-risk-red/30",
    dot: "bg-risk-red",
    text: "text-risk-red",
  },
};

export const NO_RISK_TONE = {
  container: "bg-muted text-muted-foreground border border-border",
  dot: "bg-muted-foreground",
  text: "text-muted-foreground",
};

export const RISK_SUMMARY_TONE: Record<RiskLevel, string> = {
  [RISK_LEVEL.GREEN]: "border-risk-green/40 bg-risk-green/5",
  [RISK_LEVEL.YELLOW]: "border-risk-yellow/40 bg-risk-yellow/5",
  [RISK_LEVEL.RED]: "border-risk-red/40 bg-risk-red/5",
};

export const TIMELINE_DOT_TONE: Record<RiskLevel, string> = {
  [RISK_LEVEL.GREEN]: "bg-risk-green",
  [RISK_LEVEL.YELLOW]: "bg-risk-yellow",
  [RISK_LEVEL.RED]: "bg-risk-red",
};
