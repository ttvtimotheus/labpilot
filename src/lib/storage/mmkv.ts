import { createMMKV } from 'react-native-mmkv';

export const appStorage = createMMKV({ id: 'labpilot-app' });
export const authStorage = createMMKV({ id: 'labpilot-auth' });

export const mmkvStorageAdapter = {
  getItem: (key: string) => authStorage.getString(key) ?? null,
  setItem: (key: string, value: string) => authStorage.set(key, value),
  removeItem: (key: string) => {
    authStorage.remove(key);
  },
};

export function getBoolean(key: string, fallback = false) {
  return appStorage.getBoolean(key) ?? fallback;
}

export function setBoolean(key: string, value: boolean) {
  appStorage.set(key, value);
}

export function getJson<T>(key: string, fallback: T): T {
  const value = appStorage.getString(key);
  if (!value) return fallback;

  try {
    return JSON.parse(value) as T;
  } catch {
    return fallback;
  }
}

export function setJson<T>(key: string, value: T) {
  appStorage.set(key, JSON.stringify(value));
}
