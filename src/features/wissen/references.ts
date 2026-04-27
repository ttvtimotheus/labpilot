import normalwerteJson from '@/assets/data/normalwerte.json';
import naehrmedienJson from '@/assets/data/naehrmedien.json';
import type { Bereich } from '@/src/types/domain';

export interface NormalwertReference {
  id: string;
  label: string;
  value: string;
  bereich: Bereich;
}

export interface NaehrmediumReference {
  id: string;
  name: string;
  use: string;
  bereich: Bereich;
}

export const normalwerte = normalwerteJson as NormalwertReference[];
export const naehrmedien = naehrmedienJson as NaehrmediumReference[];

export function normalwerteForBereich(bereich: Bereich) {
  return normalwerte.filter((entry) => entry.bereich === bereich);
}

export function naehrmedienForBereich(bereich: Bereich) {
  return naehrmedien.filter((entry) => entry.bereich === bereich);
}