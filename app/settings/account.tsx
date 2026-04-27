import { router } from 'expo-router';
import { StyleSheet, View } from 'react-native';

import { Screen } from '@/src/components/layout/Screen';
import { AppText } from '@/src/components/ui/AppText';
import { Button } from '@/src/components/ui/Button';
import { Card } from '@/src/components/ui/Card';
import { useAuth } from '@/src/lib/auth/AuthProvider';
import { spacing } from '@/src/lib/theme/tokens';

export default function AccountScreen() {
  const { isGuest, userId, signOut } = useAuth();

  return (
    <Screen>
      <View style={styles.header}>
        <AppText variant="h1">Account</AppText>
        <AppText variant="callout" muted>{isGuest ? 'Lokaler Offline-Nutzer' : userId}</AppText>
      </View>
      <Card>
        <AppText variant="bodyEmph">Sync-Status</AppText>
        <AppText muted>{isGuest ? 'Nicht aktiv. Daten bleiben auf diesem Geraet.' : 'Supabase Session aktiv.'}</AppText>
      </Card>
      <Button
        label={isGuest ? 'Zum Login wechseln' : 'Abmelden'}
        icon={isGuest ? 'login' : 'logout'}
        variant="secondary"
        onPress={async () => {
          await signOut();
          router.replace('/(auth)/welcome');
        }}
      />
    </Screen>
  );
}

const styles = StyleSheet.create({
  header: {
    gap: spacing.sm,
  },
});
