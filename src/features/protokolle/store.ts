import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

import { addProtokollRunToHistory, createProtokollRun } from '@/src/features/protokolle/run';
import { zustandStorage } from '@/src/lib/storage/zustand';
import { mergeById } from '@/src/lib/utils/collections';
import type { Protokoll, ProtokollRun } from '@/src/types/domain';

interface ProtokollRunStore {
  completedRuns: ProtokollRun[];
  completeRun: (input: { protokoll: Protokoll; startedAt: string; notes?: string }) => ProtokollRun;
  removeRun: (id: string) => void;
  clearRuns: () => void;
  hydrateLocalRuns: (runs: ProtokollRun[]) => void;
}

export const useProtokollRunStore = create<ProtokollRunStore>()(
  persist(
    (set) => ({
      completedRuns: [],
      completeRun: ({ protokoll, startedAt, notes }) => {
        const run = createProtokollRun({ protokoll, startedAt, notes });
        set((state) => ({ completedRuns: addProtokollRunToHistory(run, state.completedRuns) }));
        return run;
      },
      removeRun: (id) => set((state) => ({ completedRuns: state.completedRuns.filter((run) => run.id !== id) })),
      clearRuns: () => set({ completedRuns: [] }),
      hydrateLocalRuns: (runs) => set((state) => ({ completedRuns: mergeById(runs, state.completedRuns, 100) })),
    }),
    {
      name: 'labpilot.protokoll-runs',
      storage: createJSONStorage(() => zustandStorage),
      partialize: (state) => ({ completedRuns: state.completedRuns }),
    },
  ),
);