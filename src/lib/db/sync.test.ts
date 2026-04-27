import { beforeEach, describe, expect, it, vi } from 'vitest';

import { syncAll } from '@/src/lib/db/sync';
import { syncTables, type SyncTable } from '@/src/lib/db/syncModel';

const syncMocks = vi.hoisted(() => {
  const tables = ['timer_templates', 'timer_runs', 'protokolle', 'protokoll_runs', 'kolonie_counts', 'differential_counts'] as const;
  type Table = (typeof tables)[number];
  type Row = Record<string, unknown>;

  const emptySummary = () => Object.fromEntries(tables.map((table) => [table, 0])) as Record<Table, number>;
  const emptyRowsByTable = () => Object.fromEntries(tables.map((table) => [table, []])) as unknown as Record<Table, Row[]>;
  const emptyMetadataByTable = () => Object.fromEntries(tables.map((table) => [table, {}])) as unknown as Record<Table, Record<string, Row | null>>;

  const pendingRowsByTable = emptyRowsByTable();
  const pullRowsByTable = emptyRowsByTable();
  const remoteMetadataByTable = emptyMetadataByTable();
  const upsertedRows: { table: Table; payload: Row }[] = [];
  const deletedRows: { table: Table; filters: [string, unknown][] }[] = [];

  function resetData() {
    for (const table of tables) {
      pendingRowsByTable[table] = [];
      pullRowsByTable[table] = [];
      remoteMetadataByTable[table] = {};
    }
    upsertedRows.length = 0;
    deletedRows.length = 0;
  }

  function createSelectQuery(table: Table) {
    const filters: [string, unknown][] = [];
    const query = {
      eq: vi.fn((key: string, value: unknown) => {
        filters.push([key, value]);
        return query;
      }),
      gt: vi.fn((key: string, value: unknown) => {
        filters.push([key, value]);
        return query;
      }),
      order: vi.fn(() => query),
      limit: vi.fn(async () => ({ data: pullRowsByTable[table], error: null })),
      maybeSingle: vi.fn(async () => {
        const id = filters.find(([key]) => key === 'id')?.[1];
        return { data: typeof id === 'string' ? remoteMetadataByTable[table][id] ?? null : null, error: null };
      }),
    };
    return query;
  }

  function createDeleteQuery(table: Table) {
    const filters: [string, unknown][] = [];
    const query = {
      eq: vi.fn((key: string, value: unknown) => {
        filters.push([key, value]);
        return query;
      }),
      then: (resolve: (value: { error: null }) => unknown) => {
        deletedRows.push({ table, filters });
        return Promise.resolve({ error: null }).then(resolve);
      },
    };
    return query;
  }

  const supabase = {
    from: vi.fn((table: Table) => ({
      delete: vi.fn(() => createDeleteQuery(table)),
      select: vi.fn(() => createSelectQuery(table)),
      upsert: vi.fn(async (payload: Row) => {
        upsertedRows.push({ table, payload });
        return { error: null };
      }),
    })),
  };

  return {
    capture: vi.fn(),
    deletedRows,
    emptySummary,
    getPendingLocalChangeSummary: vi.fn(async () => emptySummary()),
    getPendingLocalRows: vi.fn(async (table: Table) => pendingRowsByTable[table]),
    markLocalRowsSynced: vi.fn(async () => undefined),
    pendingRowsByTable,
    pullRowsByTable,
    remoteMetadataByTable,
    removeLocalRows: vi.fn(async () => undefined),
    resetData,
    setStorage: vi.fn(),
    supabase,
    upsertPulledDifferentialCount: vi.fn(async () => undefined),
    upsertPulledKolonieCount: vi.fn(async () => undefined),
    upsertPulledProtokoll: vi.fn(async () => undefined),
    upsertPulledProtokollRun: vi.fn(async () => undefined),
    upsertPulledTimerRun: vi.fn(async () => undefined),
    upsertPulledTimerTemplate: vi.fn(async () => undefined),
    upsertedRows,
  };
});

vi.mock('@/src/lib/analytics', () => ({ capture: syncMocks.capture }));
vi.mock('@/src/lib/env', () => ({ isSupabaseConfigured: true }));
vi.mock('@/src/lib/storage/mmkv', () => ({ appStorage: { getString: vi.fn(() => undefined), set: syncMocks.setStorage } }));
vi.mock('@/src/lib/supabase/client', () => ({ supabase: syncMocks.supabase }));
vi.mock('@/src/lib/db/localPersistence', () => ({
  getPendingLocalChangeSummary: syncMocks.getPendingLocalChangeSummary,
  getPendingLocalRows: syncMocks.getPendingLocalRows,
  markLocalRowsSynced: syncMocks.markLocalRowsSynced,
  removeLocalRows: syncMocks.removeLocalRows,
  upsertPulledDifferentialCount: syncMocks.upsertPulledDifferentialCount,
  upsertPulledKolonieCount: syncMocks.upsertPulledKolonieCount,
  upsertPulledProtokoll: syncMocks.upsertPulledProtokoll,
  upsertPulledProtokollRun: syncMocks.upsertPulledProtokollRun,
  upsertPulledTimerRun: syncMocks.upsertPulledTimerRun,
  upsertPulledTimerTemplate: syncMocks.upsertPulledTimerTemplate,
}));

