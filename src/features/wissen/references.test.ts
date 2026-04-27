import { describe, expect, it } from 'vitest';

import {
  filterNormalwerte,
  filterNaehrmedien,
  naehrmedien,
  naehrmedienForBereich,
  naehrmediumCategoryIds,
  naehrmediumCategoryLabel,
  normalwertCategoryIds,
  normalwertCategoryLabel,
  normalwerte,
  normalwerteForBereich,
} from '@/src/features/wissen/references';
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

  it('exposes naehrmedium categories from wrapper metadata', () => {
    const categories = naehrmediumCategoryIds();

    expect(categories).toContain('selektiv_differential');
    expect(naehrmediumCategoryLabel('selektiv_differential')).toBe('Selektiv- und Differentialmedien');
  });

  it('exposes normalwert categories from wrapper metadata', () => {
    const categories = normalwertCategoryIds();

    expect(categories).toContain('saeure_basen');
    expect(normalwertCategoryLabel('saeure_basen')).toBe('Säure-Basen-Status');
  });

  it('searches normalwerte across reference details', () => {
    expect(filterNormalwerte({ query: 'Base Excess', category: 'saeure_basen' }).map((entry) => entry.id)).toContain('be_adult');
    expect(filterNormalwerte({ query: 'arteriell', category: 'saeure_basen' }).length).toBeGreaterThan(0);
    expect(filterNormalwerte({ query: 'Base Excess', category: 'haematologie' })).toEqual([]);
  });

  it('searches naehrmedien across rich detail fields', () => {
    expect(filterNaehrmedien({ query: 'bull', bereich: 'mibi' }).map((entry) => entry.id)).toContain('cin');
    expect(filterNaehrmedien({ query: 'MacConkey', category: 'selektiv_differential' }).map((entry) => entry.id)).toContain('mc');
    expect(filterNaehrmedien({ query: 'MacConkey', category: 'anaerob' })).toEqual([]);
  });
});