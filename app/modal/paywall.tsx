import { StyleSheet, View } from 'react-native';

import { Screen } from '@/src/components/layout/Screen';
import { AppText } from '@/src/components/ui/AppText';
import { Button } from '@/src/components/ui/Button';
import { Card } from '@/src/components/ui/Card';
import { ProBadge } from '@/src/components/ui/ProBadge';
import { restorePurchases } from '@/src/lib/purchases';
import { spacing, useAppTheme } from '@/src/lib/theme/tokens';

export default function PaywallModal() {
  const theme = useAppTheme();

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
      <Button label="Monatsabo vorbereiten" icon="workspace-premium" disabled />
      <Button label="Kaeufe wiederherstellen" variant="secondary" onPress={() => restorePurchases()} />
      <AppText variant="footnote" muted style={{ color: theme.foregroundMuted }}>
        Preise werden aktiviert, sobald die RevenueCat-Products in App Store Connect und Play Console angelegt sind.
      </AppText>
    </Screen>
  );
}

const styles = StyleSheet.create({
  header: {
    gap: spacing.sm,
  },
});
