import { router } from 'expo-router';
import { StyleSheet, View } from 'react-native';

import { Screen } from '@/src/components/layout/Screen';
import { Section } from '@/src/components/layout/Section';
import { AppText } from '@/src/components/ui/AppText';
import { ListRow } from '@/src/components/ui/ListRow';
import { wissenBereiche } from '@/src/features/wissen/data';
import { areaLabels, areaSymbols, spacing, useAppTheme } from '@/src/lib/theme/tokens';

export default function WissenScreen() {
  const theme = useAppTheme();

  return (
    <Screen>
      <View style={styles.header}>
        <AppText variant="h1">Wissen</AppText>
        <AppText variant="callout" muted>Referenzen, Basiswissen und schnelle Rechner fuer den Arbeitsplatz.</AppText>
      </View>
      <Section title="Bereiche">
        {wissenBereiche.map((bereich) => (
          <ListRow
            key={bereich}
            icon={areaSymbols[bereich] as never}
            title={areaLabels[bereich]}
            subtitle="Themen und kompakte Referenzen"
            accentColor={theme.area[bereich]}
            onPress={() => router.push(`/(tabs)/wissen/${bereich}`)}
          />
        ))}
      </Section>
      <Section title="Tools">
        <ListRow icon="water-drop" title="Verduennungsrechner" subtitle="C1 x V1 = C2 x V2" onPress={() => router.push('/(tabs)/wissen/tools/verduennung')} />
        <ListRow icon="swap-horiz" title="Einheiten-Konverter" subtitle="mg/dl, mmol/l und einfache Laborumrechnungen" onPress={() => router.push('/(tabs)/wissen/tools/einheiten')} />
      </Section>
      <Section title="Lernen">
        <ListRow icon="quiz" title="Lernkarten" subtitle="Kurzes Training aus Normalwerten und Nährmedien" accentColor={theme.area.learn} onPress={() => router.push('/(tabs)/wissen/lernen')} />
      </Section>
      <Section title="Referenzen">
        <ListRow icon="fact-check" title="Normalwerte" subtitle="Haematologie und klinische Chemie als lokaler Datensatz" onPress={() => router.push('/(tabs)/wissen/referenzen/normalwerte')} />
        <ListRow icon="biotech" title="Naehrmedien" subtitle="Kurzuebersicht haeufiger mikrobiologischer Medien" onPress={() => router.push('/(tabs)/wissen/referenzen/naehrmedien')} />
      </Section>
    </Screen>
  );
}

const styles = StyleSheet.create({
  header: {
    gap: spacing.sm,
  },
});
