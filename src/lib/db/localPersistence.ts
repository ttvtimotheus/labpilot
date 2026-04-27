import type { QueryResult, Scalar } from '@op-engineering/op-sqlite';

import { executeLocalSql, migrateLocalDb } from '@/src/lib/db/client';
import {
  localDifferentialCountFromRow,
  localKolonieCountFromRow,
  localProtokollRunFromRow,
  localTimerRunFromRow,
  localTimerTemplateFromRow,
} from '@/src/lib/db/localRows';
import { syncTables, type SyncTable } from '@/src/lib/db/syncModel';
import type { Database, Json } from '@/src/types/database.types';
import type { DifferentialCountSnapshot, KolonieCountSnapshot, ProtokollRun, TimerRun, TimerTemplate } from '@/src/types/domain';

type Tables = Database['public']['Tables'];

const tableSet = new Set<string>(syncTables);

function epoch(value: string | undefined) {
  const time = value ? new Date(value).getTime() : Date.now();
  return Number.isFinite(time) ? time : Date.now();
}

function remoteEpoch(value: string | null | undefined) {
  return epoch(value ?? undefined);
}

function jsonText(value: Json) {
  return JSON.stringify(value);
}

function nullable(value: string | undefined | null) {
  return value?.trim() ? value : null;
}

function booleanInt(value: boolean | undefined) {
  return value ? 1 : 0;
}

function assertSyncTable(table: SyncTable) {
  if (!tableSet.has(table)) throw new Error(`Unbekannte Sync-Tabelle: ${table}`);
}

async function executeAfterMigration(query: string, params: Scalar[]) {
  await migrateLocalDb();
  return executeLocalSql(query, params);
}

export async function saveTimerTemplateLocal(template: TimerTemplate) {
  const createdAt = epoch(template.createdAt);
  const updatedAt = epoch(template.updatedAt);
  await executeAfterMigration(
    `insert into timer_templates (id, user_id, name, duration_seconds, bereich, description, is_public, created_at, updated_at, synced_at, pending_delete)
     values (?, ?, ?, ?, ?, ?, ?, ?, ?, null, 0)
     on conflict(id) do update set
       user_id = excluded.user_id,
       name = excluded.name,
       duration_seconds = excluded.duration_seconds,
       bereich = excluded.bereich,
       description = excluded.description,
       is_public = excluded.is_public,
       updated_at = excluded.updated_at,
       synced_at = null,
       pending_delete = 0`,
    [template.id, template.userId, template.name, template.durationSeconds, template.bereich, nullable(template.description), booleanInt(template.isPublic), createdAt, updatedAt],
  );
}

export async function saveTimerRunLocal(userId: string, run: TimerRun) {
  const completedAt = epoch(run.completedAt);
  await executeAfterMigration(
    `insert into timer_runs (id, user_id, template_id, name, duration_seconds, bereich, started_at, completed_at, cancelled, created_at, updated_at, synced_at, pending_delete)
     values (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, null, 0)
     on conflict(id) do update set
       name = excluded.name,
       duration_seconds = excluded.duration_seconds,
       bereich = excluded.bereich,
       completed_at = excluded.completed_at,
       cancelled = excluded.cancelled,
       updated_at = excluded.updated_at,
       synced_at = null,
       pending_delete = 0`,
    [run.id, userId, nullable(run.templateId), run.name, run.durationSeconds, run.bereich, epoch(run.startedAt), completedAt, booleanInt(run.cancelled), completedAt, completedAt],
  );
}

export async function saveProtokollRunLocal(userId: string, run: ProtokollRun) {
  const completedAt = epoch(run.completedAt);
  await executeAfterMigration(
    `insert into protokoll_runs (id, user_id, protokoll_id, protokoll_snapshot_json, started_at, completed_at, notes, created_at, updated_at, synced_at, pending_delete)
     values (?, ?, ?, ?, ?, ?, ?, ?, ?, null, 0)
     on conflict(id) do update set
       protokoll_snapshot_json = excluded.protokoll_snapshot_json,
       completed_at = excluded.completed_at,
       notes = excluded.notes,
       updated_at = excluded.updated_at,
       synced_at = null,
       pending_delete = 0`,
    [run.id, userId, run.protokollId, JSON.stringify(run.protokollSnapshot), epoch(run.startedAt), completedAt, nullable(run.notes), completedAt, completedAt],
  );
}

