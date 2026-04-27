import { open } from '@op-engineering/op-sqlite';
import type { Scalar, SQLBatchTuple } from '@op-engineering/op-sqlite';
import { drizzle } from 'drizzle-orm/op-sqlite';

import * as schema from '@/src/lib/db/schema';

const sqlite = open({ name: 'labpilot.db' });

export const db = drizzle(sqlite, { schema });

export function executeLocalSql(query: string, params?: Scalar[]) {
  return sqlite.execute(query, params);
}

export function executeLocalBatch(commands: SQLBatchTuple[]) {
  return sqlite.executeBatch(commands);
}

export async function migrateLocalDb() {
  await sqlite.execute(`create table if not exists timer_templates (
    id text primary key,
    user_id text not null,
    name text not null,
    duration_seconds integer not null,
    bereich text not null,
    description text,
    is_public integer default 0,
    created_at integer,
    updated_at integer,
    synced_at integer,
    pending_delete integer default 0
  )`);

  await sqlite.execute(`create table if not exists timer_runs (
    id text primary key,
    user_id text not null,
    template_id text,
    name text not null,
    duration_seconds integer not null,
    bereich text not null,
    started_at integer,
    completed_at integer,
    cancelled integer default 0,
    created_at integer,
    updated_at integer,
    synced_at integer,
    pending_delete integer default 0
  )`);

  await sqlite.execute(`create table if not exists protokolle (
    id text primary key,
    user_id text,
    name text not null,
    bereich text not null,
    description text,
    steps_json text not null,
    source text,
    is_public integer default 0,
    created_at integer,
    updated_at integer,
    synced_at integer,
    pending_delete integer default 0
  )`);

  await sqlite.execute(`create table if not exists protokoll_runs (
    id text primary key,
    user_id text not null,
    protokoll_id text,
    protokoll_snapshot_json text not null,
    started_at integer,
    completed_at integer,
    notes text,
    created_at integer,
    updated_at integer,
    synced_at integer,
    pending_delete integer default 0
  )`);

  await sqlite.execute(`create table if not exists kolonie_counts (
    id text primary key,
    user_id text not null,
    name text,
    patient_id_local text,
    agar_type text,
    dilution text,
    counts_json text not null,
    total_cfu integer,
    notes text,
    photo_path text,
    created_at integer,
    updated_at integer,
    synced_at integer,
    pending_delete integer default 0
  )`);

  await sqlite.execute(`create table if not exists differential_counts (
    id text primary key,
    user_id text not null,
    name text,
    patient_id_local text,
    counts_json text not null,
    total_cells integer not null default 100,
    notes text,
    created_at integer,
    updated_at integer,
    synced_at integer,
    pending_delete integer default 0
  )`);

  await sqlite.execute('create index if not exists timer_templates_user_updated_idx on timer_templates (user_id, updated_at)');
  await sqlite.execute('create index if not exists timer_runs_user_updated_idx on timer_runs (user_id, updated_at)');
  await sqlite.execute('create index if not exists protokolle_user_updated_idx on protokolle (user_id, updated_at)');
  await sqlite.execute('create index if not exists protokoll_runs_user_updated_idx on protokoll_runs (user_id, updated_at)');
  await sqlite.execute('create index if not exists kolonie_counts_user_updated_idx on kolonie_counts (user_id, updated_at)');
  await sqlite.execute('create index if not exists differential_counts_user_updated_idx on differential_counts (user_id, updated_at)');
}
