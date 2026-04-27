import { router } from 'expo-router';
import { useState } from 'react';
import { StyleSheet, View } from 'react-native';

import { Screen } from '@/src/components/layout/Screen';
import { AppText } from '@/src/components/ui/AppText';
import { Button } from '@/src/components/ui/Button';
import { Card } from '@/src/components/ui/Card';
import { useAuth } from '@/src/lib/auth/AuthProvider';
import { syncAll } from '@/src/lib/db/sync';
import { isSupabaseConfigured } from '@/src/lib/env';
import { spacing } from '@/src/lib/theme/tokens';

type SyncState = 'idle' | 'running' | 'success' | 'skipped' | 'error';

export default function AccountScreen() {
  const { isGuest, userId, signOut } = useAuth();
  const [syncState, setSyncState] = useState<SyncState>('idle');
  const [syncMessage, setSyncMessage] = useState<string | null>(null);

  async function runManualSync() {
    setSyncState('running');
    setSyncMessage(null);
    try {
      const result = await syncAll(userId);
      if (result.skipped) {
        setSyncState('skipped');
        setSyncMessage(result.reason === 'offline-or-unconfigured' ? 'Supabase ist noch nicht konfiguriert oder du nutzt den Offline-Modus.' : 'Sync wurde uebersprungen.');
      } else {
        const pendingTotal = Object.values(result.pendingLocalChanges).reduce((sum, count) => sum + count, 0);
        const pushedTotal = Object.values(result.pushedLocalChanges).reduce((sum, count) => sum + count, 0);
        const deletedTotal = Object.values(result.deletedLocalChanges).reduce((sum, count) => sum + count, 0);
        const remoteTotal = Object.values(result.remoteChanges).reduce((sum, count) => sum + count, 0);
        setSyncState('success');
        setSyncMessage(`Sync abgeschlossen. Gepusht: ${pushedTotal}, geloescht: ${deletedTotal}, lokal offen: ${pendingTotal}, remote erkannt: ${remoteTotal}.`);
      }
    } catch (error) {
      setSyncState('error');
      setSyncMessage(error instanceof Error ? error.message : 'Sync fehlgeschlagen.');
    }
  }

  return (
    <Screen>
      <View style={styles.header}>
        <AppText variant="h1">Account</AppText>
        <AppText variant="callout" muted>{isGuest ? 'Lokaler Offline-Nutzer' : userId}</AppText>
      </View>
      <Card>
        <AppText variant="bodyEmph">Sync-Status</AppText>
        <AppText muted>{isGuest ? 'Nicht aktiv. Daten bleiben auf diesem Geraet.' : 'Supabase Session aktiv.'}</AppText>
        <AppText variant="footnote" muted>{isSupabaseConfigured ? 'Backend-Konfiguration vorhanden.' : 'Backend-Secrets fehlen in der lokalen Umgebung.'}</AppText>
      </Card>
      {syncMessage ? (
        <Card>
          <AppText variant="bodyEmph">Letzter Sync-Check</AppText>
          <AppText muted>{syncMessage}</AppText>
        </Card>
      ) : null}
      <Button
        label={syncState === 'running' ? 'Sync prueft...' : 'Sync pruefen'}
        icon="sync"
        disabled={syncState === 'running'}
        onPress={runManualSync}
      />
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
