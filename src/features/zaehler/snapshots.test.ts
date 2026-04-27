import { describe, expect, it } from 'vitest';

import { createDifferentialCountSnapshot, createKolonieCountSnapshot } from '@/src/features/zaehler/snapshots';

const fixedNow = new Date('2026-04-27T12:00:00.000Z');

describe('zaehler snapshots', () => {
  it('creates colony snapshots with totals and trimmed names', () => {
    const snapshot = createKolonieCountSnapshot(
      {
        name: '  CLED  ',
        dilutionFactor: 1000,
        platedVolumeMl: 0.1,
        categories: [{ id: 'cream', label: 'Creme', colour: '#E8D8B8', count: 42 }],
      },
      { id: 'count_1', now: fixedNow },
    );

    expect(snapshot).toMatchObject({
      id: 'count_1',
      name: 'CLED',
      totalColonies: 42,
      totalCfu: 420000,
      createdAt: fixedNow.toISOString(),
    });
  });

  it('does not create empty colony snapshots', () => {
    expect(createKolonieCountSnapshot({ categories: [], dilutionFactor: 1000, platedVolumeMl: 0.1 })).toBeNull();
  });

  it('creates differential snapshots with target and total cells', () => {
    const snapshot = createDifferentialCountSnapshot(
      {
        name: ' Diff ',
        target: 100,
        cells: [{ id: 'seg', label: 'Segmentkernige Neutrophile', shortLabel: 'Seg', count: 64 }],
      },
      { id: 'diff_1', now: fixedNow },
    );

    expect(snapshot).toMatchObject({
      id: 'diff_1',
      name: 'Diff',
      totalCells: 64,
      target: 100,
    });
  });
});