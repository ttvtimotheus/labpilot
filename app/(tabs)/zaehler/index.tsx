import { router } from 'expo-router';
import { StyleSheet, View } from 'react-native';

import { Screen } from '@/src/components/layout/Screen';
import { Section } from '@/src/components/layout/Section';
import { AppText } from '@/src/components/ui/AppText';
import { ListRow } from '@/src/components/ui/ListRow';
import { spacing, useAppTheme } from '@/src/lib/theme/tokens';

export default function ZaehlerScreen() {
  const theme = useAppTheme();

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
    </Screen>
  );
}

const styles = StyleSheet.create({
  header: {
    gap: spacing.sm,
  },
});
