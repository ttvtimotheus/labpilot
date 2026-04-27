import { Stack } from 'expo-router';

export default function ProtokolleLayout() {
  return (
    <Stack screenOptions={{ headerLargeTitle: true }}>
      <Stack.Screen name="index" options={{ title: 'Protokolle' }} />
      <Stack.Screen name="[id]" options={{ title: 'Details' }} />
      <Stack.Screen name="run/[id]" options={{ title: 'Durchfuehren' }} />
    </Stack>
  );
}
