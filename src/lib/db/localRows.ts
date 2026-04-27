import { calculateCfu } from '@/src/features/zaehler/cfu';
import { sumCounts } from '@/src/lib/utils/collections';
import type { LocalRow } from '@/src/lib/db/remotePayloads';
import type {
  Bereich,
  DifferentialCell,
  DifferentialCountSnapshot,
  KolonieCategory,
  KolonieCountSnapshot,
  Protokoll,
  ProtokollRun,
  ProtocolStep,
  TimerRun,
  TimerTemplate,
} from '@/src/types/domain';

const validBereiche = new Set<Bereich>(['mibi', 'haema', 'chemie', 'histo', 'general', 'learn']);

function stringValue(row: LocalRow, key: string) {
  const value = row[key];
  if (typeof value === 'string') return value;
  if (typeof value === 'number' || typeof value === 'boolean') return String(value);
  return null;
}

function numberValue(row: LocalRow, key: string) {
  const value = row[key];
  if (typeof value === 'number' && Number.isFinite(value)) return value;
  if (typeof value === 'string') {
    const parsed = Number(value);
    return Number.isFinite(parsed) ? parsed : null;
  }
  return null;
}

function booleanValue(row: LocalRow, key: string) {
  const value = row[key];
  return value === true || value === 1 || value === '1';
}

function isoValue(row: LocalRow, key: string) {
  const value = row[key];
  if (typeof value === 'number' && Number.isFinite(value)) return new Date(value).toISOString();
  if (typeof value === 'string' && value.trim()) {
    const parsed = new Date(value);
    if (Number.isFinite(parsed.getTime())) return parsed.toISOString();
  }
  return new Date(0).toISOString();
}

function bereichValue(row: LocalRow, key: string): Bereich {
  const value = stringValue(row, key);
  return value && validBereiche.has(value as Bereich) ? (value as Bereich) : 'general';
}

function parseJson(value: string | null) {
  if (!value) return null;
  try {
    return JSON.parse(value) as unknown;
  } catch {
    return null;
  }
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return Boolean(value && typeof value === 'object' && !Array.isArray(value));
}

function isProtocolStep(value: unknown): value is ProtocolStep {
  if (!isRecord(value)) return false;
  return typeof value.id === 'string' && typeof value.name === 'string' && typeof value.instructions === 'string' && typeof value.order === 'number';
}

function isProtokoll(value: unknown): value is Protokoll {
  if (!isRecord(value)) return false;
  return (
    typeof value.id === 'string' &&
    typeof value.name === 'string' &&
    typeof value.bereich === 'string' &&
    Array.isArray(value.steps) &&
    value.steps.every(isProtocolStep)
  );
}

function isKolonieCategory(value: unknown): value is KolonieCategory {
  if (!isRecord(value)) return false;
  return typeof value.id === 'string' && typeof value.label === 'string' && typeof value.colour === 'string' && typeof value.count === 'number';
}

function isDifferentialCell(value: unknown): value is DifferentialCell {
  if (!isRecord(value)) return false;
  return typeof value.id === 'string' && typeof value.label === 'string' && typeof value.shortLabel === 'string' && typeof value.count === 'number';
}

export function localTimerTemplateFromRow(row: LocalRow): TimerTemplate | null {
  const id = stringValue(row, 'id');
  const userId = stringValue(row, 'user_id');
  const name = stringValue(row, 'name');
  const durationSeconds = numberValue(row, 'duration_seconds');

  if (!id || !userId || !name || !durationSeconds) return null;

  return {
    id,
    userId,
    name,
    durationSeconds,
    bereich: bereichValue(row, 'bereich'),
    description: stringValue(row, 'description') ?? undefined,
    isPublic: booleanValue(row, 'is_public'),
    createdAt: isoValue(row, 'created_at'),
    updatedAt: isoValue(row, 'updated_at'),
  };
}

export function localTimerRunFromRow(row: LocalRow): TimerRun | null {
  const id = stringValue(row, 'id');
  const name = stringValue(row, 'name');
  const durationSeconds = numberValue(row, 'duration_seconds');

  if (!id || !name || !durationSeconds) return null;

  return {
    id,
    templateId: stringValue(row, 'template_id') ?? undefined,
    name,
    durationSeconds,
    startedAt: isoValue(row, 'started_at'),
    completedAt: isoValue(row, 'completed_at'),
    bereich: bereichValue(row, 'bereich'),
    cancelled: booleanValue(row, 'cancelled'),
  };
}

export function localProtokollRunFromRow(row: LocalRow): ProtokollRun | null {
  const id = stringValue(row, 'id');
  const protokollId = stringValue(row, 'protokoll_id');
  const snapshot = parseJson(stringValue(row, 'protokoll_snapshot_json'));

  if (!id || !protokollId || !isProtokoll(snapshot)) return null;

  return {
    id,
    protokollId,
    protokollSnapshot: snapshot,
    startedAt: isoValue(row, 'started_at'),
    completedAt: isoValue(row, 'completed_at'),
    notes: stringValue(row, 'notes') ?? undefined,
  };
}

export function localKolonieCountFromRow(row: LocalRow): KolonieCountSnapshot | null {
  const id = stringValue(row, 'id');
  const payload = parseJson(stringValue(row, 'counts_json'));
  if (!id || !isRecord(payload) || !Array.isArray(payload.categories) || !payload.categories.every(isKolonieCategory)) return null;

  const categories = payload.categories;
  const dilutionFactor = typeof payload.dilutionFactor === 'number' && payload.dilutionFactor > 0 ? payload.dilutionFactor : 1;
  const platedVolumeMl = typeof payload.platedVolumeMl === 'number' && payload.platedVolumeMl > 0 ? payload.platedVolumeMl : 0.1;
  const totalColonies = typeof payload.totalColonies === 'number' ? payload.totalColonies : sumCounts(categories);
  const storedCfu = numberValue(row, 'total_cfu');

  return {
    id,
    name: stringValue(row, 'name') ?? undefined,
    categories,
    dilutionFactor,
    platedVolumeMl,
    totalColonies,
    totalCfu: storedCfu ?? calculateCfu(totalColonies, dilutionFactor, platedVolumeMl),
    createdAt: isoValue(row, 'created_at'),
  };
}

export function localDifferentialCountFromRow(row: LocalRow): DifferentialCountSnapshot | null {
  const id = stringValue(row, 'id');
  const payload = parseJson(stringValue(row, 'counts_json'));
  if (!id || !isRecord(payload) || !Array.isArray(payload.cells) || !payload.cells.every(isDifferentialCell)) return null;

  const cells = payload.cells;
  const target = typeof payload.target === 'number' && payload.target > 0 ? payload.target : 100;

  return {
    id,
    name: stringValue(row, 'name') ?? undefined,
    cells,
    totalCells: numberValue(row, 'total_cells') ?? sumCounts(cells),
    target,
    createdAt: isoValue(row, 'created_at'),
  };
}