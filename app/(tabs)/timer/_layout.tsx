import { Stack } from 'expo-router';

export default function TimerLayout() {
  return (
    <Stack screenOptions={{ headerLargeTitle: true }}>
      <Stack.Screen name="index" options={{ title: 'Timer' }} />
      <Stack.Screen name="new" options={{ title: 'Neuer Timer', presentation: 'modal' }} />
      <Stack.Screen name="[id]" options={{ title: '' }} />
    </Stack>
  );
}
