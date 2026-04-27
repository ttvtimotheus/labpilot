import normalwerteJson from '@/assets/data/normalwerte.json';
import naehrmedienJson from '@/assets/data/naehrmedien.json';
import type { Bereich } from '@/src/types/domain';

export interface NormalwertReference {
  id: string;
  label: string;
  value: string;
  bereich: Bereich;
  category?: string;
  specimen?: string;
  age_group?: string;
  sex?: string;
  note?: string;
  si_value?: string;
  conventional_value?: string;
  parent_id?: string;
}

export interface NaehrmediumReference {
  id: string;
  name: string;
  use: string;
  bereich: Bereich;
  category?: string;
  selectivity?: string;
  indicator?: string;
  incubation?: string;
  color?: string;
  key_reactions?: string[];
  wachstum?: string[];
  kein_wachstum_oder_schwach?: string[];
  tipps?: string;
}

type NormalwerteSource = NormalwertReference[] | { categories?: Record<string, string>; values: NormalwertReference[] };
type NaehrmedienSource = NaehrmediumReference[] | { categories?: Record<string, string>; medien: NaehrmediumReference[] };

const normalwerteSource = normalwerteJson as unknown as NormalwerteSource;
const naehrmedienSource = naehrmedienJson as unknown as NaehrmedienSource;

export const normalwerte = Array.isArray(normalwerteSource) ? normalwerteSource : normalwerteSource.values;
export const naehrmedien = Array.isArray(naehrmedienSource) ? naehrmedienSource : naehrmedienSource.medien;
export const normalwertCategories = Array.isArray(normalwerteSource) ? {} : normalwerteSource.categories ?? {};
export const naehrmediumCategories = Array.isArray(naehrmedienSource) ? {} : naehrmedienSource.categories ?? {};

export function normalwerteForBereich(bereich: Bereich) {
  return normalwerte.filter((entry) => entry.bereich === bereich);
}

export function normalwertCategoryLabel(category: string | undefined) {
  if (!category) return 'Ohne Kategorie';
  return normalwertCategories[category] ?? category;
}

export function normalwertCategoryIds() {
  const ids = new Set<string>();
  for (const entry of normalwerte) {
    if (entry.category) ids.add(entry.category);
  }
  return Array.from(ids).sort((left, right) => normalwertCategoryLabel(left).localeCompare(normalwertCategoryLabel(right), 'de'));
}

function normalwertSearchText(entry: NormalwertReference) {
  return [
    entry.label,
    entry.value,
    entry.category ? normalwertCategoryLabel(entry.category) : undefined,
    entry.specimen,
    entry.age_group,
    entry.sex,
    entry.note,
    entry.si_value,
    entry.conventional_value,
  ]
    .filter(Boolean)
    .join(' ')
    .toLocaleLowerCase('de');
}

export function filterNormalwerte(input: { query?: string; category?: string; bereich?: Bereich }) {
  const query = input.query?.trim().toLocaleLowerCase('de') ?? '';

  return normalwerte.filter((entry) => {
    if (input.bereich && entry.bereich !== input.bereich) return false;
    if (input.category && input.category !== 'all' && entry.category !== input.category) return false;
    if (!query) return true;
    return normalwertSearchText(entry).includes(query);
  });
}

export function naehrmedienForBereich(bereich: Bereich) {
  return naehrmedien.filter((entry) => entry.bereich === bereich);
}

export function naehrmediumCategoryLabel(category: string | undefined) {
  if (!category) return 'Ohne Kategorie';
  return naehrmediumCategories[category] ?? category;
}

export function naehrmediumCategoryIds() {
  const ids = new Set<string>();
  for (const entry of naehrmedien) {
    if (entry.category) ids.add(entry.category);
  }
  return Array.from(ids).sort((left, right) => naehrmediumCategoryLabel(left).localeCompare(naehrmediumCategoryLabel(right), 'de'));
}

function searchText(entry: NaehrmediumReference) {
  return [
    entry.name,
    entry.use,
    entry.category ? naehrmediumCategoryLabel(entry.category) : undefined,
    entry.selectivity,
    entry.indicator,
    entry.incubation,
    entry.color,
    entry.tipps,
    ...(entry.key_reactions ?? []),
    ...(entry.wachstum ?? []),
    ...(entry.kein_wachstum_oder_schwach ?? []),
  ]
    .filter(Boolean)
    .join(' ')
    .toLocaleLowerCase('de');
}

export function filterNaehrmedien(input: { query?: string; category?: string; bereich?: Bereich }) {
  const query = input.query?.trim().toLocaleLowerCase('de') ?? '';

  return naehrmedien.filter((entry) => {
    if (input.bereich && entry.bereich !== input.bereich) return false;
    if (input.category && input.category !== 'all' && entry.category !== input.category) return false;
    if (!query) return true;
    return searchText(entry).includes(query);
  });
}