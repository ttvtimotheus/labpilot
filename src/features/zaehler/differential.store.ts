import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

import { createDifferentialCountSnapshot } from '@/src/features/zaehler/snapshots';
import { zustandStorage } from '@/src/lib/storage/zustand';
import { decrementCountById, incrementCountById, mergeById, prependLimited, sumCounts } from '@/src/lib/utils/collections';
import type { DifferentialCell, DifferentialCountSnapshot } from '@/src/types/domain';

export const defaultDifferentialCells: DifferentialCell[] = [
  { id: 'neutro', label: 'Segmentkernige Neutrophile', shortLabel: 'Seg', count: 0 },
  { id: 'stab', label: 'Stabkernige Neutrophile', shortLabel: 'Stab', count: 0 },
  { id: 'lympho', label: 'Lymphozyten', shortLabel: 'Lym', count: 0 },
  { id: 'mono', label: 'Monozyten', shortLabel: 'Mon', count: 0 },
  { id: 'eosino', label: 'Eosinophile', shortLabel: 'Eos', count: 0 },
  { id: 'baso', label: 'Basophile', shortLabel: 'Bas', count: 0 },
  { id: 'atypical', label: 'Atypische Zellen', shortLabel: 'Atyp', count: 0 },
];

interface DifferentialStore {
  cells: DifferentialCell[];
  savedCounts: DifferentialCountSnapshot[];
  target: number;
  increment: (id: string) => void;
  decrement: (id: string) => void;
  saveCurrent: (name?: string) => DifferentialCountSnapshot | null;
  removeSavedCount: (id: string) => void;
  clearSavedCounts: () => void;
  reset: () => void;
  restoreCells: (cells: DifferentialCell[]) => void;
  setTarget: (target: number) => void;
  hydrateSavedCounts: (counts: DifferentialCountSnapshot[]) => void;
}

export const useDifferentialStore = create<DifferentialStore>()(
  persist(
    (set) => ({
      cells: defaultDifferentialCells,
      savedCounts: [],
      target: 100,
      increment: (id) =>
        set((state) => {
          const total = sumCounts(state.cells);
          if (total >= state.target) return state;
          return {
            cells: incrementCountById(state.cells, id),
          };
        }),
      decrement: (id) =>
        set((state) => ({
          cells: decrementCountById(state.cells, id),
        })),
      saveCurrent: (name) => {
        let snapshot: DifferentialCountSnapshot | null = null;
        set((state) => {
          snapshot = createDifferentialCountSnapshot({ name, cells: state.cells, target: state.target });
          if (!snapshot) return state;
          return { savedCounts: prependLimited(snapshot, state.savedCounts) };
        });
        return snapshot;
      },
      removeSavedCount: (id) => set((state) => ({ savedCounts: state.savedCounts.filter((count) => count.id !== id) })),
      clearSavedCounts: () => set({ savedCounts: [] }),
      reset: () => set({ cells: defaultDifferentialCells }),
      restoreCells: (cells) => set({ cells }),
      setTarget: (target) => set({ target: Math.max(20, target) }),
      hydrateSavedCounts: (counts) => set((state) => ({ savedCounts: mergeById(counts, state.savedCounts, 100) })),
    }),
    {
      name: 'labpilot.differential-store',
      storage: createJSONStorage(() => zustandStorage),
    },
  ),
);
