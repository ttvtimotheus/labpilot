import type { Scalar } from '@op-engineering/op-sqlite';

import type { Database, Json } from '@/src/types/database.types';

type Tables = Database['public']['Tables'];
export type LocalRow = Record<string, Scalar>;

function requireString(row: LocalRow, key: string) {
  const value = row[key];
  if (typeof value === 'string') return value;
  if (typeof value === 'number' || typeof value === 'boolean') return String(value);
  throw new Error(`Lokaler Datensatz enthaelt kein gueltiges Feld: ${key}`);
}

function optionalString(row: LocalRow, key: string) {
  const value = row[key];
  if (typeof value === 'string' && value.trim()) return value;
  if (typeof value === 'number' || typeof value === 'boolean') return String(value);
  return null;
}

function requireNumber(row: LocalRow, key: string) {
  const value = row[key];
  if (typeof value === 'number' && Number.isFinite(value)) return value;
  if (typeof value === 'string' && value.trim()) {
    const parsed = Number(value);
    if (Number.isFinite(parsed)) return parsed;
  }
  throw new Error(`Lokaler Datensatz enthaelt keine gueltige Zahl: ${key}`);
}

function optionalNumber(row: LocalRow, key: string) {
  const value = row[key];
  if (value === null || value === undefined || value === '') return null;
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
  if (typeof value === 'string' && value.trim()) return new Date(value).toISOString();
  if (typeof value === 'number' && Number.isFinite(value)) return new Date(value).toISOString();
  return null;
}

function isJson(value: unknown): value is Json {
  if (value === null) return true;
  if (['string', 'number', 'boolean'].includes(typeof value)) return true;
  if (Array.isArray(value)) return value.every(isJson);
  if (typeof value === 'object') {
    return Object.values(value as Record<string, unknown>).every((entry) => entry === undefined || isJson(entry));
  }
  return false;
}

function jsonValue(row: LocalRow, key: string): Json {
  const raw = requireString(row, key);
  const parsed: unknown = JSON.parse(raw);
  if (!isJson(parsed)) throw new Error(`Lokales JSON ist nicht syncbar: ${key}`);
  return parsed;
}

export function localRowId(row: LocalRow) {
  return requireString(row, 'id');
}

export function isLocalPendingDelete(row: LocalRow) {
  return booleanValue(row, 'pending_delete');
}

export function timerTemplateRemotePayload(row: LocalRow): Tables['timer_templates']['Insert'] {
  return {
    id: localRowId(row),
    user_id: requireString(row, 'user_id'),
    name: requireString(row, 'name'),
    duration_seconds: requireNumber(row, 'duration_seconds'),
    bereich: requireString(row, 'bereich'),
    description: optionalString(row, 'description'),
    is_public: booleanValue(row, 'is_public'),
    created_at: isoValue(row, 'created_at'),
    updated_at: isoValue(row, 'updated_at'),
  };
}

export function timerRunRemotePayload(row: LocalRow): Tables['timer_runs']['Insert'] {
  return {
    id: localRowId(row),
    user_id: requireString(row, 'user_id'),
    template_id: optionalString(row, 'template_id'),
    name: requireString(row, 'name'),
    duration_seconds: requireNumber(row, 'duration_seconds'),
    bereich: requireString(row, 'bereich'),
    started_at: isoValue(row, 'started_at') ?? new Date().toISOString(),
    completed_at: isoValue(row, 'completed_at'),
    cancelled: booleanValue(row, 'cancelled'),
    created_at: isoValue(row, 'created_at'),
    updated_at: isoValue(row, 'updated_at'),
  };
}

export function protokollRemotePayload(row: LocalRow): Tables['protokolle']['Insert'] {
  return {
    id: localRowId(row),
    user_id: requireString(row, 'user_id'),
    name: requireString(row, 'name'),
    bereich: requireString(row, 'bereich'),
    description: optionalString(row, 'description'),
    steps: jsonValue(row, 'steps_json'),
    source: optionalString(row, 'source'),
    is_public: booleanValue(row, 'is_public'),
    created_at: isoValue(row, 'created_at'),
    updated_at: isoValue(row, 'updated_at'),
  };
}

export function protokollRunRemotePayload(row: LocalRow): Tables['protokoll_runs']['Insert'] {
  return {
    id: localRowId(row),
    user_id: requireString(row, 'user_id'),
    protokoll_id: optionalString(row, 'protokoll_id'),
    protokoll_snapshot: jsonValue(row, 'protokoll_snapshot_json'),
    started_at: isoValue(row, 'started_at') ?? new Date().toISOString(),
    completed_at: isoValue(row, 'completed_at'),
    notes: optionalString(row, 'notes'),
    created_at: isoValue(row, 'created_at'),
    updated_at: isoValue(row, 'updated_at'),
  };
}

export function kolonieCountRemotePayload(row: LocalRow): Tables['kolonie_counts']['Insert'] {
  return {
    id: localRowId(row),
    user_id: requireString(row, 'user_id'),
    name: optionalString(row, 'name'),
    patient_id_local: optionalString(row, 'patient_id_local'),
    agar_type: optionalString(row, 'agar_type'),
    dilution: optionalString(row, 'dilution'),
    counts: jsonValue(row, 'counts_json'),
    total_cfu: optionalNumber(row, 'total_cfu'),
    notes: optionalString(row, 'notes'),
    photo_path: optionalString(row, 'photo_path'),
    created_at: isoValue(row, 'created_at'),
    updated_at: isoValue(row, 'updated_at'),
  };
}

export function differentialCountRemotePayload(row: LocalRow): Tables['differential_counts']['Insert'] {
  return {
    id: localRowId(row),
    user_id: requireString(row, 'user_id'),
    name: optionalString(row, 'name'),
    patient_id_local: optionalString(row, 'patient_id_local'),
    counts: jsonValue(row, 'counts_json'),
    total_cells: requireNumber(row, 'total_cells'),
    notes: optionalString(row, 'notes'),
    created_at: isoValue(row, 'created_at'),
    updated_at: isoValue(row, 'updated_at'),
  };
}