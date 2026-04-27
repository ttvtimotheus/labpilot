import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

import { zustandStorage } from '@/src/lib/storage/zustand';
import { createId } from '@/src/lib/utils/id';
import type { DifferentialCell, DifferentialCountSnapshot } from '@/src/types/domain';

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
  savedCounts: DifferentialCountSnapshot[];
  target: number;
  increment: (id: string) => void;
  decrement: (id: string) => void;
  saveCurrent: (name?: string) => DifferentialCountSnapshot | null;
  removeSavedCount: (id: string) => void;
  reset: () => void;
  setTarget: (target: number) => void;
}

export const useDifferentialStore = create<DifferentialStore>()(
  persist(
    (set) => ({
      cells: defaultDifferentialCells,
      savedCounts: [],
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
      saveCurrent: (name) => {
        let snapshot: DifferentialCountSnapshot | null = null;
        set((state) => {
          const totalCells = state.cells.reduce((sum, cell) => sum + cell.count, 0);
          if (!totalCells) return state;
          snapshot = {
            id: createId('differential_count'),
            name: name?.trim() || undefined,
            cells: state.cells,
            totalCells,
            target: state.target,
            createdAt: new Date().toISOString(),
          };
          return { savedCounts: [snapshot, ...state.savedCounts].slice(0, 100) };
        });
        return snapshot;
      },
      removeSavedCount: (id) => set((state) => ({ savedCounts: state.savedCounts.filter((count) => count.id !== id) })),
      reset: () => set({ cells: defaultDifferentialCells }),
      setTarget: (target) => set({ target: Math.max(20, target) }),
    }),
    {
      name: 'labpilot.differential-store',
      storage: createJSONStorage(() => zustandStorage),
    },
  ),
);