export async function saveKolonieCountLocal(userId: string, count: KolonieCountSnapshot) {
  const createdAt = epoch(count.createdAt);
  await executeAfterMigration(
    `insert into kolonie_counts (id, user_id, name, counts_json, total_cfu, created_at, updated_at, synced_at, pending_delete)
     values (?, ?, ?, ?, ?, ?, ?, null, 0)
     on conflict(id) do update set
       name = excluded.name,
       counts_json = excluded.counts_json,
       total_cfu = excluded.total_cfu,
       updated_at = excluded.updated_at,
       synced_at = null,
       pending_delete = 0`,
    [
      count.id,
      userId,
      nullable(count.name),
      JSON.stringify({ categories: count.categories, dilutionFactor: count.dilutionFactor, platedVolumeMl: count.platedVolumeMl, totalColonies: count.totalColonies }),
      count.totalCfu,
      createdAt,
      createdAt,
    ],
  );
}

export async function saveDifferentialCountLocal(userId: string, count: DifferentialCountSnapshot) {
  const createdAt = epoch(count.createdAt);
  await executeAfterMigration(
    `insert into differential_counts (id, user_id, name, counts_json, total_cells, created_at, updated_at, synced_at, pending_delete)
     values (?, ?, ?, ?, ?, ?, ?, null, 0)
     on conflict(id) do update set
       name = excluded.name,
       counts_json = excluded.counts_json,
       total_cells = excluded.total_cells,
       updated_at = excluded.updated_at,
       synced_at = null,
       pending_delete = 0`,
    [count.id, userId, nullable(count.name), JSON.stringify({ cells: count.cells, target: count.target }), count.totalCells, createdAt, createdAt],
  );
}

export async function getPendingLocalRows(table: SyncTable, userId: string) {
  assertSyncTable(table);
  await migrateLocalDb();
  const result = await executeLocalSql(
    `select * from ${table} where user_id = ? and (synced_at is null or updated_at is null or updated_at > synced_at or pending_delete = 1)`,
    [userId],
  );
  return result.rows;
}

export async function upsertPulledTimerTemplate(row: Tables['timer_templates']['Row'], syncedAt = Date.now()) {
  await executeAfterMigration(
    `insert into timer_templates (id, user_id, name, duration_seconds, bereich, description, is_public, created_at, updated_at, synced_at, pending_delete)
     values (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 0)
     on conflict(id) do update set
       user_id = excluded.user_id,
       name = excluded.name,
       duration_seconds = excluded.duration_seconds,
       bereich = excluded.bereich,
       description = excluded.description,
       is_public = excluded.is_public,
       created_at = excluded.created_at,
       updated_at = excluded.updated_at,
       synced_at = excluded.synced_at,
       pending_delete = 0`,
    [row.id, row.user_id, row.name, row.duration_seconds, row.bereich ?? 'general', nullable(row.description), booleanInt(Boolean(row.is_public)), remoteEpoch(row.created_at), remoteEpoch(row.updated_at), syncedAt],
  );
}

export async function upsertPulledTimerRun(row: Tables['timer_runs']['Row'], syncedAt = Date.now()) {
  await executeAfterMigration(
    `insert into timer_runs (id, user_id, template_id, name, duration_seconds, bereich, started_at, completed_at, cancelled, created_at, updated_at, synced_at, pending_delete)
     values (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 0)
     on conflict(id) do update set
       template_id = excluded.template_id,
       name = excluded.name,
       duration_seconds = excluded.duration_seconds,
       bereich = excluded.bereich,
       started_at = excluded.started_at,
       completed_at = excluded.completed_at,
       cancelled = excluded.cancelled,
       created_at = excluded.created_at,
       updated_at = excluded.updated_at,
       synced_at = excluded.synced_at,
       pending_delete = 0`,
    [row.id, row.user_id, nullable(row.template_id), row.name, row.duration_seconds, row.bereich, remoteEpoch(row.started_at), remoteEpoch(row.completed_at), booleanInt(Boolean(row.cancelled)), remoteEpoch(row.created_at), remoteEpoch(row.updated_at), syncedAt],
  );
}

