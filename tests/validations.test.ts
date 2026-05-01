import { describe, expect, it } from "vitest";

import { createStartupSchema } from "@/lib/validations/startup";
import { createUpdateSchema } from "@/lib/validations/update";
import { RISK_LEVEL } from "@/lib/constants/risk-levels";
import { STARTUP_PHASE } from "@/lib/constants/startup-phases";

const VALID_UUID = "11111111-1111-4111-8111-111111111111";
const ANOTHER_UUID = "22222222-2222-4222-8222-222222222222";

describe("createStartupSchema", () => {
  it("aceita payload válido", () => {
    const result = createStartupSchema.safeParse({
      name: "Aurora Health",
      segment: "Healthtech",
      phase: STARTUP_PHASE.MVP,
      responsibleId: VALID_UUID,
    });
    expect(result.success).toBe(true);
  });

  it("rejeita fase desconhecida", () => {
    const result = createStartupSchema.safeParse({
      name: "Aurora Health",
      segment: "Healthtech",
      phase: "growth",
      responsibleId: VALID_UUID,
    });
    expect(result.success).toBe(false);
  });

  it("rejeita responsibleId que não é UUID", () => {
    const result = createStartupSchema.safeParse({
      name: "Aurora Health",
      segment: "Healthtech",
      phase: STARTUP_PHASE.MVP,
      responsibleId: "abc",
    });
    expect(result.success).toBe(false);
  });

  it("rejeita nome curto demais", () => {
    const result = createStartupSchema.safeParse({
      name: "A",
      segment: "Healthtech",
      phase: STARTUP_PHASE.MVP,
      responsibleId: VALID_UUID,
    });
    expect(result.success).toBe(false);
  });
});

describe("createUpdateSchema", () => {
  it("aceita payload válido com risco vermelho", () => {
    const result = createUpdateSchema.safeParse({
      startupId: VALID_UUID,
      updateDate: "2026-05-01",
      whatHappened: "Founder se afastou.",
      blockers: "Equipe parada",
      nextSteps: "Avaliar bridge round",
      risk: RISK_LEVEL.RED,
    });
    expect(result.success).toBe(true);
  });

  it("aplica defaults quando blockers/nextSteps estão ausentes", () => {
    const result = createUpdateSchema.safeParse({
      startupId: ANOTHER_UUID,
      updateDate: "2026-05-01",
      whatHappened: "Tudo certo, sem bloqueios.",
      risk: RISK_LEVEL.GREEN,
    });
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.blockers).toBe("");
      expect(result.data.nextSteps).toBe("");
    }
  });

  it("rejeita data fora do formato AAAA-MM-DD", () => {
    const result = createUpdateSchema.safeParse({
      startupId: VALID_UUID,
      updateDate: "01/05/2026",
      whatHappened: "...",
      risk: RISK_LEVEL.GREEN,
    });
    expect(result.success).toBe(false);
  });

  it("rejeita risco fora dos níveis suportados", () => {
    const result = createUpdateSchema.safeParse({
      startupId: VALID_UUID,
      updateDate: "2026-05-01",
      whatHappened: "...",
      risk: "purple",
    });
    expect(result.success).toBe(false);
  });
});
