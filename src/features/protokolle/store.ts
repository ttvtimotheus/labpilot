import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

import { zustandStorage } from '@/src/lib/storage/zustand';
import { createId } from '@/src/lib/utils/id';
import type { Protokoll, ProtokollRun } from '@/src/types/domain';

interface ProtokollRunStore {
  completedRuns: ProtokollRun[];
  completeRun: (input: { protokoll: Protokoll; startedAt: string; notes?: string }) => ProtokollRun;
  removeRun: (id: string) => void;
  clearRuns: () => void;
}

export const useProtokollRunStore = create<ProtokollRunStore>()(
  persist(
    (set) => ({
      completedRuns: [],
      completeRun: ({ protokoll, startedAt, notes }) => {
        const run: ProtokollRun = {
          id: createId('protokoll_run'),
          protokollId: protokoll.id,
          protokollSnapshot: protokoll,
          startedAt,
          completedAt: new Date().toISOString(),
          notes: notes?.trim() || undefined,
        };
        set((state) => ({ completedRuns: [run, ...state.completedRuns].slice(0, 100) }));
        return run;
      },
      removeRun: (id) => set((state) => ({ completedRuns: state.completedRuns.filter((run) => run.id !== id) })),
      clearRuns: () => set({ completedRuns: [] }),
    }),
    {
      name: 'labpilot.protokoll-runs',
      storage: createJSONStorage(() => zustandStorage),
      partialize: (state) => ({ completedRuns: state.completedRuns }),
    },
  ),
);