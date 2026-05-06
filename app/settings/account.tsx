import { router } from 'expo-router';
import { useState } from 'react';
import { StyleSheet, View } from 'react-native';

import { Screen } from '@/src/components/layout/Screen';
import { ScreenHeader } from '@/src/components/layout/ScreenHeader';
import { Button } from '@/src/components/ui/Button';
import { NoticeBanner } from '@/src/components/ui/NoticeBanner';
import { StatusChip } from '@/src/components/ui/StatusChip';
import { useLocalDataHydration } from '@/src/hooks/useLocalDataHydration';
import { useAuth } from '@/src/lib/auth/AuthProvider';
import { syncAll } from '@/src/lib/db/sync';
import { isSupabaseConfigured } from '@/src/lib/env';
import { spacing } from '@/src/lib/theme/tokens';

type SyncState = 'idle' | 'running' | 'success' | 'skipped' | 'error';

export default function AccountScreen() {
  const { isGuest, userId, signOut } = useAuth();
  const hydrateLocalData = useLocalDataHydration({ auto: false });
  const [syncState, setSyncState] = useState<SyncState>('idle');
  const [syncMessage, setSyncMessage] = useState<string | null>(null);

  async function runManualSync() {
    setSyncState('running');
    setSyncMessage(null);
    try {
      const result = await syncAll(userId);
      if (result.skipped) {
        setSyncState('skipped');
        setSyncMessage(result.reason === 'offline-or-unconfigured' ? 'Der Abgleich ist in dieser Installation derzeit nur lokal verfuegbar.' : 'Der Abgleich wurde uebersprungen.');
      } else {
        const pendingTotal = Object.values(result.pendingLocalChanges).reduce((sum, count) => sum + count, 0);
        const pushedTotal = Object.values(result.pushedLocalChanges).reduce((sum, count) => sum + count, 0);
        const deletedTotal = Object.values(result.deletedLocalChanges).reduce((sum, count) => sum + count, 0);
        const conflictTotal = Object.values(result.remoteConflictChanges).reduce((sum, count) => sum + count, 0);
        const remoteTotal = Object.values(result.remoteChanges).reduce((sum, count) => sum + count, 0);
        await hydrateLocalData(userId);
        setSyncState('success');
        setSyncMessage(`Sync abgeschlossen. Gepusht: ${pushedTotal}, geloescht: ${deletedTotal}, remote neuer: ${conflictTotal}, lokal offen: ${pendingTotal}, remote erkannt: ${remoteTotal}.`);
      }
    } catch (error) {
      setSyncState('error');
      setSyncMessage(error instanceof Error ? error.message : 'Sync fehlgeschlagen.');
    }
  }

  return (
    <Screen>
      <ScreenHeader
        eyebrow="Profil"
        title="Account"
        description={isGuest ? 'Du arbeitest derzeit lokal auf diesem Geraet.' : userId}
        chips={
          <>
            <StatusChip label={isGuest ? 'Lokal' : 'Cloud'} tone={isGuest ? 'warning' : 'info'} icon={isGuest ? 'offline-bolt' : 'cloud-done'} />
            <StatusChip label={isSupabaseConfigured ? 'Sync bereit' : 'Nur lokal'} tone={isSupabaseConfigured ? 'success' : 'neutral'} icon="sync" />
          </>
        }
      />
      <NoticeBanner title="Synchronisation" description={isGuest ? 'Deine Daten bleiben aktuell nur auf diesem Geraet.' : 'Dein Konto kann lokale Daten mit dem Server abgleichen.'} tone={isSupabaseConfigured ? 'info' : 'neutral'} icon="sync" />
      {syncMessage ? (
        <NoticeBanner
          title="Letzter Sync-Check"
          description={syncMessage}
          tone={syncState === 'error' ? 'danger' : syncState === 'success' ? 'success' : syncState === 'skipped' ? 'warning' : 'info'}
          icon={syncState === 'error' ? 'error-outline' : 'sync'}
        />
      ) : null}
      <View style={styles.actions}>
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
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  actions: {
    gap: spacing.sm,
  },
});
