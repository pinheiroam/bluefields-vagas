export const STARTUP_FORM_MODE = {
  CREATE: "create",
  EDIT: "edit",
} as const;

export type StartupFormMode =
  (typeof STARTUP_FORM_MODE)[keyof typeof STARTUP_FORM_MODE];
