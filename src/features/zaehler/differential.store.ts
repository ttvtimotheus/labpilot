import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

import { zustandStorage } from '@/src/lib/storage/zustand';
import type { DifferentialCell } from '@/src/types/domain';

export const defaultDifferentialCells: DifferentialCell[] = [
  { id: 'neutro', label: 'Segmentkernige Neutrophile', shortLabel: 'Neu', count: 0 },
  { id: 'stab', label: 'Stabkernige Neutrophile', shortLabel: 'Stab', count: 0 },
  { id: 'lympho', label: 'Lymphozyten', shortLabel: 'Lym', count: 0 },
  { id: 'mono', label: 'Monozyten', shortLabel: 'Mon', count: 0 },
  { id: 'eosino', label: 'Eosinophile', shortLabel: 'Eos', count: 0 },
  { id: 'baso', label: 'Basophile', shortLabel: 'Bas', count: 0 },
  { id: 'atypical', label: 'Atypische Zellen', shortLabel: 'Atyp', count: 0 },
];

interface DifferentialStore {
  cells: DifferentialCell[];
  target: number;
  increment: (id: string) => void;
  decrement: (id: string) => void;
  reset: () => void;
  setTarget: (target: number) => void;
}

export const useDifferentialStore = create<DifferentialStore>()(
  persist(
    (set) => ({
      cells: defaultDifferentialCells,
      target: 100,
      increment: (id) =>
        set((state) => {
          const total = state.cells.reduce((sum, cell) => sum + cell.count, 0);
          if (total >= state.target) return state;
          return {
            cells: state.cells.map((cell) => (cell.id === id ? { ...cell, count: cell.count + 1 } : cell)),
          };
        }),
      decrement: (id) =>
        set((state) => ({
          cells: state.cells.map((cell) => (cell.id === id ? { ...cell, count: Math.max(0, cell.count - 1) } : cell)),
        })),
      reset: () => set({ cells: defaultDifferentialCells }),
      setTarget: (target) => set({ target: Math.max(20, target) }),
    }),
    {
      name: 'labpilot.differential-store',
      storage: createJSONStorage(() => zustandStorage),
    },
  ),
);
