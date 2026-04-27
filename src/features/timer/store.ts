import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

import { cancelNotification, scheduleTimerNotification } from '@/src/lib/notifications';
import { createId } from '@/src/lib/utils/id';
import { zustandStorage } from '@/src/lib/storage/zustand';
import type { ActiveTimer, Bereich, TimerTemplate } from '@/src/types/domain';

const now = new Date().toISOString();

export const defaultTimerTemplates: TimerTemplate[] = [
  {
    id: 'timer_gram_lugol',
    userId: 'system',
    name: 'Gram: Lugol',
    durationSeconds: 60,
    bereich: 'mibi',
    description: 'Standard-Einwirkzeit fuer Lugol bei der Gram-Faerbung.',
    isPublic: true,
    createdAt: now,
    updatedAt: now,
  },
  {
    id: 'timer_zn_carbol',
    userId: 'system',
    name: 'Ziehl-Neelsen: Carbolfuchsin',
    durationSeconds: 300,
    bereich: 'mibi',
    description: 'Erwaermen und feucht halten, nicht austrocknen lassen.',
    isPublic: true,
    createdAt: now,
    updatedAt: now,
  },
  {
    id: 'timer_he_haematoxylin',
    userId: 'system',
    name: 'HE: Haematoxylin',
    durationSeconds: 360,
    bereich: 'histo',
    description: 'Routinefaerbung, Laborstandard pruefen.',
    isPublic: true,
    createdAt: now,
    updatedAt: now,
  },
];

interface TimerStore {
  templates: TimerTemplate[];
  activeTimers: ActiveTimer[];
  addTemplate: (input: { name: string; durationSeconds: number; bereich: Bereich; description?: string; userId: string }) => void;
  removeTemplate: (id: string) => void;
  startTimer: (template: TimerTemplate) => Promise<ActiveTimer>;
  startCustomTimer: (input: { name: string; durationSeconds: number; bereich: Bereich }) => Promise<ActiveTimer>;
  cancelTimer: (id: string) => Promise<void>;
  completeTimer: (id: string) => Promise<void>;
  resetAll: () => Promise<void>;
}

function buildActiveTimer(input: { templateId?: string; name: string; durationSeconds: number; bereich: Bereich; notificationId?: string }): ActiveTimer {
  const startedAt = new Date();
  const endsAt = new Date(startedAt.getTime() + input.durationSeconds * 1000);

  return {
    id: createId('timer'),
    templateId: input.templateId,
    name: input.name,
    durationSeconds: input.durationSeconds,
    startedAt: startedAt.toISOString(),
    endsAt: endsAt.toISOString(),
    bereich: input.bereich,
    notificationId: input.notificationId,
  };
}

export const useTimerStore = create<TimerStore>()(
  persist(
    (set, get) => ({
      templates: defaultTimerTemplates,
      activeTimers: [],
      addTemplate: ({ userId, ...input }) => {
        const timestamp = new Date().toISOString();
        const template: TimerTemplate = {
          ...input,
          userId,
          id: createId('template'),
          isPublic: false,
          createdAt: timestamp,
          updatedAt: timestamp,
        };
        set((state) => ({ templates: [template, ...state.templates] }));
      },
      removeTemplate: (id) => set((state) => ({ templates: state.templates.filter((template) => template.id !== id) })),
      startTimer: async (template) => {
        const notificationId = await scheduleTimerNotification(template.name, template.durationSeconds);
        const activeTimer = buildActiveTimer({
          templateId: template.id,
          name: template.name,
          durationSeconds: template.durationSeconds,
          bereich: template.bereich,
          notificationId,
        });
        set((state) => ({ activeTimers: [activeTimer, ...state.activeTimers] }));
        return activeTimer;
      },
      startCustomTimer: async (input) => {
        const notificationId = await scheduleTimerNotification(input.name, input.durationSeconds);
        const activeTimer = buildActiveTimer({ ...input, notificationId });
        set((state) => ({ activeTimers: [activeTimer, ...state.activeTimers] }));
        return activeTimer;
      },
      cancelTimer: async (id) => {
        const timer = get().activeTimers.find((candidate) => candidate.id === id);
        await cancelNotification(timer?.notificationId);
        set((state) => ({ activeTimers: state.activeTimers.filter((candidate) => candidate.id !== id) }));
      },
      completeTimer: async (id) => {
        const timer = get().activeTimers.find((candidate) => candidate.id === id);
        await cancelNotification(timer?.notificationId);
        set((state) => ({ activeTimers: state.activeTimers.filter((candidate) => candidate.id !== id) }));
      },
      resetAll: async () => {
        await Promise.all(get().activeTimers.map((timer) => cancelNotification(timer.notificationId)));
        set({ activeTimers: [] });
      },
    }),
    {
      name: 'labpilot.timer-store',
      storage: createJSONStorage(() => zustandStorage),
      partialize: (state) => ({ templates: state.templates, activeTimers: state.activeTimers }),
    },
  ),
);
