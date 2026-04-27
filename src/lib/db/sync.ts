import { capture } from '@/src/lib/analytics';
import { isSupabaseConfigured } from '@/src/lib/env';
import { appStorage } from '@/src/lib/storage/mmkv';
import { supabase } from '@/src/lib/supabase/client';

const syncTables = ['timer_templates', 'protokolle', 'kolonie_counts', 'differential_counts'] as const;

export async function syncAll(userId: string) {
  if (!isSupabaseConfigured || userId === 'local-user') {
    return { skipped: true, reason: 'offline-or-unconfigured' } as const;
  }

  const startedAt = Date.now();

  for (const table of syncTables) {
    const lastSync = appStorage.getString(`sync.${table}.last`) ?? new Date(0).toISOString();
    const { error } = await supabase.from(table).select('id, updated_at').eq('user_id', userId).gt('updated_at', lastSync).limit(1);

    if (error) throw error;
    appStorage.set(`sync.${table}.last`, new Date().toISOString());
  }

  capture('sync_completed', { table_count: syncTables.length, duration_ms: Date.now() - startedAt });
  return { skipped: false } as const;
}
