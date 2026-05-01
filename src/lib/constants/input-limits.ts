export const INPUT_LIMITS = {
  STARTUP_NAME_MIN: 2,
  STARTUP_NAME_MAX: 120,
  SEGMENT_MIN: 2,
  SEGMENT_MAX: 80,
  UPDATE_TEXT_MIN: 3,
  UPDATE_TEXT_MAX: 2000,
  PROFILE_NAME_MIN: 2,
  PROFILE_NAME_MAX: 120,
  PASSWORD_MIN: 8,
  PASSWORD_MAX: 128,
} as const;

export const FILTER_PARAM = {
  RISK: "risk",
  PHASE: "phase",
  Q: "q",
} as const;

export const ALL_FILTER_VALUE = "all";

export const DEFAULT_TIMELINE_LIMIT = 50;
