import { z } from "zod";

import { INPUT_LIMITS } from "@/lib/constants/input-limits";
import {
  RISK_LEVELS_ORDERED,
  type RiskLevel,
} from "@/lib/constants/risk-levels";

const riskValues = RISK_LEVELS_ORDERED as readonly [RiskLevel, ...RiskLevel[]];

export const createUpdateSchema = z.object({
  startupId: z.string().uuid(),
  updateDate: z
    .string()
    .regex(/^\d{4}-\d{2}-\d{2}$/, "Use o formato AAAA-MM-DD."),
  whatHappened: z
    .string()
    .trim()
    .min(
      INPUT_LIMITS.UPDATE_TEXT_MIN,
      "Descreva brevemente o que aconteceu nesta semana.",
    )
    .max(INPUT_LIMITS.UPDATE_TEXT_MAX, "Texto muito longo."),
  blockers: z
    .string()
    .trim()
    .max(INPUT_LIMITS.UPDATE_TEXT_MAX, "Texto muito longo.")
    .default(""),
  nextSteps: z
    .string()
    .trim()
    .max(INPUT_LIMITS.UPDATE_TEXT_MAX, "Texto muito longo.")
    .default(""),
  risk: z.enum(riskValues, {
    errorMap: () => ({ message: "Selecione um nível de risco válido." }),
  }),
});

export type CreateUpdateInput = z.infer<typeof createUpdateSchema>;
