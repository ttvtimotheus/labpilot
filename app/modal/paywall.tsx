import { StyleSheet, View } from 'react-native';

import { Screen } from '@/src/components/layout/Screen';
import { AppText } from '@/src/components/ui/AppText';
import { Button } from '@/src/components/ui/Button';
import { Card } from '@/src/components/ui/Card';
import { ProBadge } from '@/src/components/ui/ProBadge';
import { useRevenueCat } from '@/src/hooks/useRevenueCat';
import { spacing, useAppTheme } from '@/src/lib/theme/tokens';

export default function PaywallModal() {
  const theme = useAppTheme();
  const revenueCat = useRevenueCat();
  const hasPackages = revenueCat.packages.length > 0;

  return (
    <Screen>
      <View style={styles.header}>
        <ProBadge />
        <AppText variant="display">LabPilot Pro</AppText>
        <AppText variant="callout" muted>
          Lernen, Team-Sync, PDF-Export und erweiterte Wissensbank werden fuer Pro vorbereitet.
        </AppText>
      </View>
      <Card elevated>
        {['PDF-Export fuer Protokolllauefe', 'Erweiterte Referenzen und Lernkarten', 'Team-Sync fuer Ausbildungsklassen'].map((item) => (
          <AppText key={item} variant="bodyEmph">{item}</AppText>
        ))}
      </Card>
      {revenueCat.error ? (
        <Card style={{ borderColor: theme.danger }}>
          <AppText variant="bodyEmph" style={{ color: theme.danger }}>RevenueCat</AppText>
          <AppText muted>{revenueCat.error}</AppText>
        </Card>
      ) : null}
      {revenueCat.message ? (
        <Card style={{ borderColor: theme.success }}>
          <AppText variant="bodyEmph" style={{ color: theme.success }}>Status</AppText>
          <AppText muted>{revenueCat.message}</AppText>
        </Card>
      ) : null}
      {hasPackages ? (
        <View style={styles.packages}>
          {revenueCat.packages.map((pkg) => (
            <Card key={pkg.identifier} style={{ borderColor: theme.borderStrong }}>
              <AppText variant="bodyEmph">{pkg.product.title}</AppText>
              <AppText muted>{pkg.product.description || pkg.product.identifier}</AppText>
              <AppText variant="h2">{pkg.product.priceString}</AppText>
              <Button
                label={revenueCat.isPurchasing ? 'Kauf laeuft...' : 'Auswaehlen'}
                icon="workspace-premium"
                disabled={revenueCat.isWorking}
                onPress={() => void revenueCat.purchase(pkg.identifier)}
              />
            </Card>
          ))}
        </View>
      ) : (
        <Card style={{ borderColor: revenueCat.isConfigured ? theme.warning : theme.border }}>
          <AppText variant="bodyEmph">{revenueCat.isConfigured ? 'Keine Angebote geladen' : 'RevenueCat nicht konfiguriert'}</AppText>
          <AppText muted>
            {revenueCat.isConfigured
              ? 'Sobald RevenueCat ein aktuelles Offering liefert, erscheinen hier die auswählbaren Pakete.'
              : 'Hinterlege die RevenueCat API-Keys in der Umgebung, um echte Store-Produkte zu laden.'}
          </AppText>
        </Card>
      )}
      <Button label={revenueCat.isLoading ? 'Angebote laden...' : 'Angebote neu laden'} icon="sync" variant="secondary" disabled={revenueCat.isWorking} onPress={() => void revenueCat.refresh()} />
      <Button label={revenueCat.isRestoring ? 'Wiederherstellen...' : 'Kaeufe wiederherstellen'} variant="secondary" disabled={revenueCat.isWorking} onPress={() => void revenueCat.restore()} />
      <AppText variant="footnote" muted style={{ color: theme.foregroundMuted }}>
        Preise und Testkaeufe kommen direkt aus RevenueCat, sobald die Products in App Store Connect und Play Console verbunden sind.
      </AppText>
    </Screen>
  );
}

const styles = StyleSheet.create({
  header: {
    gap: spacing.sm,
  },
  packages: {
    gap: spacing.sm,
  },
});
