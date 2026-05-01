import { z } from "zod";

import { INPUT_LIMITS } from "@/lib/constants/input-limits";
import {
  STARTUP_PHASES_ORDERED,
  type StartupPhase,
} from "@/lib/constants/startup-phases";

const phaseValues = STARTUP_PHASES_ORDERED as readonly [StartupPhase, ...StartupPhase[]];

export const startupBaseSchema = z.object({
  name: z
    .string()
    .trim()
    .min(
      INPUT_LIMITS.STARTUP_NAME_MIN,
      `O nome deve ter pelo menos ${INPUT_LIMITS.STARTUP_NAME_MIN} caracteres.`,
    )
    .max(INPUT_LIMITS.STARTUP_NAME_MAX, "Nome muito longo."),
  segment: z
    .string()
    .trim()
    .min(
      INPUT_LIMITS.SEGMENT_MIN,
      `O segmento deve ter pelo menos ${INPUT_LIMITS.SEGMENT_MIN} caracteres.`,
    )
    .max(INPUT_LIMITS.SEGMENT_MAX, "Segmento muito longo."),
  phase: z.enum(phaseValues, {
    errorMap: () => ({ message: "Selecione uma fase válida." }),
  }),
  responsibleId: z.string().uuid({ message: "Selecione um responsável válido." }),
});

export const createStartupSchema = startupBaseSchema;
export const updateStartupSchema = startupBaseSchema.extend({
  id: z.string().uuid(),
});

export type CreateStartupInput = z.infer<typeof createStartupSchema>;
export type UpdateStartupInput = z.infer<typeof updateStartupSchema>;
