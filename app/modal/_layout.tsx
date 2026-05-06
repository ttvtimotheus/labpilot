import { Stack } from 'expo-router';

export default function ModalLayout() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="new-timer" />
      <Stack.Screen name="paywall" />
    </Stack>
  );
}