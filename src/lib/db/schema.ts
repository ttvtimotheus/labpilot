import { integer, sqliteTable, text } from 'drizzle-orm/sqlite-core';

export const timerTemplates = sqliteTable('timer_templates', {
  id: text('id').primaryKey(),
  userId: text('user_id').notNull(),
  name: text('name').notNull(),
  durationSeconds: integer('duration_seconds').notNull(),
  bereich: text('bereich').notNull(),
  description: text('description'),
  isPublic: integer('is_public', { mode: 'boolean' }).default(false),
  createdAt: integer('created_at', { mode: 'timestamp' }),
  updatedAt: integer('updated_at', { mode: 'timestamp' }),
  syncedAt: integer('synced_at', { mode: 'timestamp' }),
  pendingDelete: integer('pending_delete', { mode: 'boolean' }).default(false),
});

export const timerRuns = sqliteTable('timer_runs', {
  id: text('id').primaryKey(),
  userId: text('user_id').notNull(),
  templateId: text('template_id'),
  name: text('name').notNull(),
  durationSeconds: integer('duration_seconds').notNull(),
  bereich: text('bereich').notNull(),
  startedAt: integer('started_at', { mode: 'timestamp' }),
  completedAt: integer('completed_at', { mode: 'timestamp' }),
  cancelled: integer('cancelled', { mode: 'boolean' }).default(false),
  createdAt: integer('created_at', { mode: 'timestamp' }),
  updatedAt: integer('updated_at', { mode: 'timestamp' }),
  syncedAt: integer('synced_at', { mode: 'timestamp' }),
  pendingDelete: integer('pending_delete', { mode: 'boolean' }).default(false),
});

export const protokolle = sqliteTable('protokolle', {
  id: text('id').primaryKey(),
  userId: text('user_id'),
  name: text('name').notNull(),
  bereich: text('bereich').notNull(),
  description: text('description'),
  stepsJson: text('steps_json').notNull(),
  source: text('source'),
  isPublic: integer('is_public', { mode: 'boolean' }).default(false),
  createdAt: integer('created_at', { mode: 'timestamp' }),
  updatedAt: integer('updated_at', { mode: 'timestamp' }),
  syncedAt: integer('synced_at', { mode: 'timestamp' }),
  pendingDelete: integer('pending_delete', { mode: 'boolean' }).default(false),
});

export const protokollRuns = sqliteTable('protokoll_runs', {
  id: text('id').primaryKey(),
  userId: text('user_id').notNull(),
  protokollId: text('protokoll_id'),
  protokollSnapshotJson: text('protokoll_snapshot_json').notNull(),
  startedAt: integer('started_at', { mode: 'timestamp' }),
  completedAt: integer('completed_at', { mode: 'timestamp' }),
  notes: text('notes'),
  createdAt: integer('created_at', { mode: 'timestamp' }),
  updatedAt: integer('updated_at', { mode: 'timestamp' }),
  syncedAt: integer('synced_at', { mode: 'timestamp' }),
  pendingDelete: integer('pending_delete', { mode: 'boolean' }).default(false),
});

export const kolonieCounts = sqliteTable('kolonie_counts', {
  id: text('id').primaryKey(),
  userId: text('user_id').notNull(),
  name: text('name'),
  patientIdLocal: text('patient_id_local'),
  agarType: text('agar_type'),
  dilution: text('dilution'),
  countsJson: text('counts_json').notNull(),
  totalCfu: integer('total_cfu'),
  notes: text('notes'),
  photoPath: text('photo_path'),
  createdAt: integer('created_at', { mode: 'timestamp' }),
  updatedAt: integer('updated_at', { mode: 'timestamp' }),
  syncedAt: integer('synced_at', { mode: 'timestamp' }),
  pendingDelete: integer('pending_delete', { mode: 'boolean' }).default(false),
});

export const differentialCounts = sqliteTable('differential_counts', {
  id: text('id').primaryKey(),
  userId: text('user_id').notNull(),
  name: text('name'),
  patientIdLocal: text('patient_id_local'),
  countsJson: text('counts_json').notNull(),
  totalCells: integer('total_cells').notNull().default(100),
  notes: text('notes'),
  createdAt: integer('created_at', { mode: 'timestamp' }),
  updatedAt: integer('updated_at', { mode: 'timestamp' }),
  syncedAt: integer('synced_at', { mode: 'timestamp' }),
  pendingDelete: integer('pending_delete', { mode: 'boolean' }).default(false),
});
