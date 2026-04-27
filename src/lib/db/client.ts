import { open } from '@op-engineering/op-sqlite';
import { drizzle } from 'drizzle-orm/op-sqlite';

import * as schema from '@/src/lib/db/schema';

const sqlite = open({ name: 'labpilot.db' });

export const db = drizzle(sqlite, { schema });

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
}
