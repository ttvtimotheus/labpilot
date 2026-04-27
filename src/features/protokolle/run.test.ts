import { describe, expect, it } from 'vitest';

import { addProtokollRunToHistory, createProtokollRun } from '@/src/features/protokolle/run';
import type { Protokoll } from '@/src/types/domain';

const protokoll: Protokoll = {
  id: 'proto_1',
  name: 'Gram',
  bereich: 'mibi',
  description: 'Beschreibung',
  source: 'Routine',
  steps: [{ id: 'step_1', name: 'Fixieren', order: 1, instructions: 'Kurz fixieren' }],
  isPublic: true,
  createdAt: '2026-04-27T08:00:00.000Z',
  updatedAt: '2026-04-27T08:00:00.000Z',
};

describe('protokoll run model', () => {
  it('creates completed run snapshots and trims notes', () => {
    const run = createProtokollRun(
      { protokoll, startedAt: '2026-04-27T08:00:00.000Z', notes: '  ok  ' },
      { id: 'run_1', now: new Date('2026-04-27T08:10:00.000Z') },
    );

    expect(run).toMatchObject({
      id: 'run_1',
      protokollId: 'proto_1',
      notes: 'ok',
      completedAt: '2026-04-27T08:10:00.000Z',
    });
    expect(run.protokollSnapshot.steps).toHaveLength(1);
  });

  it('caps run history', () => {
    const run = createProtokollRun({ protokoll, startedAt: '2026-04-27T08:00:00.000Z' }, { id: 'run_1' });
    const history = addProtokollRunToHistory(run, [run, run], 2);
    expect(history).toHaveLength(2);
    expect(history[0].id).toBe('run_1');
  });
});