import { StyleSheet, View } from 'react-native';

import { Screen } from '@/src/components/layout/Screen';
import { Section } from '@/src/components/layout/Section';
import { AppText } from '@/src/components/ui/AppText';
import { EmptyState } from '@/src/components/ui/EmptyState';
import { ListRow } from '@/src/components/ui/ListRow';
import { naehrmedien } from '@/src/features/wissen/references';
import { areaLabels, spacing, useAppTheme } from '@/src/lib/theme/tokens';
import type { Bereich } from '@/src/types/domain';

const sections: Bereich[] = ['mibi', 'haema', 'chemie', 'histo'];

export default function NaehrmedienScreen() {
  const theme = useAppTheme();

  return (
    <Screen>
      <View style={styles.header}>
        <AppText variant="h1">Naehrmedien</AppText>
        <AppText variant="callout" muted>Lokale Kurzreferenz fuer haeufige Medien und ihren Einsatz.</AppText>
      </View>
      {naehrmedien.length ? (
        sections.map((bereich) => {
          const entries = naehrmedien.filter((entry) => entry.bereich === bereich);
          if (!entries.length) return null;

          return (
            <Section key={bereich} title={areaLabels[bereich]}>
              {entries.map((entry) => (
                <ListRow
                  key={entry.id}
                  icon="biotech"
                  title={entry.name}
                  subtitle={entry.use}
                  accentColor={theme.area[entry.bereich]}
                />
              ))}
            </Section>
          );
        })
      ) : (
        <EmptyState icon="biotech" title="Keine Naehrmedien" description="Der lokale Datensatz ist leer." />
      )}
    </Screen>
  );
}

const styles = StyleSheet.create({
  header: {
    gap: spacing.sm,
  },
});