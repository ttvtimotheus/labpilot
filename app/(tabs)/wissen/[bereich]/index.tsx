import { router, useLocalSearchParams } from 'expo-router';
import { StyleSheet, View } from 'react-native';

import { Screen } from '@/src/components/layout/Screen';
import { Section } from '@/src/components/layout/Section';
import { AppText } from '@/src/components/ui/AppText';
import { EmptyState } from '@/src/components/ui/EmptyState';
import { ListRow } from '@/src/components/ui/ListRow';
import { ProBadge } from '@/src/components/ui/ProBadge';
import { topicsForBereich } from '@/src/features/wissen/data';
import { areaLabels, spacing, useAppTheme } from '@/src/lib/theme/tokens';
import type { Bereich } from '@/src/types/domain';

export default function BereichScreen() {
  const theme = useAppTheme();
  const { bereich } = useLocalSearchParams<{ bereich: Bereich }>();
  const topics = topicsForBereich(bereich);

  return (
    <Screen>
      <View style={styles.header}>
        <AppText variant="h1">{areaLabels[bereich] ?? 'Wissen'}</AppText>
        <AppText variant="callout" muted>Kompakte Inhalte fuer schnelles Nachschlagen.</AppText>
      </View>
      <Section title="Themen">
        {topics.length ? (
          topics.map((topic) => (
            <ListRow
              key={topic.id}
              icon="article"
              title={topic.title}
              subtitle={topic.summary}
              accentColor={theme.area[topic.bereich]}
              trailing={topic.proOnly ? <ProBadge /> : undefined}
              onPress={() => router.push(`/(tabs)/wissen/${topic.bereich}/${topic.id}`)}
            />
          ))
        ) : (
          <EmptyState icon="menu-book" title="Noch keine Themen" description="Dieser Bereich wird in den naechsten Datenpaketen erweitert." />
        )}
      </Section>
    </Screen>
  );
}

const styles = StyleSheet.create({
  header: {
    gap: spacing.sm,
  },
});
