import { router } from 'expo-router';
import { StyleSheet, View } from 'react-native';

import { Screen } from '@/src/components/layout/Screen';
import { Section } from '@/src/components/layout/Section';
import { AppText } from '@/src/components/ui/AppText';
import { ListRow } from '@/src/components/ui/ListRow';
import { protokolle } from '@/src/features/protokolle/data';
import { useProtokollRunStore } from '@/src/features/protokolle/store';
import { areaLabels, spacing, useAppTheme } from '@/src/lib/theme/tokens';

export default function ProtokolleScreen() {
  const theme = useAppTheme();
  const completedRuns = useProtokollRunStore((state) => state.completedRuns.slice(0, 3));

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
      {completedRuns.length ? (
        <Section title="Letzte Durchlaeufe">
          {completedRuns.map((run) => (
            <ListRow
              key={run.id}
              icon="history"
              title={run.protokollSnapshot.name}
              subtitle={`${new Intl.DateTimeFormat('de-DE', { day: '2-digit', month: '2-digit', hour: '2-digit', minute: '2-digit' }).format(new Date(run.completedAt))} · ${run.notes ?? 'ohne Notiz'}`}
              accentColor={theme.area[run.protokollSnapshot.bereich]}
            />
          ))}
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
