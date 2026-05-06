import { Stack } from 'expo-router';

import { useAppTheme } from '@/src/lib/theme/tokens';

export default function ProtokolleLayout() {
  const theme = useAppTheme();

  return (
    <Stack
      screenOptions={{
        headerLargeTitle: false,
        headerShadowVisible: false,
        headerStyle: { backgroundColor: theme.background },
        headerTintColor: theme.foreground,
        headerTitleStyle: { fontFamily: 'Inter_600SemiBold' },
      }}>
      <Stack.Screen name="index" options={{ headerShown: false, title: 'Protokolle' }} />
      <Stack.Screen name="[id]" options={{ title: 'Details' }} />
      <Stack.Screen name="run/[id]" options={{ title: 'Durchfuehren' }} />
    </Stack>
  );
}
