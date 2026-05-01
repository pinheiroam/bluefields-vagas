import { createSupabaseServerClient } from "@/lib/supabase/server";
import {
  RISK_LEVELS_ORDERED,
  type RiskLevel,
  isRiskLevel,
} from "@/lib/constants/risk-levels";
import {
  STARTUP_PHASES_ORDERED,
  isStartupPhase,
  type StartupPhase,
} from "@/lib/constants/startup-phases";
import type {
  ProfileRow,
  StartupOverviewRow,
  StartupRow,
  UpdateRow,
} from "@/types/db";

export interface StartupOverviewFilters {
  risk?: RiskLevel | null;
  phase?: StartupPhase | null;
}

export async function listStartupOverviews(
  filters: StartupOverviewFilters = {},
): Promise<StartupOverviewRow[]> {
  const supabase = await createSupabaseServerClient();
  let query = supabase
    .from("startup_overview")
    .select("*")
    .order("name", { ascending: true });

  if (filters.phase && isStartupPhase(filters.phase)) {
    query = query.eq("phase", filters.phase);
  }
  if (filters.risk && isRiskLevel(filters.risk)) {
    query = query.eq("current_risk", filters.risk);
  }

  const { data, error } = await query;
  if (error) {
    console.error("[listStartupOverviews]", error.code, error.message);
    return [];
  }
  return data ?? [];
}

export interface RiskCounts {
  total: number;
  byRisk: Record<RiskLevel, number>;
  noRisk: number;
}

export async function countByRisk(): Promise<RiskCounts> {
  const items = await listStartupOverviews();
  const byRisk = RISK_LEVELS_ORDERED.reduce(
    (acc, level) => {
      acc[level] = 0;
      return acc;
    },
    {} as Record<RiskLevel, number>,
  );
  let noRisk = 0;
  for (const item of items) {
    if (isRiskLevel(item.current_risk)) {
      byRisk[item.current_risk] += 1;
    } else {
      noRisk += 1;
    }
  }
  return { total: items.length, byRisk, noRisk };
}

export async function getStartup(id: string): Promise<StartupRow | null> {
  const supabase = await createSupabaseServerClient();
  const { data, error } = await supabase
    .from("startups")
    .select("*")
    .eq("id", id)
    .maybeSingle();
  if (error) {
    console.error("[getStartup]", error.code, error.message);
    return null;
  }
  return data;
}

export async function getStartupOverview(
  id: string,
): Promise<StartupOverviewRow | null> {
  const supabase = await createSupabaseServerClient();
  const { data, error } = await supabase
    .from("startup_overview")
    .select("*")
    .eq("id", id)
    .maybeSingle();
  if (error) {
    console.error("[getStartupOverview]", error.code, error.message);
    return null;
  }
  return data;
}

export async function listProfiles(): Promise<ProfileRow[]> {
  const supabase = await createSupabaseServerClient();
  const { data, error } = await supabase
    .from("profiles")
    .select("*")
    .order("full_name", { ascending: true });
  if (error) {
    console.error("[listProfiles]", error.code, error.message);
    return [];
  }
  return data ?? [];
}

export type UpdateWithAuthor = UpdateRow & {
  author: Pick<ProfileRow, "full_name"> | null;
};

export async function listUpdatesByStartup(
  startupId: string,
  limit = 50,
): Promise<UpdateWithAuthor[]> {
  const supabase = await createSupabaseServerClient();
  const { data, error } = await supabase
    .from("updates")
    .select("*, author:profiles!updates_author_id_fkey(full_name)")
    .eq("startup_id", startupId)
    .order("update_date", { ascending: false })
    .order("created_at", { ascending: false })
    .limit(limit);
  if (error) {
    console.error("[listUpdatesByStartup]", error.code, error.message);
    return [];
  }
  return (data ?? []) as UpdateWithAuthor[];
}
