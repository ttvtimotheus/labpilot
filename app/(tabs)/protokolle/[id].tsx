import { router, useLocalSearchParams } from 'expo-router';
import { StyleSheet, View } from 'react-native';

import { Screen } from '@/src/components/layout/Screen';
import { Section } from '@/src/components/layout/Section';
import { AppText } from '@/src/components/ui/AppText';
import { Button } from '@/src/components/ui/Button';
import { Card } from '@/src/components/ui/Card';
import { EmptyState } from '@/src/components/ui/EmptyState';
import { ListRow } from '@/src/components/ui/ListRow';
import { getProtokoll } from '@/src/features/protokolle/data';
import { areaLabels, spacing } from '@/src/lib/theme/tokens';
import { formatDuration } from '@/src/lib/utils/time';

export default function ProtokollDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const protokoll = getProtokoll(id);

  if (!protokoll) {
    return (
      <Screen>
        <EmptyState icon="assignment-late" title="Protokoll nicht gefunden" description="Dieses Protokoll ist lokal nicht vorhanden." actionLabel="Zurueck" onAction={() => router.back()} />
      </Screen>
    );
  }

  return (
    <Screen>
      <View style={styles.header}>
        <AppText variant="h1">{protokoll.name}</AppText>
        <AppText variant="callout" muted>{protokoll.description}</AppText>
      </View>
      <Card bereich={protokoll.bereich}>
        <AppText variant="bodyEmph">{areaLabels[protokoll.bereich]}</AppText>
        <AppText muted>Quelle: {protokoll.source}</AppText>
      </Card>
      <Button label="Durchfuehren" icon="play-arrow" onPress={() => router.push(`/(tabs)/protokolle/run/${protokoll.id}`)} />
      <Section title="Schritte">
        {protokoll.steps.map((step) => (
          <ListRow
            key={step.id}
            title={`${step.order}. ${step.name}`}
            subtitle={step.durationSeconds ? `${formatDuration(step.durationSeconds)} · ${step.instructions}` : step.instructions}
            accessibilityLabel={`${step.order}. ${step.name}`}
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
