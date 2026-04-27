import { Redirect, Stack } from 'expo-router';

import { useAuth } from '@/src/lib/auth/AuthProvider';

export default function AuthLayout() {
  const { isReady, isSignedIn } = useAuth();

  if (!isReady) return null;
  if (isSignedIn) return <Redirect href="/(tabs)" />;

  return <Stack screenOptions={{ headerShown: false }} />;
}
