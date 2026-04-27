import { Stack } from 'expo-router';

export default function WissenLayout() {
  return (
    <Stack screenOptions={{ headerLargeTitle: true }}>
      <Stack.Screen name="index" options={{ title: 'Wissen' }} />
      <Stack.Screen name="[bereich]/index" options={{ title: 'Themen' }} />
      <Stack.Screen name="[bereich]/[topic]" options={{ title: 'Detail' }} />
      <Stack.Screen name="tools/verduennung" options={{ title: 'Verduennung' }} />
      <Stack.Screen name="tools/einheiten" options={{ title: 'Einheiten' }} />
    </Stack>
  );
}
