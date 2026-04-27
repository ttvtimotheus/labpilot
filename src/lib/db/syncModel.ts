export const syncTables = [
  'timer_templates',
  'timer_runs',
  'protokolle',
  'protokoll_runs',
  'kolonie_counts',
  'differential_counts',
] as const;

export type SyncTable = (typeof syncTables)[number];

export type SyncWinner = 'local' | 'remote';

export interface LocalSyncMetadata {
  updatedAt?: Date | string | number | null;
  syncedAt?: Date | string | number | null;
  pendingDelete?: boolean | number | null;
}

export interface RemoteSyncMetadata {
  updated_at?: string | null;
  created_at?: string | null;
}

export function syncStorageKey(table: SyncTable) {
  return `sync.${table}.last`;
}

export function toTimestampMs(value: Date | string | number | null | undefined) {
  if (value instanceof Date) return Number.isFinite(value.getTime()) ? value.getTime() : null;
  if (typeof value === 'number') return Number.isFinite(value) ? value : null;
  if (!value) return null;
  const parsed = new Date(value).getTime();
  return Number.isFinite(parsed) ? parsed : null;
}

export function shouldPushLocalChange(record: LocalSyncMetadata) {
  if (record.pendingDelete === true || record.pendingDelete === 1) return true;

  const updatedAt = toTimestampMs(record.updatedAt);
  const syncedAt = toTimestampMs(record.syncedAt);

  if (!syncedAt) return true;
  if (!updatedAt) return false;
  return updatedAt > syncedAt;
}

export function resolveLastWriteWins(
  localUpdatedAt: Date | string | number | null | undefined,
  remoteUpdatedAt: Date | string | number | null | undefined,
  serverWinsOnTie = true,
): SyncWinner {
  const localTime = toTimestampMs(localUpdatedAt) ?? 0;
  const remoteTime = toTimestampMs(remoteUpdatedAt) ?? 0;

  if (localTime > remoteTime) return 'local';
  if (remoteTime > localTime) return 'remote';
  return serverWinsOnTie ? 'remote' : 'local';
}

export function shouldSkipLocalPushForRemote(local: LocalSyncMetadata, remote: RemoteSyncMetadata | null | undefined) {
  if (!remote) return false;
  return resolveLastWriteWins(local.updatedAt, remote.updated_at ?? remote.created_at) === 'remote';
}

export function getRemoteWatermark(rows: RemoteSyncMetadata[], previousWatermark: string | null = null) {
  const previous = toTimestampMs(previousWatermark);
  const latest = rows.reduce<number | null>((max, row) => {
    const value = toTimestampMs(row.updated_at ?? row.created_at);
    if (!value) return max;
    return max === null || value > max ? value : max;
  }, previous);

  return latest ? new Date(latest).toISOString() : previousWatermark;
}