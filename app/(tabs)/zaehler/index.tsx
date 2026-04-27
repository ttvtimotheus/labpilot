import { router } from 'expo-router';
import { StyleSheet, View } from 'react-native';

import { Screen } from '@/src/components/layout/Screen';
import { Section } from '@/src/components/layout/Section';
import { AppText } from '@/src/components/ui/AppText';
import { ListRow } from '@/src/components/ui/ListRow';
import { useDifferentialStore } from '@/src/features/zaehler/differential.store';
import { useKolonieStore } from '@/src/features/zaehler/kolonien.store';
import { spacing, useAppTheme } from '@/src/lib/theme/tokens';

export default function ZaehlerScreen() {
  const theme = useAppTheme();
  const lastKolonie = useKolonieStore((state) => state.savedCounts[0]);
  const lastDifferential = useDifferentialStore((state) => state.savedCounts[0]);

  return (
    <Screen>
      <View style={styles.header}>
        <AppText variant="h1">Zaehler</AppText>
        <AppText variant="callout" muted>Haptische Zaehler fuer Kolonien und Differentialblutbild.</AppText>
      </View>
      <Section title="Laborzaehler">
        <ListRow
          icon="science"
          title="Mibi-Kolonienzaehler"
          subtitle="Kategorien, Gesamtzahl und CFU/ml Berechnung."
          accentColor={theme.area.mibi}
          onPress={() => router.push('/(tabs)/zaehler/kolonien')}
        />
        <ListRow
          icon="bloodtype"
          title="Differentialblutbild"
          subtitle="100-Zellen-Tracking mit Prozentanzeige."
          accentColor={theme.area.haema}
          onPress={() => router.push('/(tabs)/zaehler/differential')}
        />
      </Section>
      {(lastKolonie || lastDifferential) ? (
        <Section title="Letzte lokale Ergebnisse">
          {lastKolonie ? (
            <ListRow
              icon="science"
              title={lastKolonie.name ?? 'Kolonienzaehlung'}
              subtitle={`${lastKolonie.totalColonies} Kolonien · ${new Intl.NumberFormat('de-DE').format(lastKolonie.totalCfu)} CFU/ml`}
              accentColor={theme.area.mibi}
              onPress={() => router.push('/(tabs)/zaehler/kolonien')}
            />
          ) : null}
          {lastDifferential ? (
            <ListRow
              icon="bloodtype"
              title={lastDifferential.name ?? 'Differentialzaehlung'}
              subtitle={`${lastDifferential.totalCells}/${lastDifferential.target} Zellen gespeichert`}
              accentColor={theme.area.haema}
              onPress={() => router.push('/(tabs)/zaehler/differential')}
            />
          ) : null}
        </Section>
      ) : null}
    </Screen>
  );
}

const styles = StyleSheet.create({
  header: {
    gap: spacing.sm,
  },
});
