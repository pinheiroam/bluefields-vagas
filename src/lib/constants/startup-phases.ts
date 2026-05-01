export const STARTUP_PHASE = {
  IDEATION: "ideation",
  MVP: "mvp",
  TRACTION: "traction",
  SCALE: "scale",
} as const;

export type StartupPhase = (typeof STARTUP_PHASE)[keyof typeof STARTUP_PHASE];

export const STARTUP_PHASES_ORDERED: readonly StartupPhase[] = [
  STARTUP_PHASE.IDEATION,
  STARTUP_PHASE.MVP,
  STARTUP_PHASE.TRACTION,
  STARTUP_PHASE.SCALE,
] as const;

export const STARTUP_PHASE_LABEL: Record<StartupPhase, string> = {
  [STARTUP_PHASE.IDEATION]: "Ideação",
  [STARTUP_PHASE.MVP]: "MVP",
  [STARTUP_PHASE.TRACTION]: "Tração",
  [STARTUP_PHASE.SCALE]: "Escala",
};

export function isStartupPhase(value: unknown): value is StartupPhase {
  return STARTUP_PHASES_ORDERED.includes(value as StartupPhase);
}
