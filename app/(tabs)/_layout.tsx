import { Redirect, Tabs } from 'expo-router';
import { NativeTabs } from 'expo-router/unstable-native-tabs';
import { Platform } from 'react-native';

import { HapticTab } from '@/components/haptic-tab';
import { AppIcon } from '@/src/components/ui/AppIcon';
import { usePreferencesStore } from '@/src/features/settings/preferences.store';
import { useAuth } from '@/src/lib/auth/AuthProvider';
import { useAppTheme } from '@/src/lib/theme/tokens';

export default function TabLayout() {
  const theme = useAppTheme();
  const { isReady, isSignedIn } = useAuth();
  const onboardingCompleted = usePreferencesStore((state) => state.onboardingCompleted);

  if (!isReady) return null;
  if (!isSignedIn) return <Redirect href="/(auth)/welcome" />;
  if (!onboardingCompleted) return <Redirect href="/onboarding" />;

  if (Platform.OS === 'ios') {
    return (
      <NativeTabs
        tintColor={theme.info}
        iconColor={{ default: theme.foregroundSubtle, selected: theme.info }}
        backgroundColor={theme.backgroundElev}
        blurEffect={theme.mode === 'dark' ? 'systemChromeMaterialDark' : 'systemChromeMaterialLight'}>
        <NativeTabs.Trigger name="index" options={{ title: 'Home', icon: { sf: 'house' }, selectedIcon: { sf: 'house.fill' } }} />
        <NativeTabs.Trigger name="timer" options={{ title: 'Timer', icon: { sf: 'timer' }, selectedIconColor: theme.area.mibi }} />
        <NativeTabs.Trigger name="protokolle" options={{ title: 'Protokolle', icon: { sf: 'list.clipboard' }, selectedIcon: { sf: 'list.clipboard.fill' }, selectedIconColor: theme.area.histo }} />
        <NativeTabs.Trigger name="zaehler" options={{ title: 'Zaehler', icon: { sf: 'plus.forwardslash.minus' }, selectedIconColor: theme.area.haema }} />
        <NativeTabs.Trigger name="wissen" options={{ title: 'Wissen', icon: { sf: 'book' }, selectedIcon: { sf: 'book.fill' }, selectedIconColor: theme.area.learn }} />
      </NativeTabs>
    );
  }

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: theme.info,
        tabBarInactiveTintColor: theme.foregroundSubtle,
        tabBarStyle: { backgroundColor: theme.backgroundElev, borderTopColor: theme.border },
        headerShown: false,
        tabBarButton: HapticTab,
      }}>
      <Tabs.Screen name="index" options={{ title: 'Home', tabBarIcon: ({ color }) => <AppIcon name="home" color={color} size={24} /> }} />
      <Tabs.Screen name="timer" options={{ title: 'Timer', tabBarIcon: ({ color }) => <AppIcon name="timer" color={color} size={24} /> }} />
      <Tabs.Screen name="protokolle" options={{ title: 'Protokolle', tabBarIcon: ({ color }) => <AppIcon name="assignment" color={color} size={24} /> }} />
      <Tabs.Screen name="zaehler" options={{ title: 'Zaehler', tabBarIcon: ({ color }) => <AppIcon name="calculate" color={color} size={24} /> }} />
      <Tabs.Screen name="wissen" options={{ title: 'Wissen', tabBarIcon: ({ color }) => <AppIcon name="menu-book" color={color} size={24} /> }} />
    </Tabs>
  );
}
