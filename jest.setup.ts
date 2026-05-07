import { jest } from '@jest/globals';

jest.mock('react-native-mmkv', () => {
  function createStore() {
    const values = new Map<string, string | number | boolean>();

    return {
      getString: (key: string) => {
        const value = values.get(key);
        return typeof value === 'string' ? value : undefined;
      },
      getBoolean: (key: string) => {
        const value = values.get(key);
        return typeof value === 'boolean' ? value : undefined;
      },
      set: (key: string, value: string | number | boolean) => {
        values.set(key, value);
      },
      remove: (key: string) => {
        values.delete(key);
      },
      clearAll: () => {
        values.clear();
      },
    };
  }

  return { createMMKV: createStore };
});

jest.mock('@expo/vector-icons/MaterialIcons', () => {
  const React = require('react');
  const { Text } = require('react-native');

  return function MockMaterialIcons({ name }: { name: string }) {
    return React.createElement(Text, { accessibilityLabel: name }, name);
  };
});

jest.mock('react-native-safe-area-context', () => {
  const React = require('react');
  const { View } = require('react-native');
  const insets = { top: 0, right: 0, bottom: 0, left: 0 };
  const frame = { x: 0, y: 0, width: 390, height: 844 };

  return {
    SafeAreaProvider: ({ children }: { children: React.ReactNode }) => React.createElement(View, null, children),
    SafeAreaView: ({ children, ...props }: { children: React.ReactNode }) => React.createElement(View, props, children),
    initialWindowMetrics: { frame, insets },
    useSafeAreaFrame: () => frame,
    useSafeAreaInsets: () => insets,
  };
});

jest.mock('expo-notifications', () => ({
  SchedulableTriggerInputTypes: { TIME_INTERVAL: 'timeInterval' },
  cancelScheduledNotificationAsync: jest.fn(async () => undefined),
  getPermissionsAsync: jest.fn(async () => ({ granted: true })),
  requestPermissionsAsync: jest.fn(async () => ({ granted: true })),
  scheduleNotificationAsync: jest.fn(async () => 'notification-id'),
  setNotificationHandler: jest.fn(),
}));