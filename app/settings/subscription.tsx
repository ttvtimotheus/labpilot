import { router } from 'expo-router';
import { StyleSheet, View } from 'react-native';

import { Screen } from '@/src/components/layout/Screen';
import { AppText } from '@/src/components/ui/AppText';
import { Button } from '@/src/components/ui/Button';
import { Card } from '@/src/components/ui/Card';
import { ProBadge } from '@/src/components/ui/ProBadge';
import { useEntitlements } from '@/src/hooks/useEntitlements';
import { useRevenueCat } from '@/src/hooks/useRevenueCat';
import { spacing, useAppTheme } from '@/src/lib/theme/tokens';

export default function SubscriptionScreen() {
  const theme = useAppTheme();
  const { isPro } = useEntitlements();
  const revenueCat = useRevenueCat();

  return (
    <Screen>
      <View style={styles.header}>
        <ProBadge />
        <AppText variant="h1">LabPilot Pro</AppText>
        <AppText variant="callout" muted>{isPro ? 'Pro ist aktiv.' : 'Pro ist vorbereitet und wartet auf RevenueCat-Produkte.'}</AppText>
      </View>
      <Card style={{ borderColor: isPro ? theme.success : theme.border }}>
        <AppText variant="bodyEmph">Entitlement</AppText>
        <AppText muted>{isPro ? 'pro aktiv' : 'pro nicht aktiv'}</AppText>
      </Card>
      {revenueCat.message || revenueCat.error ? (
        <Card style={{ borderColor: revenueCat.error ? theme.danger : theme.success }}>
          <AppText variant="bodyEmph" style={{ color: revenueCat.error ? theme.danger : theme.success }}>{revenueCat.error ? 'Hinweis' : 'Status'}</AppText>
          <AppText muted>{revenueCat.error ?? revenueCat.message}</AppText>
        </Card>
      ) : null}
      <Card>
        <AppText variant="bodyEmph">Offering</AppText>
        <AppText muted>
          {revenueCat.isConfigured
            ? `${revenueCat.packages.length} Paket(e) geladen${revenueCat.currentOfferingId ? ` · ${revenueCat.currentOfferingId}` : ''}`
            : 'RevenueCat API-Keys fehlen in der lokalen Umgebung.'}
        </AppText>
      </Card>
      <Button label="Paywall ansehen" icon="workspace-premium" onPress={() => router.push('/modal/paywall')} />
      <Button label={revenueCat.isRestoring ? 'Wiederherstellen...' : 'Kaeufe wiederherstellen'} icon="restore" variant="secondary" disabled={revenueCat.isWorking} onPress={() => void revenueCat.restore()} />
    </Screen>
  );
}

const styles = StyleSheet.create({
  header: {
    gap: spacing.sm,
  },
});
