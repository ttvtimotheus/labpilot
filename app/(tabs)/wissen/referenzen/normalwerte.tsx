import { StyleSheet, View } from 'react-native';

import { Screen } from '@/src/components/layout/Screen';
import { Section } from '@/src/components/layout/Section';
import { AppText } from '@/src/components/ui/AppText';
import { EmptyState } from '@/src/components/ui/EmptyState';
import { ListRow } from '@/src/components/ui/ListRow';
import { normalwerte } from '@/src/features/wissen/references';
import { areaLabels, spacing, useAppTheme } from '@/src/lib/theme/tokens';
import type { Bereich } from '@/src/types/domain';

const sections: Bereich[] = ['haema', 'chemie', 'mibi', 'histo'];

export default function NormalwerteScreen() {
  const theme = useAppTheme();

  return (
    <Screen>
      <View style={styles.header}>
        <AppText variant="h1">Normalwerte</AppText>
        <AppText variant="callout" muted>Kurze lokale Referenzliste fuer Ausbildung und Routinekontrolle.</AppText>
      </View>
      {normalwerte.length ? (
        sections.map((bereich) => {
          const entries = normalwerte.filter((entry) => entry.bereich === bereich);
          if (!entries.length) return null;

          return (
            <Section key={bereich} title={areaLabels[bereich]}>
              {entries.map((entry) => (
                <ListRow
                  key={entry.id}
                  icon="fact-check"
                  title={entry.label}
                  subtitle={entry.value}
                  accentColor={theme.area[entry.bereich]}
                />
              ))}
            </Section>
          );
        })
      ) : (
        <EmptyState icon="fact-check" title="Keine Normalwerte" description="Der lokale Datensatz ist leer." />
      )}
      <AppText variant="footnote" muted>Referenzbereiche sind labor- und methodenabhaengig.</AppText>
    </Screen>
  );
}

const styles = StyleSheet.create({
  header: {
    gap: spacing.sm,
  },
});