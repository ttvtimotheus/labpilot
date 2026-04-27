import { describe, expect, it } from 'vitest';

import { buildDifferentialCountReport, buildKolonieCountReport, buildProtokollRunReport, escapeHtml } from '@/src/features/export/report';
import type { DifferentialCountSnapshot, KolonieCountSnapshot, ProtokollRun } from '@/src/types/domain';

describe('report builders', () => {
  it('escapes unsafe text', () => {
    expect(escapeHtml('<script>alert("x")</script>')).toBe('&lt;script&gt;alert(&quot;x&quot;)&lt;/script&gt;');
  });

  it('escapes report content inside generated tables', () => {
    const html = buildKolonieCountReport({
      id: 'k1',
      name: '<b>Plate</b>',
      categories: [{ id: 'x', label: '<unsafe>', colour: '#000000', count: 1 }],
      dilutionFactor: 1,
      platedVolumeMl: 1,
      totalColonies: 1,
      totalCfu: 1,
      createdAt: '2026-04-27T08:00:00.000Z',
    });

    expect(html).toContain('&lt;b&gt;Plate&lt;/b&gt;');
    expect(html).toContain('&lt;unsafe&gt;');
    expect(html).not.toContain('<b>Plate</b>');
  });

  it('builds a protocol run report with notes and steps', () => {
    const run: ProtokollRun = {
      id: 'run_1',
      protokollId: 'proto_1',
      startedAt: '2026-04-27T08:00:00.000Z',
      completedAt: '2026-04-27T08:05:00.000Z',
      notes: 'Kontrolle unauffaellig',
      protokollSnapshot: {
        id: 'proto_1',
        name: 'Gram-Test',
        bereich: 'mibi',
        description: 'Beschreibung',
        source: 'Routine',
        isPublic: true,
        createdAt: '2026-04-27T08:00:00.000Z',
        updatedAt: '2026-04-27T08:00:00.000Z',
        steps: [{ id: 's1', name: 'Lugol', durationSeconds: 60, instructions: 'Bedecken', order: 1 }],
      },
    };

    expect(buildProtokollRunReport(run)).toContain('Gram-Test');
    expect(buildProtokollRunReport(run)).toContain('Kontrolle unauffaellig');
    expect(buildProtokollRunReport(run)).toContain('01:00');
  });

  it('builds count reports with totals', () => {
    const kolonie: KolonieCountSnapshot = {
      id: 'k1',
      categories: [{ id: 'red', label: 'Rot', colour: '#C84630', count: 12 }],
      dilutionFactor: 1000,
      platedVolumeMl: 0.1,
      totalColonies: 12,
      totalCfu: 120000,
      createdAt: '2026-04-27T08:00:00.000Z',
    };
    const differential: DifferentialCountSnapshot = {
      id: 'd1',
      cells: [{ id: 'lym', label: 'Lymphozyten', shortLabel: 'Lym', count: 25 }],
      totalCells: 100,
      target: 100,
      createdAt: '2026-04-27T08:00:00.000Z',
    };

    expect(buildKolonieCountReport(kolonie)).toContain('120.000');
    expect(buildDifferentialCountReport(differential)).toContain('25 %');
  });
});