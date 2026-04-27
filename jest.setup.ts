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