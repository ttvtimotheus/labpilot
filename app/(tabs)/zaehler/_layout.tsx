import { Stack } from 'expo-router';

import { useAppTheme } from '@/src/lib/theme/tokens';

export default function ZaehlerLayout() {
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
      <Stack.Screen name="index" options={{ headerShown: false, title: 'Zaehler' }} />
      <Stack.Screen name="kolonien" options={{ title: 'Kolonien' }} />
      <Stack.Screen name="differential" options={{ title: 'Diff-BB' }} />
    </Stack>
  );
}
