import { describe, expect, it } from 'vitest';

import { naehrmedien, naehrmedienForBereich, normalwerte, normalwerteForBereich } from '@/src/features/wissen/references';
import type { Bereich } from '@/src/types/domain';

const validAreas: Bereich[] = ['mibi', 'haema', 'chemie', 'histo', 'general', 'learn'];

describe('wissen references', () => {
  it('has unique reference ids and valid areas', () => {
    const allIds = [...normalwerte.map((entry) => entry.id), ...naehrmedien.map((entry) => entry.id)];
    expect(new Set(allIds).size).toBe(allIds.length);
    expect(normalwerte.every((entry) => validAreas.includes(entry.bereich))).toBe(true);
    expect(naehrmedien.every((entry) => validAreas.includes(entry.bereich))).toBe(true);
  });

  it('filters references by area', () => {
    expect(normalwerteForBereich('haema').every((entry) => entry.bereich === 'haema')).toBe(true);
    expect(naehrmedienForBereich('mibi').every((entry) => entry.bereich === 'mibi')).toBe(true);
  });
});