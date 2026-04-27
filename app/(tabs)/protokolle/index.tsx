import { router } from 'expo-router';
import { StyleSheet, View } from 'react-native';

import { Screen } from '@/src/components/layout/Screen';
import { Section } from '@/src/components/layout/Section';
import { AppText } from '@/src/components/ui/AppText';
import { ListRow } from '@/src/components/ui/ListRow';
import { protokolle } from '@/src/features/protokolle/data';
import { areaLabels, spacing, useAppTheme } from '@/src/lib/theme/tokens';

export default function ProtokolleScreen() {
  const theme = useAppTheme();

  return (
    <Screen>
      <View style={styles.header}>
        <AppText variant="h1">Protokolle</AppText>
        <AppText variant="callout" muted>Schrittfolgen fuer Faerbungen und wiederkehrende Laborablaeufe.</AppText>
      </View>
      <Section title="Standardprotokolle">
        {protokolle.map((protokoll) => (
          <ListRow
            key={protokoll.id}
            icon="assignment"
            title={protokoll.name}
            subtitle={`${areaLabels[protokoll.bereich]} · ${protokoll.steps.length} Schritte`}
            accentColor={theme.area[protokoll.bereich]}
            onPress={() => router.push(`/(tabs)/protokolle/${protokoll.id}`)}
          />
        ))}
      </Section>
    </Screen>
  );
}

const styles = StyleSheet.create({
  header: {
    gap: spacing.sm,
  },
});
