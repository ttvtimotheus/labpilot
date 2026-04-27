import { beforeEach, describe, expect, it, vi } from 'vitest';

import { clearOrMarkLocalRowsDeleted, markLocalRowsPendingDelete } from '@/src/lib/db/localPersistence';

const dbMocks = vi.hoisted(() => ({
  executeLocalSql: vi.fn(async () => ({ rows: [] })),
  migrateLocalDb: vi.fn(async () => undefined),
}));

vi.mock('@/src/lib/db/client', () => dbMocks);

describe('local persistence delete helpers', () => {
  beforeEach(() => {
    dbMocks.executeLocalSql.mockClear();
    dbMocks.migrateLocalDb.mockClear();
  });

  it('hard-deletes rows for the local-only user', async () => {
    await clearOrMarkLocalRowsDeleted('timer_runs', 'local-user');

    expect(dbMocks.migrateLocalDb).toHaveBeenCalledTimes(1);
    expect(dbMocks.executeLocalSql).toHaveBeenCalledWith('delete from timer_runs where user_id = ?', ['local-user']);
  });

  it('marks cloud-backed rows as pending deletes', async () => {
    await clearOrMarkLocalRowsDeleted('kolonie_counts', 'user_1');

    expect(dbMocks.executeLocalSql).toHaveBeenCalledWith(
      'update kolonie_counts set pending_delete = 1, updated_at = ?, synced_at = null where user_id = ? and pending_delete = 0',
      [expect.any(Number), 'user_1'],
    );
  });

  it('can mark selected row ids as pending deletes', async () => {
    await markLocalRowsPendingDelete('protokoll_runs', 'user_1', ['run_1', 'run_2'], 177000);

    expect(dbMocks.executeLocalSql).toHaveBeenNthCalledWith(
      1,
      'update protokoll_runs set pending_delete = 1, updated_at = ?, synced_at = null where user_id = ? and id = ?',
      [177000, 'user_1', 'run_1'],
    );
    expect(dbMocks.executeLocalSql).toHaveBeenNthCalledWith(
      2,
      'update protokoll_runs set pending_delete = 1, updated_at = ?, synced_at = null where user_id = ? and id = ?',
      [177000, 'user_1', 'run_2'],
    );
  });
});