export async function upsertPulledProtokoll(row: Tables['protokolle']['Row'], syncedAt = Date.now()) {
  await executeAfterMigration(
    `insert into protokolle (id, user_id, name, bereich, description, steps_json, source, is_public, created_at, updated_at, synced_at, pending_delete)
     values (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 0)
     on conflict(id) do update set
       user_id = excluded.user_id,
       name = excluded.name,
       bereich = excluded.bereich,
       description = excluded.description,
       steps_json = excluded.steps_json,
       source = excluded.source,
       is_public = excluded.is_public,
       created_at = excluded.created_at,
       updated_at = excluded.updated_at,
       synced_at = excluded.synced_at,
       pending_delete = 0`,
    [row.id, row.user_id, row.name, row.bereich, nullable(row.description), jsonText(row.steps), nullable(row.source), booleanInt(Boolean(row.is_public)), remoteEpoch(row.created_at), remoteEpoch(row.updated_at), syncedAt],
  );
}

export async function upsertPulledProtokollRun(row: Tables['protokoll_runs']['Row'], syncedAt = Date.now()) {
  await executeAfterMigration(
    `insert into protokoll_runs (id, user_id, protokoll_id, protokoll_snapshot_json, started_at, completed_at, notes, created_at, updated_at, synced_at, pending_delete)
     values (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 0)
     on conflict(id) do update set
       protokoll_id = excluded.protokoll_id,
       protokoll_snapshot_json = excluded.protokoll_snapshot_json,
       started_at = excluded.started_at,
       completed_at = excluded.completed_at,
       notes = excluded.notes,
       created_at = excluded.created_at,
       updated_at = excluded.updated_at,
       synced_at = excluded.synced_at,
       pending_delete = 0`,
    [row.id, row.user_id, nullable(row.protokoll_id), jsonText(row.protokoll_snapshot), remoteEpoch(row.started_at), remoteEpoch(row.completed_at), nullable(row.notes), remoteEpoch(row.created_at), remoteEpoch(row.updated_at), syncedAt],
  );
}

export async function upsertPulledKolonieCount(row: Tables['kolonie_counts']['Row'], syncedAt = Date.now()) {
  await executeAfterMigration(
    `insert into kolonie_counts (id, user_id, name, patient_id_local, agar_type, dilution, counts_json, total_cfu, notes, photo_path, created_at, updated_at, synced_at, pending_delete)
     values (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 0)
     on conflict(id) do update set
       name = excluded.name,
       patient_id_local = excluded.patient_id_local,
       agar_type = excluded.agar_type,
       dilution = excluded.dilution,
       counts_json = excluded.counts_json,
       total_cfu = excluded.total_cfu,
       notes = excluded.notes,
       photo_path = excluded.photo_path,
       created_at = excluded.created_at,
       updated_at = excluded.updated_at,
       synced_at = excluded.synced_at,
       pending_delete = 0`,
    [row.id, row.user_id, nullable(row.name), nullable(row.patient_id_local), nullable(row.agar_type), nullable(row.dilution), jsonText(row.counts), row.total_cfu, nullable(row.notes), nullable(row.photo_path), remoteEpoch(row.created_at), remoteEpoch(row.updated_at), syncedAt],
  );
}

export async function upsertPulledDifferentialCount(row: Tables['differential_counts']['Row'], syncedAt = Date.now()) {
  await executeAfterMigration(
    `insert into differential_counts (id, user_id, name, patient_id_local, counts_json, total_cells, notes, created_at, updated_at, synced_at, pending_delete)
     values (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 0)
     on conflict(id) do update set
       name = excluded.name,
       patient_id_local = excluded.patient_id_local,
       counts_json = excluded.counts_json,
       total_cells = excluded.total_cells,
       notes = excluded.notes,
       created_at = excluded.created_at,
       updated_at = excluded.updated_at,
       synced_at = excluded.synced_at,
       pending_delete = 0`,
    [row.id, row.user_id, nullable(row.name), nullable(row.patient_id_local), jsonText(row.counts), row.total_cells, nullable(row.notes), remoteEpoch(row.created_at), remoteEpoch(row.updated_at), syncedAt],
  );
}

