import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

import { cancelNotification, scheduleTimerNotification } from '@/src/lib/notifications';
import { mergeById, prependLimited } from '@/src/lib/utils/collections';
import { zustandStorage } from '@/src/lib/storage/zustand';
import { buildActiveTimer, buildTimerRun, createTimerTemplate } from '@/src/features/timer/model';
import type { ActiveTimer, Bereich, TimerRun, TimerTemplate } from '@/src/types/domain';

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
  completedRuns: TimerRun[];
  addTemplate: (input: { name: string; durationSeconds: number; bereich: Bereich; description?: string; userId: string }) => TimerTemplate;
  removeTemplate: (id: string) => void;
  startTimer: (template: TimerTemplate) => Promise<ActiveTimer>;
  startCustomTimer: (input: { name: string; durationSeconds: number; bereich: Bereich }) => Promise<ActiveTimer>;
  cancelTimer: (id: string) => Promise<TimerRun | null>;
  completeTimer: (id: string) => Promise<TimerRun | null>;
  clearHistory: () => void;
  resetAll: () => Promise<void>;
  hydrateLocalData: (input: { templates: TimerTemplate[]; completedRuns: TimerRun[] }) => void;
}

export const useTimerStore = create<TimerStore>()(
  persist(
    (set, get) => ({
      templates: defaultTimerTemplates,
      activeTimers: [],
      completedRuns: [],
      addTemplate: ({ userId, ...input }) => {
        const template = createTimerTemplate({ ...input, userId });
        set((state) => ({ templates: [template, ...state.templates] }));
        return template;
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
        const run = timer ? buildTimerRun(timer, true) : null;
        set((state) => ({
          activeTimers: state.activeTimers.filter((candidate) => candidate.id !== id),
          completedRuns: run ? prependLimited(run, state.completedRuns) : state.completedRuns,
        }));
        return run;
      },
      completeTimer: async (id) => {
        const timer = get().activeTimers.find((candidate) => candidate.id === id);
        await cancelNotification(timer?.notificationId);
        const run = timer ? buildTimerRun(timer, false) : null;
        set((state) => ({
          activeTimers: state.activeTimers.filter((candidate) => candidate.id !== id),
          completedRuns: run ? prependLimited(run, state.completedRuns) : state.completedRuns,
        }));
        return run;
      },
      clearHistory: () => set({ completedRuns: [] }),
      resetAll: async () => {
        await Promise.all(get().activeTimers.map((timer) => cancelNotification(timer.notificationId)));
        set({ activeTimers: [] });
      },
      hydrateLocalData: ({ templates, completedRuns }) => {
        set((state) => ({
          templates: mergeById(templates, state.templates, 200),
          completedRuns: mergeById(completedRuns, state.completedRuns, 100),
        }));
      },
    }),
    {
      name: 'labpilot.timer-store',
      storage: createJSONStorage(() => zustandStorage),
      partialize: (state) => ({ templates: state.templates, activeTimers: state.activeTimers, completedRuns: state.completedRuns }),
    },
  ),
);