const timestamp = Date.parse('2026-04-28T10:00:00.000Z');

function timerRunRow(input: { id: string; updatedAt: number; pendingDelete?: 0 | 1 }) {
  return {
    id: input.id,
    user_id: 'user_1',
    template_id: 'template_1',
    name: 'Gram Timer',
    duration_seconds: 60,
    bereich: 'mibi',
    started_at: timestamp - 60_000,
    completed_at: timestamp,
    cancelled: 0,
    created_at: timestamp,
    updated_at: input.updatedAt,
    pending_delete: input.pendingDelete ?? 0,
  };
}

describe('syncAll', () => {
  beforeEach(() => {
    syncMocks.resetData();
    syncMocks.capture.mockClear();
    syncMocks.getPendingLocalChangeSummary.mockClear();
    syncMocks.getPendingLocalRows.mockClear();
    syncMocks.markLocalRowsSynced.mockClear();
    syncMocks.removeLocalRows.mockClear();
    syncMocks.setStorage.mockClear();
    syncMocks.supabase.from.mockClear();
    syncMocks.upsertPulledTimerRun.mockClear();
  });

  it('pushes locally newer pending rows', async () => {
    syncMocks.pendingRowsByTable.timer_runs = [timerRunRow({ id: 'run_1', updatedAt: timestamp + 60_000 })];
    syncMocks.remoteMetadataByTable.timer_runs.run_1 = { updated_at: new Date(timestamp).toISOString(), created_at: new Date(timestamp).toISOString() };

    const result = await syncAll('user_1');

    expect(result.skipped).toBe(false);
    if (result.skipped) throw new Error('Sync should not be skipped.');
    expect(syncMocks.upsertedRows).toHaveLength(1);
    expect(syncMocks.upsertedRows[0]).toMatchObject({ table: 'timer_runs', payload: { id: 'run_1', name: 'Gram Timer' } });
    expect(syncMocks.markLocalRowsSynced).toHaveBeenCalledWith('timer_runs', 'user_1', ['run_1']);
    expect(result.pushedLocalChanges.timer_runs).toBe(1);
    expect(result.remoteConflictChanges.timer_runs).toBe(0);
  });

  it('skips local pushes when remote metadata is newer and lets pull hydrate the row', async () => {
    syncMocks.pendingRowsByTable.timer_runs = [timerRunRow({ id: 'run_2', updatedAt: timestamp })];
    syncMocks.remoteMetadataByTable.timer_runs.run_2 = { updated_at: new Date(timestamp + 60_000).toISOString(), created_at: new Date(timestamp).toISOString() };
    syncMocks.pullRowsByTable.timer_runs = [
      {
        id: 'run_2',
        user_id: 'user_1',
        template_id: 'template_1',
        name: 'Remote Timer',
        duration_seconds: 90,
        bereich: 'mibi',
        started_at: new Date(timestamp).toISOString(),
        completed_at: new Date(timestamp + 90_000).toISOString(),
        cancelled: false,
        created_at: new Date(timestamp).toISOString(),
        updated_at: new Date(timestamp + 60_000).toISOString(),
      },
    ];

    const result = await syncAll('user_1');

    expect(result.skipped).toBe(false);
    if (result.skipped) throw new Error('Sync should not be skipped.');
    expect(syncMocks.upsertedRows).toEqual([]);
    expect(syncMocks.markLocalRowsSynced).not.toHaveBeenCalled();
    expect(syncMocks.upsertPulledTimerRun).toHaveBeenCalledTimes(1);
    expect(result.remoteConflictChanges.timer_runs).toBe(1);
    expect(result.remoteChanges.timer_runs).toBe(1);
  });

  it('deletes remote rows for pending local tombstones when local wins', async () => {
    syncMocks.pendingRowsByTable.timer_runs = [timerRunRow({ id: 'run_3', updatedAt: timestamp + 60_000, pendingDelete: 1 })];
    syncMocks.remoteMetadataByTable.timer_runs.run_3 = { updated_at: new Date(timestamp).toISOString(), created_at: new Date(timestamp).toISOString() };

    const result = await syncAll('user_1');

    expect(result.skipped).toBe(false);
    if (result.skipped) throw new Error('Sync should not be skipped.');
    expect(syncMocks.deletedRows).toHaveLength(1);
    expect(syncMocks.deletedRows[0]).toMatchObject({ table: 'timer_runs' });
    expect(syncMocks.removeLocalRows).toHaveBeenCalledWith('timer_runs', 'user_1', ['run_3']);
    expect(result.deletedLocalChanges.timer_runs).toBe(1);
  });

  it('checks every sync table for pending rows and remote changes', async () => {
    await syncAll('user_1');

    expect(syncMocks.getPendingLocalRows.mock.calls.map(([table]) => table)).toEqual(syncTables satisfies readonly SyncTable[]);
  });
});