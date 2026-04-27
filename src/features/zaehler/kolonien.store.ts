import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

import { zustandStorage } from '@/src/lib/storage/zustand';
import type { KolonieCategory } from '@/src/types/domain';
export { calculateCfu } from '@/src/features/zaehler/cfu';

export const defaultKolonieCategories: KolonieCategory[] = [
  { id: 'cream', label: 'Creme', colour: '#E8D8B8', count: 0 },
  { id: 'yellow', label: 'Gelb', colour: '#E6B800', count: 0 },
  { id: 'red', label: 'Rot', colour: '#C84630', count: 0 },
  { id: 'transparent', label: 'Transparent', colour: '#8EB8D8', count: 0 },
  { id: 'other', label: 'Sonstige', colour: '#7A7A80', count: 0 },
];

interface KolonieStore {
  categories: KolonieCategory[];
  dilutionFactor: number;
  platedVolumeMl: number;
  increment: (id: string) => void;
  decrement: (id: string) => void;
  reset: () => void;
  setDilutionFactor: (value: number) => void;
  setPlatedVolumeMl: (value: number) => void;
}

export const useKolonieStore = create<KolonieStore>()(
  persist(
    (set) => ({
      categories: defaultKolonieCategories,
      dilutionFactor: 1000,
      platedVolumeMl: 0.1,
      increment: (id) =>
        set((state) => ({
          categories: state.categories.map((category) =>
            category.id === id ? { ...category, count: category.count + 1 } : category,
          ),
        })),
      decrement: (id) =>
        set((state) => ({
          categories: state.categories.map((category) =>
            category.id === id ? { ...category, count: Math.max(0, category.count - 1) } : category,
          ),
        })),
      reset: () => set({ categories: defaultKolonieCategories }),
      setDilutionFactor: (value) => set({ dilutionFactor: Math.max(1, value) }),
      setPlatedVolumeMl: (value) => set({ platedVolumeMl: Math.max(0.01, value) }),
    }),
    {
      name: 'labpilot.kolonien-store',
      storage: createJSONStorage(() => zustandStorage),
    },
  ),
);

