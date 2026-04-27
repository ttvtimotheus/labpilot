export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[];

type TableDefinition<Row, Insert = Partial<Row>, Update = Partial<Row>> = {
  Row: Row;
  Insert: Insert;
  Update: Update;
  Relationships: [];
};

type OwnedRow = {
  id: string;
  user_id: string;
  created_at: string | null;
  updated_at: string | null;
};

type PublicOwnedRow = OwnedRow & {
  is_public: boolean | null;
};

export interface Database {
  public: {
    Tables: {
      profiles: TableDefinition<{
        id: string;
        display_name: string | null;
        role: 'azubi' | 'mtla' | 'lehrer' | 'andere' | null;
        ausbildungsjahr: number | null;
        preferred_language: string | null;
        created_at: string | null;
        updated_at: string | null;
      }>;
      timer_templates: TableDefinition<PublicOwnedRow & {
        name: string;
        duration_seconds: number;
        bereich: string | null;
        description: string | null;
      }>;
      timer_runs: TableDefinition<OwnedRow & {
        template_id: string | null;
        name: string;
        duration_seconds: number;
        started_at: string;
        completed_at: string | null;
        cancelled: boolean | null;
      }>;
      protokolle: TableDefinition<PublicOwnedRow & {
        name: string;
        bereich: string;
        description: string | null;
        steps: Json;
        source: string | null;
      }>;
      protokoll_runs: TableDefinition<OwnedRow & {
        protokoll_id: string | null;
        protokoll_snapshot: Json;
        started_at: string;
        completed_at: string | null;
        notes: string | null;
      }>;
      kolonie_counts: TableDefinition<OwnedRow & {
        name: string | null;
        patient_id_local: string | null;
        agar_type: string | null;
        dilution: string | null;
        counts: Json;
        total_cfu: number | null;
        notes: string | null;
        photo_path: string | null;
      }>;
      differential_counts: TableDefinition<OwnedRow & {
        name: string | null;
        patient_id_local: string | null;
        counts: Json;
        total_cells: number;
        notes: string | null;
      }>;
      subscriptions: TableDefinition<{
        user_id: string;
        revenuecat_app_user_id: string;
        active_entitlements: string[] | null;
        expires_at: string | null;
        product_id: string | null;
        store: 'app_store' | 'play_store' | 'stripe' | null;
        updated_at: string | null;
      }>;
    };
    Views: Record<string, never>;
    Functions: Record<string, never>;
    Enums: Record<string, never>;
    CompositeTypes: Record<string, never>;
  };
}
