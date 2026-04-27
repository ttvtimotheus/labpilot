import { capture } from '@/src/lib/analytics';
import {
  getPendingLocalChangeSummary,
  getPendingLocalRows,
  markLocalRowsSynced,
  removeLocalRows,
  upsertPulledDifferentialCount,
  upsertPulledKolonieCount,
  upsertPulledProtokoll,
  upsertPulledProtokollRun,
  upsertPulledTimerRun,
  upsertPulledTimerTemplate,
} from '@/src/lib/db/localPersistence';
import {
  differentialCountRemotePayload,
  isLocalPendingDelete,
  kolonieCountRemotePayload,
  localRowId,
  protokollRemotePayload,
  protokollRunRemotePayload,
  timerRunRemotePayload,
  timerTemplateRemotePayload,
  type LocalRow,
} from '@/src/lib/db/remotePayloads';
import { getRemoteWatermark, shouldSkipLocalPushForRemote, syncStorageKey, syncTables, type RemoteSyncMetadata, type SyncTable } from '@/src/lib/db/syncModel';
import { isSupabaseConfigured } from '@/src/lib/env';
import { appStorage } from '@/src/lib/storage/mmkv';
import { supabase } from '@/src/lib/supabase/client';

type ChangeSummary = Record<SyncTable, number>;

function emptySummary(): ChangeSummary {
  return Object.fromEntries(syncTables.map((table) => [table, 0])) as ChangeSummary;
}

function sumSummary(summary: ChangeSummary) {
  return Object.values(summary).reduce((sum, count) => sum + count, 0);
}

async function deleteRemoteRow(table: SyncTable, id: string, userId: string) {
  if (table === 'timer_templates') return supabase.from('timer_templates').delete().eq('id', id).eq('user_id', userId);
  if (table === 'timer_runs') return supabase.from('timer_runs').delete().eq('id', id).eq('user_id', userId);
  if (table === 'protokolle') return supabase.from('protokolle').delete().eq('id', id).eq('user_id', userId);
  if (table === 'protokoll_runs') return supabase.from('protokoll_runs').delete().eq('id', id).eq('user_id', userId);
  if (table === 'kolonie_counts') return supabase.from('kolonie_counts').delete().eq('id', id).eq('user_id', userId);
  return supabase.from('differential_counts').delete().eq('id', id).eq('user_id', userId);
}

async function getRemoteMetadata(table: SyncTable, id: string, userId: string): Promise<RemoteSyncMetadata | null> {
  if (table === 'timer_templates') {
    const { data, error } = await supabase.from('timer_templates').select('updated_at, created_at').eq('id', id).eq('user_id', userId).maybeSingle();
    if (error) throw error;
    return data;
  }
  if (table === 'timer_runs') {
    const { data, error } = await supabase.from('timer_runs').select('updated_at, created_at').eq('id', id).eq('user_id', userId).maybeSingle();
    if (error) throw error;
    return data;
  }
  if (table === 'protokolle') {
    const { data, error } = await supabase.from('protokolle').select('updated_at, created_at').eq('id', id).eq('user_id', userId).maybeSingle();
    if (error) throw error;
    return data;
  }
  if (table === 'protokoll_runs') {
    const { data, error } = await supabase.from('protokoll_runs').select('updated_at, created_at').eq('id', id).eq('user_id', userId).maybeSingle();
    if (error) throw error;
    return data;
  }
  if (table === 'kolonie_counts') {
    const { data, error } = await supabase.from('kolonie_counts').select('updated_at, created_at').eq('id', id).eq('user_id', userId).maybeSingle();
    if (error) throw error;
    return data;
  }

  const { data, error } = await supabase.from('differential_counts').select('updated_at, created_at').eq('id', id).eq('user_id', userId).maybeSingle();
  if (error) throw error;
  return data;
}

async function upsertRemoteRow(table: SyncTable, row: LocalRow) {
  if (table === 'timer_templates') return supabase.from('timer_templates').upsert(timerTemplateRemotePayload(row));
  if (table === 'timer_runs') return supabase.from('timer_runs').upsert(timerRunRemotePayload(row));
  if (table === 'protokolle') return supabase.from('protokolle').upsert(protokollRemotePayload(row));
  if (table === 'protokoll_runs') return supabase.from('protokoll_runs').upsert(protokollRunRemotePayload(row));
  if (table === 'kolonie_counts') return supabase.from('kolonie_counts').upsert(kolonieCountRemotePayload(row));
  return supabase.from('differential_counts').upsert(differentialCountRemotePayload(row));
}

async function pushPendingTable(table: SyncTable, userId: string) {
  const rows = await getPendingLocalRows(table, userId);
  let pushed = 0;
  let deleted = 0;
  let skipped = 0;

  for (const row of rows) {
    const id = localRowId(row);
    const remoteMetadata = await getRemoteMetadata(table, id, userId);
    if (shouldSkipLocalPushForRemote({ updatedAt: row.updated_at as string | number | null | undefined }, remoteMetadata)) {
      skipped += 1;
      continue;
    }

    if (isLocalPendingDelete(row)) {
      const { error } = await deleteRemoteRow(table, id, userId);
      if (error) throw error;
      await removeLocalRows(table, userId, [id]);
      deleted += 1;
      continue;
    }

    const { error } = await upsertRemoteRow(table, row);
    if (error) throw error;
    await markLocalRowsSynced(table, userId, [id]);
    pushed += 1;
  }

  return { pushed, deleted, skipped };
}

