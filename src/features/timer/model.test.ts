import { describe, expect, it } from 'vitest';

import { buildActiveTimer, buildTimerRun, createTimerTemplate } from '@/src/features/timer/model';

const fixedNow = new Date('2026-04-27T10:00:00.000Z');

describe('timer model', () => {
  it('creates templates with deterministic metadata', () => {
    expect(createTimerTemplate({ name: 'Lugol', durationSeconds: 60, bereich: 'mibi', userId: 'user_1' }, { id: 'template_1', now: fixedNow })).toMatchObject({
      id: 'template_1',
      userId: 'user_1',
      name: 'Lugol',
      durationSeconds: 60,
      isPublic: false,
      createdAt: fixedNow.toISOString(),
      updatedAt: fixedNow.toISOString(),
    });
  });

  it('builds active timers with correct end time', () => {
    const timer = buildActiveTimer({ name: 'Timer', durationSeconds: 90, bereich: 'general', notificationId: 'notif_1' }, { id: 'timer_1', now: fixedNow });

    expect(timer.startedAt).toBe('2026-04-27T10:00:00.000Z');
    expect(timer.endsAt).toBe('2026-04-27T10:01:30.000Z');
    expect(timer.notificationId).toBe('notif_1');
  });

  it('converts active timers into completed or cancelled runs', () => {
    const timer = buildActiveTimer({ templateId: 'template_1', name: 'Timer', durationSeconds: 30, bereich: 'histo' }, { id: 'timer_1', now: fixedNow });
    const completedAt = new Date('2026-04-27T10:02:00.000Z');

    expect(buildTimerRun(timer, false, { id: 'run_1', now: completedAt })).toMatchObject({
      id: 'run_1',
      templateId: 'template_1',
      completedAt: completedAt.toISOString(),
      cancelled: false,
    });
    expect(buildTimerRun(timer, true, { id: 'run_2', now: completedAt }).cancelled).toBe(true);
  });
});