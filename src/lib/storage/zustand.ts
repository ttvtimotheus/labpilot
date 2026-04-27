import type { StateStorage } from 'zustand/middleware';

import { appStorage } from '@/src/lib/storage/mmkv';

export const zustandStorage: StateStorage = {
  getItem: (name) => appStorage.getString(name) ?? null,
  setItem: (name, value) => appStorage.set(name, value),
  removeItem: (name) => {
    appStorage.remove(name);
  },
};