export async function markLocalRowsSynced(table: SyncTable, userId: string, ids: string[], syncedAt = Date.now()) {
  assertSyncTable(table);
  await migrateLocalDb();
  await Promise.all(ids.map((id) => executeLocalSql(`update ${table} set synced_at = ?, pending_delete = 0 where user_id = ? and id = ?`, [syncedAt, userId, id])));
}

export async function removeLocalRows(table: SyncTable, userId: string, ids: string[]) {
  assertSyncTable(table);
  await migrateLocalDb();
  await Promise.all(ids.map((id) => executeLocalSql(`delete from ${table} where user_id = ? and id = ?`, [userId, id])));
}

export async function markLocalRowsPendingDelete(table: SyncTable, userId: string, ids: string[], deletedAt = Date.now()) {
  assertSyncTable(table);
  await migrateLocalDb();
  await Promise.all(ids.map((id) => executeLocalSql(`update ${table} set pending_delete = 1, updated_at = ?, synced_at = null where user_id = ? and id = ?`, [deletedAt, userId, id])));
}

export async function markLocalTablePendingDelete(table: SyncTable, userId: string, deletedAt = Date.now()): Promise<QueryResult> {
  assertSyncTable(table);
  await migrateLocalDb();
  return executeLocalSql(`update ${table} set pending_delete = 1, updated_at = ?, synced_at = null where user_id = ? and pending_delete = 0`, [deletedAt, userId]);
}

export async function clearLocalRows(table: SyncTable, userId?: string): Promise<QueryResult> {
  assertSyncTable(table);
  await migrateLocalDb();
  return userId ? executeLocalSql(`delete from ${table} where user_id = ?`, [userId]) : executeLocalSql(`delete from ${table}`);
}

export async function clearOrMarkLocalRowsDeleted(table: SyncTable, userId?: string): Promise<QueryResult> {
  if (!userId || userId === 'local-user') return clearLocalRows(table, userId);
  return markLocalTablePendingDelete(table, userId);
}

export async function getPendingLocalChangeSummary(userId: string) {
  await migrateLocalDb();
  const entries = await Promise.all(
    syncTables.map(async (table) => {
      const result = await executeLocalSql(
        `select count(*) as count from ${table} where user_id = ? and (synced_at is null or updated_at is null or updated_at > synced_at or pending_delete = 1)`,
        [userId],
      );
      const value = result.rows[0]?.count;
      return [table, typeof value === 'number' ? value : 0] as const;
    }),
  );

  return Object.fromEntries(entries) as Record<SyncTable, number>;
}

export async function loadLocalTimerData(userId: string) {
  await migrateLocalDb();
  const [templateRows, runRows] = await Promise.all([
    executeLocalSql(`select * from timer_templates where user_id = ? and pending_delete = 0 order by updated_at desc, created_at desc limit 100`, [userId]),
    executeLocalSql(`select * from timer_runs where user_id = ? and pending_delete = 0 order by completed_at desc, updated_at desc limit 100`, [userId]),
  ]);

  return {
    templates: templateRows.rows.map(localTimerTemplateFromRow).filter((template): template is TimerTemplate => Boolean(template)),
    completedRuns: runRows.rows.map(localTimerRunFromRow).filter((run): run is TimerRun => Boolean(run)),
  };
}

export async function loadLocalProtokollRuns(userId: string) {
  await migrateLocalDb();
  const rows = await executeLocalSql(`select * from protokoll_runs where user_id = ? and pending_delete = 0 order by completed_at desc, updated_at desc limit 100`, [userId]);
  return rows.rows.map(localProtokollRunFromRow).filter((run): run is ProtokollRun => Boolean(run));
}

export async function loadLocalKolonieCounts(userId: string) {
  await migrateLocalDb();
  const rows = await executeLocalSql(`select * from kolonie_counts where user_id = ? and pending_delete = 0 order by created_at desc, updated_at desc limit 100`, [userId]);
  return rows.rows.map(localKolonieCountFromRow).filter((count): count is KolonieCountSnapshot => Boolean(count));
}

export async function loadLocalDifferentialCounts(userId: string) {
  await migrateLocalDb();
  const rows = await executeLocalSql(`select * from differential_counts where user_id = ? and pending_delete = 0 order by created_at desc, updated_at desc limit 100`, [userId]);
  return rows.rows.map(localDifferentialCountFromRow).filter((count): count is DifferentialCountSnapshot => Boolean(count));
}