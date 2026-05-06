import { router } from 'expo-router';
import { StyleSheet, View } from 'react-native';

import { Screen } from '@/src/components/layout/Screen';
import { ScreenHeader } from '@/src/components/layout/ScreenHeader';
import { AppText } from '@/src/components/ui/AppText';
import { Button } from '@/src/components/ui/Button';
import { Card } from '@/src/components/ui/Card';
import { NoticeBanner } from '@/src/components/ui/NoticeBanner';
import { ResourceRow } from '@/src/components/ui/ResourceRow';
import { StatusChip } from '@/src/components/ui/StatusChip';
import { useRevenueCat } from '@/src/hooks/useRevenueCat';
import { spacing, useAppTheme } from '@/src/lib/theme/tokens';

export default function PaywallModal() {
  const theme = useAppTheme();
  const revenueCat = useRevenueCat();
  const hasPackages = revenueCat.packages.length > 0;

  return (
    <Screen>
      <ScreenHeader
        eyebrow="Zusatzfunktionen"
        title="LabPilot Pro"
        description="Erweiterte Wissensinhalte, PDF-Ausgaben und Zusatzfunktionen in einem separaten Paket."
        action={<Button label="Schliessen" variant="secondary" onPress={() => router.back()} />}
        chips={
          <>
            <StatusChip label={revenueCat.isConfigured ? `${revenueCat.packages.length} Angebote` : 'Store inaktiv'} tone={revenueCat.isConfigured ? 'info' : 'neutral'} icon="payments" />
            <StatusChip label={hasPackages ? 'Auswaehlbar' : 'Uebersicht'} tone="warning" icon="workspace-premium" />
          </>
        }
      />
      <View style={styles.featureList}>
        <ResourceRow icon="menu-book" eyebrow="Wissen" title="Erweiterte Wissensbibliothek" subtitle="Zusatzbeitraege, vertiefende Lernkarten und erweiterte Referenzen fuer Ausbildung und Routine." accentColor={theme.area.learn} />
        <ResourceRow icon="picture-as-pdf" eyebrow="Dokumentation" title="Export und Ausgabe" subtitle="PDF-Ausgaben fuer Durchlaeufe und strukturiertere Weitergabe aus der App." accentColor={theme.area.histo} />
        <ResourceRow icon="sync" eyebrow="Zusatzfunktionen" title="Weitere Arbeitsoptionen" subtitle="Mehr Optionen fuer gemeinsame Nutzung, Synchronisation und spaetere Team-Workflows." accentColor={theme.area.general} />
      </View>
      {revenueCat.error ? (
        <NoticeBanner title="RevenueCat" description={revenueCat.error} tone="danger" icon="error-outline" />
      ) : null}
      {revenueCat.message ? (
        <NoticeBanner title="Status" description={revenueCat.message} tone="success" icon="workspace-premium" />
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
        <NoticeBanner
          title={revenueCat.isConfigured ? 'Derzeit keine Angebote sichtbar' : 'Zusatzpakete sind hier nicht eingebunden'}
          description={revenueCat.isConfigured ? 'Sobald aktuelle Store-Angebote verfuegbar sind, erscheinen sie in dieser Ansicht zur Auswahl.' : 'Diese lokale Build zeigt nur die Funktionsuebersicht. Der fachliche Kern der App bleibt davon unberuehrt nutzbar.'}
          tone={revenueCat.isConfigured ? 'warning' : 'neutral'}
          icon="payments"
        />
      )}
      {revenueCat.isConfigured ? (
        <>
          <Button label={revenueCat.isLoading ? 'Angebote laden...' : 'Angebote neu laden'} icon="sync" variant="secondary" disabled={revenueCat.isWorking} onPress={() => void revenueCat.refresh()} />
          <Button label={revenueCat.isRestoring ? 'Wiederherstellen...' : 'Kaeufe wiederherstellen'} variant="secondary" disabled={revenueCat.isWorking} onPress={() => void revenueCat.restore()} />
          <AppText variant="footnote" muted style={{ color: theme.foregroundMuted }}>
            Preise und Laufzeiten erscheinen direkt aus dem jeweils verfuegbaren Store-Angebot.
          </AppText>
        </>
      ) : null}
    </Screen>
  );
}

const styles = StyleSheet.create({
  featureList: {
    gap: spacing.md,
  },
  packages: {
    gap: spacing.md,
  },
});
