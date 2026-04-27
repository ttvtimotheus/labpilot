import { router } from 'expo-router';
import { StyleSheet, View } from 'react-native';

import { Screen } from '@/src/components/layout/Screen';
import { AppText } from '@/src/components/ui/AppText';
import { Button } from '@/src/components/ui/Button';
import { Card } from '@/src/components/ui/Card';
import { ProBadge } from '@/src/components/ui/ProBadge';
import { useEntitlements } from '@/src/hooks/useEntitlements';
import { restorePurchases } from '@/src/lib/purchases';
import { spacing, useAppTheme } from '@/src/lib/theme/tokens';

export default function SubscriptionScreen() {
  const theme = useAppTheme();
  const { isPro } = useEntitlements();

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
      <Button label="Paywall ansehen" icon="workspace-premium" onPress={() => router.push('/modal/paywall')} />
      <Button label="Kaeufe wiederherstellen" icon="restore" variant="secondary" onPress={() => restorePurchases()} />
    </Screen>
  );
}

const styles = StyleSheet.create({
  header: {
    gap: spacing.sm,
  },
});
