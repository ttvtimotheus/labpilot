import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

import { zustandStorage } from '@/src/lib/storage/zustand';
import { decrementCountById, incrementCountById, mergeById, prependLimited } from '@/src/lib/utils/collections';
import { createKolonieCountSnapshot } from '@/src/features/zaehler/snapshots';
import type { KolonieCategory, KolonieCountSnapshot } from '@/src/types/domain';
import { calculateCfu } from '@/src/features/zaehler/cfu';

export { calculateCfu };

export const defaultKolonieCategories: KolonieCategory[] = [
  { id: 'cream', label: 'Creme', colour: '#E8D8B8', count: 0 },
  { id: 'yellow', label: 'Gelb', colour: '#E6B800', count: 0 },
  { id: 'red', label: 'Rot', colour: '#C84630', count: 0 },
  { id: 'transparent', label: 'Transparent', colour: '#8EB8D8', count: 0 },
  { id: 'other', label: 'Sonstige', colour: '#7A7A80', count: 0 },
];

interface KolonieStore {
  categories: KolonieCategory[];
  savedCounts: KolonieCountSnapshot[];
  dilutionFactor: number;
  platedVolumeMl: number;
  increment: (id: string) => void;
  decrement: (id: string) => void;
  saveCurrent: (name?: string) => KolonieCountSnapshot | null;
  removeSavedCount: (id: string) => void;
  clearSavedCounts: () => void;
  reset: () => void;
  setDilutionFactor: (value: number) => void;
  setPlatedVolumeMl: (value: number) => void;
  hydrateSavedCounts: (counts: KolonieCountSnapshot[]) => void;
}

export const useKolonieStore = create<KolonieStore>()(
  persist(
    (set) => ({
      categories: defaultKolonieCategories,
      savedCounts: [],
      dilutionFactor: 1000,
      platedVolumeMl: 0.1,
      increment: (id) =>
        set((state) => ({
          categories: incrementCountById(state.categories, id),
        })),
      decrement: (id) =>
        set((state) => ({
          categories: decrementCountById(state.categories, id),
        })),
      saveCurrent: (name) => {
        let snapshot: KolonieCountSnapshot | null = null;
        set((state) => {
          snapshot = createKolonieCountSnapshot({ name, categories: state.categories, dilutionFactor: state.dilutionFactor, platedVolumeMl: state.platedVolumeMl });
          if (!snapshot) return state;
          return { savedCounts: prependLimited(snapshot, state.savedCounts) };
        });
        return snapshot;
      },
      removeSavedCount: (id) => set((state) => ({ savedCounts: state.savedCounts.filter((count) => count.id !== id) })),
      clearSavedCounts: () => set({ savedCounts: [] }),
      reset: () => set({ categories: defaultKolonieCategories }),
      setDilutionFactor: (value) => set({ dilutionFactor: Math.max(1, value) }),
      setPlatedVolumeMl: (value) => set({ platedVolumeMl: Math.max(0.01, value) }),
      hydrateSavedCounts: (counts) => set((state) => ({ savedCounts: mergeById(counts, state.savedCounts, 100) })),
    }),
    {
      name: 'labpilot.kolonien-store',
      storage: createJSONStorage(() => zustandStorage),
    },
  ),
);

