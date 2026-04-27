import { Stack } from 'expo-router';

export default function SettingsLayout() {
  return (
    <Stack>
      <Stack.Screen name="index" options={{ title: 'Einstellungen' }} />
      <Stack.Screen name="account" options={{ title: 'Account' }} />
      <Stack.Screen name="subscription" options={{ title: 'LabPilot Pro' }} />
      <Stack.Screen name="about" options={{ title: 'Ueber LabPilot' }} />
    </Stack>
  );
}
