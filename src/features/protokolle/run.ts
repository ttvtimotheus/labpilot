import { prependLimited } from '@/src/lib/utils/collections';
import { createId } from '@/src/lib/utils/id';
import type { Protokoll, ProtokollRun } from '@/src/types/domain';

interface CreateRunOptions {
  id?: string;
  now?: Date;
}

export function createProtokollRun(
  input: { protokoll: Protokoll; startedAt: string; notes?: string },
  options: CreateRunOptions = {},
): ProtokollRun {
  return {
    id: options.id ?? createId('protokoll_run'),
    protokollId: input.protokoll.id,
    protokollSnapshot: input.protokoll,
    startedAt: input.startedAt,
    completedAt: (options.now ?? new Date()).toISOString(),
    notes: input.notes?.trim() || undefined,
  };
}

export function addProtokollRunToHistory(run: ProtokollRun, completedRuns: ProtokollRun[], limit = 100) {
  return prependLimited(run, completedRuns, limit);
}