import { describe, expect, it } from "vitest";

import {
  RISK_LEVEL,
  RISK_LEVELS_ORDERED,
  RISK_LEVEL_LABEL,
  getRiskOrder,
  isRiskLevel,
} from "@/lib/constants/risk-levels";

describe("risk-levels", () => {
  it("ordena com vermelho primeiro, depois amarelo, depois verde", () => {
    expect(RISK_LEVELS_ORDERED).toEqual([
      RISK_LEVEL.RED,
      RISK_LEVEL.YELLOW,
      RISK_LEVEL.GREEN,
    ]);
  });

  it("getRiskOrder mantém vermelho > amarelo > verde > nulo", () => {
    expect(getRiskOrder(RISK_LEVEL.RED)).toBeLessThan(
      getRiskOrder(RISK_LEVEL.YELLOW),
    );
    expect(getRiskOrder(RISK_LEVEL.YELLOW)).toBeLessThan(
      getRiskOrder(RISK_LEVEL.GREEN),
    );
    expect(getRiskOrder(RISK_LEVEL.GREEN)).toBeLessThan(getRiskOrder(null));
  });

  it("isRiskLevel reconhece somente os três valores conhecidos", () => {
    expect(isRiskLevel(RISK_LEVEL.GREEN)).toBe(true);
    expect(isRiskLevel(RISK_LEVEL.YELLOW)).toBe(true);
    expect(isRiskLevel(RISK_LEVEL.RED)).toBe(true);
    expect(isRiskLevel("orange")).toBe(false);
    expect(isRiskLevel(null)).toBe(false);
    expect(isRiskLevel(undefined)).toBe(false);
  });

  it("toda chave de RISK_LEVEL tem label em PT-BR", () => {
    for (const level of RISK_LEVELS_ORDERED) {
      expect(RISK_LEVEL_LABEL[level]).toBeTruthy();
    }
  });
});
