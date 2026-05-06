import { Stack } from 'expo-router';

import { useAppTheme } from '@/src/lib/theme/tokens';

export default function WissenLayout() {
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
      <Stack.Screen name="index" options={{ headerShown: false, title: 'Wissen' }} />
      <Stack.Screen name="[bereich]/index" options={{ title: 'Themen' }} />
      <Stack.Screen name="[bereich]/[topic]" options={{ title: 'Detail' }} />
      <Stack.Screen name="tools/verduennung" options={{ title: 'Verduennung' }} />
      <Stack.Screen name="tools/einheiten" options={{ title: 'Einheiten' }} />
      <Stack.Screen name="lernen" options={{ title: 'Lernkarten' }} />
      <Stack.Screen name="referenzen/normalwerte" options={{ title: 'Normalwerte' }} />
      <Stack.Screen name="referenzen/naehrmedien" options={{ title: 'Naehrmedien' }} />
    </Stack>
  );
}
