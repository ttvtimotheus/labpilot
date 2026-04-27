import { createId } from '@/src/lib/utils/id';
import type { ActiveTimer, Bereich, TimerRun, TimerTemplate } from '@/src/types/domain';

interface BuildOptions {
  id?: string;
  now?: Date;
}

export function createTimerTemplate(
  input: { name: string; durationSeconds: number; bereich: Bereich; description?: string; userId: string },
  options: BuildOptions = {},
): TimerTemplate {
  const timestamp = (options.now ?? new Date()).toISOString();

  return {
    id: options.id ?? createId('template'),
    userId: input.userId,
    name: input.name,
    durationSeconds: input.durationSeconds,
    bereich: input.bereich,
    description: input.description,
    isPublic: false,
    createdAt: timestamp,
    updatedAt: timestamp,
  };
}

export function buildActiveTimer(
  input: { templateId?: string; name: string; durationSeconds: number; bereich: Bereich; notificationId?: string },
  options: BuildOptions = {},
): ActiveTimer {
  const startedAt = options.now ?? new Date();
  const endsAt = new Date(startedAt.getTime() + input.durationSeconds * 1000);

  return {
    id: options.id ?? createId('timer'),
    templateId: input.templateId,
    name: input.name,
    durationSeconds: input.durationSeconds,
    startedAt: startedAt.toISOString(),
    endsAt: endsAt.toISOString(),
    bereich: input.bereich,
    notificationId: input.notificationId,
  };
}

export function buildTimerRun(timer: ActiveTimer, cancelled: boolean, options: BuildOptions = {}): TimerRun {
  return {
    id: options.id ?? createId('timer_run'),
    templateId: timer.templateId,
    name: timer.name,
    durationSeconds: timer.durationSeconds,
    startedAt: timer.startedAt,
    completedAt: (options.now ?? new Date()).toISOString(),
    bereich: timer.bereich,
    cancelled,
  };
}