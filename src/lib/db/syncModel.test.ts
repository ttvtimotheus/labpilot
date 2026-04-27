import { describe, expect, it } from 'vitest';

import { getRemoteWatermark, resolveLastWriteWins, shouldPushLocalChange, syncStorageKey, toTimestampMs } from '@/src/lib/db/syncModel';

describe('sync model', () => {
  it('builds stable storage keys per table', () => {
    expect(syncStorageKey('timer_runs')).toBe('sync.timer_runs.last');
  });

  it('parses valid timestamps and rejects invalid values', () => {
    expect(toTimestampMs('2026-04-28T00:00:00.000Z')).toBe(Date.parse('2026-04-28T00:00:00.000Z'));
    expect(toTimestampMs('not-a-date')).toBeNull();
  });

  it('detects unsynced local changes and pending deletes', () => {
    expect(shouldPushLocalChange({ updatedAt: '2026-04-28T10:00:00.000Z', syncedAt: '2026-04-28T09:00:00.000Z' })).toBe(true);
    expect(shouldPushLocalChange({ updatedAt: '2026-04-28T09:00:00.000Z', syncedAt: '2026-04-28T10:00:00.000Z' })).toBe(false);
    expect(shouldPushLocalChange({ pendingDelete: 1, syncedAt: '2026-04-28T10:00:00.000Z' })).toBe(true);
  });

  it('uses last-write-wins with server tie preference', () => {
    expect(resolveLastWriteWins('2026-04-28T10:00:00.000Z', '2026-04-28T09:00:00.000Z')).toBe('local');
    expect(resolveLastWriteWins('2026-04-28T09:00:00.000Z', '2026-04-28T10:00:00.000Z')).toBe('remote');
    expect(resolveLastWriteWins('2026-04-28T10:00:00.000Z', '2026-04-28T10:00:00.000Z')).toBe('remote');
  });

  it('advances remote watermark only to returned remote timestamps', () => {
    expect(
      getRemoteWatermark(
        [
          { updated_at: '2026-04-28T09:00:00.000Z' },
          { updated_at: '2026-04-28T10:00:00.000Z' },
        ],
        '2026-04-28T08:00:00.000Z',
      ),
    ).toBe('2026-04-28T10:00:00.000Z');
    expect(getRemoteWatermark([], '2026-04-28T08:00:00.000Z')).toBe('2026-04-28T08:00:00.000Z');
  });
});