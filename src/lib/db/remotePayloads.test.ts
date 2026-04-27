import { describe, expect, it } from 'vitest';

import {
  differentialCountRemotePayload,
  isLocalPendingDelete,
  kolonieCountRemotePayload,
  localRowId,
  protokollRunRemotePayload,
  timerRunRemotePayload,
  timerTemplateRemotePayload,
} from '@/src/lib/db/remotePayloads';

const timestamp = Date.parse('2026-04-28T08:00:00.000Z');

describe('remote payload mappers', () => {
  it('maps timer templates from local rows', () => {
    expect(
      timerTemplateRemotePayload({
        id: 'template_1',
        user_id: 'user_1',
        name: 'Gram Lugol',
        duration_seconds: 60,
        bereich: 'mibi',
        description: null,
        is_public: 0,
        created_at: timestamp,
        updated_at: timestamp,
      }),
    ).toMatchObject({
      id: 'template_1',
      user_id: 'user_1',
      duration_seconds: 60,
      created_at: '2026-04-28T08:00:00.000Z',
      is_public: false,
    });
  });

  it('maps timer runs with cancellation state', () => {
    expect(
      timerRunRemotePayload({
        id: 'run_1',
        user_id: 'user_1',
        template_id: 'template_1',
        name: 'Timer',
        duration_seconds: 90,
        bereich: 'histo',
        started_at: timestamp,
        completed_at: timestamp + 90_000,
        cancelled: 1,
        created_at: timestamp + 90_000,
        updated_at: timestamp + 90_000,
      }).cancelled,
    ).toBe(true);
  });

  it('maps protocol snapshots as JSON', () => {
    const payload = protokollRunRemotePayload({
      id: 'proto_run_1',
      user_id: 'user_1',
      protokoll_id: 'proto_1',
      protokoll_snapshot_json: JSON.stringify({ id: 'proto_1', steps: [] }),
      started_at: timestamp,
      completed_at: timestamp,
      notes: 'ok',
      created_at: timestamp,
      updated_at: timestamp,
    });

    expect(payload.protokoll_snapshot).toEqual({ id: 'proto_1', steps: [] });
    expect(payload.notes).toBe('ok');
  });

  it('maps counter payloads and preserves structured count metadata', () => {
    expect(
      kolonieCountRemotePayload({
        id: 'kolonie_1',
        user_id: 'user_1',
        name: 'CLED',
        counts_json: JSON.stringify({ categories: [{ id: 'cream', count: 4 }], dilutionFactor: 1000 }),
        total_cfu: 40000,
        created_at: timestamp,
        updated_at: timestamp,
      }).counts,
    ).toEqual({ categories: [{ id: 'cream', count: 4 }], dilutionFactor: 1000 });

    expect(
      differentialCountRemotePayload({
        id: 'diff_1',
        user_id: 'user_1',
        counts_json: JSON.stringify({ cells: [{ id: 'neutro', count: 50 }], target: 100 }),
        total_cells: 50,
        created_at: timestamp,
        updated_at: timestamp,
      }).total_cells,
    ).toBe(50);
  });

  it('detects local delete markers', () => {
    expect(localRowId({ id: 'row_1' })).toBe('row_1');
    expect(isLocalPendingDelete({ pending_delete: 1 })).toBe(true);
    expect(isLocalPendingDelete({ pending_delete: 0 })).toBe(false);
  });
});