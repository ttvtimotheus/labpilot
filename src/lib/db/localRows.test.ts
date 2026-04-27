import { describe, expect, it } from 'vitest';

import {
  localDifferentialCountFromRow,
  localKolonieCountFromRow,
  localProtokollRunFromRow,
  localTimerRunFromRow,
  localTimerTemplateFromRow,
} from '@/src/lib/db/localRows';

const createdAt = Date.parse('2026-04-28T08:00:00.000Z');

describe('local row mappers', () => {
  it('maps timer templates and falls back to general for invalid areas', () => {
    expect(
      localTimerTemplateFromRow({
        id: 'template_1',
        user_id: 'user_1',
        name: 'Timer',
        duration_seconds: 60,
        bereich: 'unknown',
        is_public: 0,
        created_at: createdAt,
        updated_at: createdAt,
      }),
    ).toMatchObject({ id: 'template_1', bereich: 'general', durationSeconds: 60 });
  });

  it('maps timer runs with boolean cancellation', () => {
    expect(
      localTimerRunFromRow({
        id: 'run_1',
        name: 'Timer',
        duration_seconds: 90,
        bereich: 'mibi',
        started_at: createdAt,
        completed_at: createdAt + 90_000,
        cancelled: 1,
      }),
    ).toMatchObject({ id: 'run_1', cancelled: true, completedAt: '2026-04-28T08:01:30.000Z' });
  });

  it('maps protocol runs only when snapshot JSON is valid', () => {
    const snapshot = {
      id: 'proto_1',
      name: 'Gram',
      bereich: 'mibi',
      description: 'Test',
      source: 'Routine',
      steps: [{ id: 'step_1', name: 'Fixieren', instructions: 'Kurz', order: 1 }],
      isPublic: true,
      createdAt: '2026-04-28T08:00:00.000Z',
      updatedAt: '2026-04-28T08:00:00.000Z',
    };

    expect(
      localProtokollRunFromRow({
        id: 'proto_run_1',
        protokoll_id: 'proto_1',
        protokoll_snapshot_json: JSON.stringify(snapshot),
        started_at: createdAt,
        completed_at: createdAt,
      })?.protokollSnapshot.name,
    ).toBe('Gram');
    expect(localProtokollRunFromRow({ id: 'broken', protokoll_id: 'proto_1', protokoll_snapshot_json: '{' })).toBeNull();
  });

  it('maps colony count payloads with stored CFU value', () => {
    const count = localKolonieCountFromRow({
      id: 'kolonie_1',
      name: 'CLED',
      counts_json: JSON.stringify({
        categories: [{ id: 'cream', label: 'Creme', colour: '#E8D8B8', count: 4 }],
        dilutionFactor: 1000,
        platedVolumeMl: 0.1,
        totalColonies: 4,
      }),
      total_cfu: 40000,
      created_at: createdAt,
    });

    expect(count).toMatchObject({ id: 'kolonie_1', totalColonies: 4, totalCfu: 40000 });
  });

  it('maps differential counts and preserves short labels', () => {
    const count = localDifferentialCountFromRow({
      id: 'diff_1',
      counts_json: JSON.stringify({ cells: [{ id: 'neutro', label: 'Segmentkernige Neutrophile', shortLabel: 'Seg', count: 50 }], target: 100 }),
      total_cells: 50,
      created_at: createdAt,
    });

    expect(count?.cells[0].shortLabel).toBe('Seg');
    expect(count?.target).toBe(100);
  });
});