import '@/global.css';

import {
    Inter_400Regular,
    Inter_500Medium,
    Inter_600SemiBold,
    useFonts as useInterFonts,
} from '@expo-google-fonts/inter';
import {
    JetBrainsMono_500Medium,
    useFonts as useJetBrainsFonts,
} from '@expo-google-fonts/jetbrains-mono';
import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { StatusBar } from 'expo-status-bar';
import { useEffect } from 'react';
import 'react-native-reanimated';

import { useColorScheme } from '@/hooks/use-color-scheme';
import { AppProviders } from '@/src/providers/AppProviders';

void SplashScreen.preventAutoHideAsync();

export const unstable_settings = {
  anchor: '(tabs)',
};

export default function RootLayout() {
  const colorScheme = useColorScheme();
  const [interLoaded] = useInterFonts({ Inter_400Regular, Inter_500Medium, Inter_600SemiBold });
  const [monoLoaded] = useJetBrainsFonts({ JetBrainsMono_500Medium });
  const fontsLoaded = interLoaded && monoLoaded;

  useEffect(() => {
    if (fontsLoaded) {
      SplashScreen.hideAsync();
    }
  }, [fontsLoaded]);

  if (!fontsLoaded) return null;

  return (
    <AppProviders>
      <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
        <Stack screenOptions={{ headerShown: false }}>
          <Stack.Screen name="(auth)" />
          <Stack.Screen name="(tabs)" />
          <Stack.Screen name="onboarding" />
          <Stack.Screen name="settings" options={{ presentation: 'modal' }} />
          <Stack.Screen name="modal" options={{ presentation: 'modal' }} />
          <Stack.Screen name="+not-found" />
        </Stack>
        <StatusBar style={colorScheme === 'dark' ? 'light' : 'dark'} />
      </ThemeProvider>
    </AppProviders>
  );
}
