export const ROUTES = {
  HOME: "/",
  LOGIN: "/login",
  DASHBOARD: "/dashboard",
  STARTUPS: "/startups",
  STARTUP_NEW: "/startups/new",
  startup: (id: string) => `/startups/${id}` as const,
  startupEdit: (id: string) => `/startups/${id}/edit` as const,
  startupNewUpdate: (id: string) => `/startups/${id}/updates/new` as const,
} as const;

export const PROTECTED_PATH_PREFIXES: readonly string[] = [
  ROUTES.DASHBOARD,
  ROUTES.STARTUPS,
] as const;

export const PUBLIC_PATHS: readonly string[] = [ROUTES.LOGIN] as const;
