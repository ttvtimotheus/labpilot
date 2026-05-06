import { Stack } from 'expo-router';

import { useAppTheme } from '@/src/lib/theme/tokens';

export default function TimerLayout() {
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
      <Stack.Screen name="index" options={{ headerShown: false, title: 'Timer' }} />
      <Stack.Screen name="new" options={{ title: 'Neuer Timer', presentation: 'modal' }} />
      <Stack.Screen name="[id]" options={{ title: '' }} />
    </Stack>
  );
}