async function pullRemoteTable(table: SyncTable, userId: string) {
  const storageKey = syncStorageKey(table);
  const lastSync = appStorage.getString(storageKey) ?? new Date(0).toISOString();
  const syncedAt = Date.now();

  if (table === 'timer_templates') {
    const { data, error } = await supabase.from('timer_templates').select('*').eq('user_id', userId).gt('updated_at', lastSync).order('updated_at', { ascending: true }).limit(100);
    if (error) throw error;
    const rows = data ?? [];
    await Promise.all(rows.map((row) => upsertPulledTimerTemplate(row, syncedAt)));
    return { count: rows.length, watermark: getRemoteWatermark(rows, lastSync) };
  }

  if (table === 'timer_runs') {
    const { data, error } = await supabase.from('timer_runs').select('*').eq('user_id', userId).gt('updated_at', lastSync).order('updated_at', { ascending: true }).limit(100);
    if (error) throw error;
    const rows = data ?? [];
    await Promise.all(rows.map((row) => upsertPulledTimerRun(row, syncedAt)));
    return { count: rows.length, watermark: getRemoteWatermark(rows, lastSync) };
  }

  if (table === 'protokolle') {
    const { data, error } = await supabase.from('protokolle').select('*').eq('user_id', userId).gt('updated_at', lastSync).order('updated_at', { ascending: true }).limit(100);
    if (error) throw error;
    const rows = data ?? [];
    await Promise.all(rows.map((row) => upsertPulledProtokoll(row, syncedAt)));
    return { count: rows.length, watermark: getRemoteWatermark(rows, lastSync) };
  }

  if (table === 'protokoll_runs') {
    const { data, error } = await supabase.from('protokoll_runs').select('*').eq('user_id', userId).gt('updated_at', lastSync).order('updated_at', { ascending: true }).limit(100);
    if (error) throw error;
    const rows = data ?? [];
    await Promise.all(rows.map((row) => upsertPulledProtokollRun(row, syncedAt)));
    return { count: rows.length, watermark: getRemoteWatermark(rows, lastSync) };
  }

  if (table === 'kolonie_counts') {
    const { data, error } = await supabase.from('kolonie_counts').select('*').eq('user_id', userId).gt('updated_at', lastSync).order('updated_at', { ascending: true }).limit(100);
    if (error) throw error;
    const rows = data ?? [];
    await Promise.all(rows.map((row) => upsertPulledKolonieCount(row, syncedAt)));
    return { count: rows.length, watermark: getRemoteWatermark(rows, lastSync) };
  }

  const { data, error } = await supabase.from('differential_counts').select('*').eq('user_id', userId).gt('updated_at', lastSync).order('updated_at', { ascending: true }).limit(100);
  if (error) throw error;
  const rows = data ?? [];
  await Promise.all(rows.map((row) => upsertPulledDifferentialCount(row, syncedAt)));
  return { count: rows.length, watermark: getRemoteWatermark(rows, lastSync) };
}

export async function syncAll(userId: string) {
  if (!isSupabaseConfigured || userId === 'local-user') {
    return { skipped: true, reason: 'offline-or-unconfigured', pendingLocalChanges: emptySummary(), remoteChanges: emptySummary() } as const;
  }

  const startedAt = Date.now();
  const pendingLocalChanges = await getPendingLocalChangeSummary(userId);
  const pushedLocalChanges = emptySummary();
  const deletedLocalChanges = emptySummary();
  const remoteConflictChanges = emptySummary();
  const remoteChanges = emptySummary();

  for (const table of syncTables) {
    const result = await pushPendingTable(table, userId);
    pushedLocalChanges[table] = result.pushed;
    deletedLocalChanges[table] = result.deleted;
    remoteConflictChanges[table] = result.skipped;
  }

  for (const table of syncTables) {
    const result = await pullRemoteTable(table, userId);
    remoteChanges[table] = result.count;
    if (result.watermark) appStorage.set(syncStorageKey(table), result.watermark);
  }

  capture('sync_checked', {
    table_count: syncTables.length,
    pending_local_count: sumSummary(pendingLocalChanges),
    pushed_local_count: sumSummary(pushedLocalChanges),
    deleted_local_count: sumSummary(deletedLocalChanges),
    remote_conflict_count: sumSummary(remoteConflictChanges),
    remote_change_count: sumSummary(remoteChanges),
    duration_ms: Date.now() - startedAt,
  });

  const remainingLocalChanges = await getPendingLocalChangeSummary(userId);

  return { skipped: false, pendingLocalChanges: remainingLocalChanges, pushedLocalChanges, deletedLocalChanges, remoteConflictChanges, remoteChanges } as const;
}
