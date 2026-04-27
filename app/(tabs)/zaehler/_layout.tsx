import { Stack } from 'expo-router';

export default function ZaehlerLayout() {
  return (
    <Stack screenOptions={{ headerLargeTitle: true }}>
      <Stack.Screen name="index" options={{ title: 'Zaehler' }} />
      <Stack.Screen name="kolonien" options={{ title: 'Kolonien' }} />
      <Stack.Screen name="differential" options={{ title: 'Diff-BB' }} />
    </Stack>
  );
}
