import type { RiskLevel } from "@/lib/constants/risk-levels";
import type { StartupPhase } from "@/lib/constants/startup-phases";

/**
 * Tipos do schema Supabase mantidos manualmente.
 *
 * Em um projeto maduro, gerar com `supabase gen types typescript --project-id <id>`
 * e substituir este arquivo. Para o MVP mantemos manualmente para não exigir o
 * binário da CLI durante o setup local.
 *
 * O shape (Tables/Views/Functions/Enums/CompositeTypes/Relationships) segue a
 * convenção esperada pelo `@supabase/supabase-js`.
 */
export type Database = {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string;
          full_name: string;
          email: string;
          created_at: string;
        };
        Insert: {
          id: string;
          full_name: string;
          email: string;
          created_at?: string;
        };
        Update: {
          id?: string;
          full_name?: string;
          email?: string;
          created_at?: string;
        };
        Relationships: [];
      };
      startups: {
        Row: {
          id: string;
          name: string;
          segment: string;
          phase: StartupPhase;
          responsible_id: string;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          segment: string;
          phase: StartupPhase;
          responsible_id: string;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          name?: string;
          segment?: string;
          phase?: StartupPhase;
          responsible_id?: string;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: "startups_responsible_id_fkey";
            columns: ["responsible_id"];
            isOneToOne: false;
            referencedRelation: "profiles";
            referencedColumns: ["id"];
          },
        ];
      };
      updates: {
        Row: {
          id: string;
          startup_id: string;
          author_id: string;
          update_date: string;
          what_happened: string;
          blockers: string;
          next_steps: string;
          risk_at_update: RiskLevel;
          created_at: string;
        };
        Insert: {
          id?: string;
          startup_id: string;
          author_id: string;
          update_date?: string;
          what_happened: string;
          blockers?: string;
          next_steps?: string;
          risk_at_update: RiskLevel;
          created_at?: string;
        };
        Update: {
          id?: string;
          startup_id?: string;
          author_id?: string;
          update_date?: string;
          what_happened?: string;
          blockers?: string;
          next_steps?: string;
          risk_at_update?: RiskLevel;
          created_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: "updates_startup_id_fkey";
            columns: ["startup_id"];
            isOneToOne: false;
            referencedRelation: "startups";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "updates_author_id_fkey";
            columns: ["author_id"];
            isOneToOne: false;
            referencedRelation: "profiles";
            referencedColumns: ["id"];
          },
        ];
      };
    };
    Views: {
      startup_overview: {
        Row: {
          id: string;
          name: string;
          segment: string;
          phase: StartupPhase;
          responsible_id: string;
          responsible_name: string | null;
          created_at: string;
          updated_at: string;
          current_risk: RiskLevel | null;
          last_update_date: string | null;
          last_update_id: string | null;
        };
        Relationships: [];
      };
    };
    Functions: {
      [_ in never]: never;
    };
    Enums: {
      [_ in never]: never;
    };
    CompositeTypes: {
      [_ in never]: never;
    };
  };
};

export type StartupRow = Database["public"]["Tables"]["startups"]["Row"];
export type UpdateRow = Database["public"]["Tables"]["updates"]["Row"];
export type ProfileRow = Database["public"]["Tables"]["profiles"]["Row"];
export type StartupOverviewRow = Database["public"]["Views"]["startup_overview"]["Row"];
