import { describe, expect, it } from "vitest";

import {
  STARTUP_PHASE,
  STARTUP_PHASES_ORDERED,
  STARTUP_PHASE_LABEL,
  isStartupPhase,
} from "@/lib/constants/startup-phases";

describe("startup-phases", () => {
  it("ordena fases da mais inicial para a mais avançada", () => {
    expect(STARTUP_PHASES_ORDERED).toEqual([
      STARTUP_PHASE.IDEATION,
      STARTUP_PHASE.MVP,
      STARTUP_PHASE.TRACTION,
      STARTUP_PHASE.SCALE,
    ]);
  });

  it("isStartupPhase reconhece valores conhecidos e rejeita o resto", () => {
    expect(isStartupPhase(STARTUP_PHASE.IDEATION)).toBe(true);
    expect(isStartupPhase(STARTUP_PHASE.SCALE)).toBe(true);
    expect(isStartupPhase("growth")).toBe(false);
    expect(isStartupPhase(undefined)).toBe(false);
  });

  it("toda fase tem label em PT-BR", () => {
    for (const phase of STARTUP_PHASES_ORDERED) {
      expect(STARTUP_PHASE_LABEL[phase]).toBeTruthy();
    }
  });
});
