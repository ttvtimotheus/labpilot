import { router, useLocalSearchParams } from 'expo-router';
import { StyleSheet, View } from 'react-native';

import { Screen } from '@/src/components/layout/Screen';
import { AppText } from '@/src/components/ui/AppText';
import { Button } from '@/src/components/ui/Button';
import { Card } from '@/src/components/ui/Card';
import { EmptyState } from '@/src/components/ui/EmptyState';
import { ProBadge } from '@/src/components/ui/ProBadge';
import { getTopic } from '@/src/features/wissen/data';
import { useEntitlements } from '@/src/hooks/useEntitlements';
import { spacing } from '@/src/lib/theme/tokens';

export default function TopicScreen() {
  const { topic } = useLocalSearchParams<{ topic: string }>();
  const entry = getTopic(topic);
  const { isPro } = useEntitlements();

  if (!entry) {
    return (
      <Screen>
        <EmptyState icon="article" title="Thema nicht gefunden" description="Der lokale Wissenssatz enthaelt diesen Eintrag nicht." actionLabel="Zurueck" onAction={() => router.back()} />
      </Screen>
    );
  }

  if (entry.proOnly && !isPro) {
    return (
      <Screen>
        <View style={styles.header}>
          <ProBadge />
          <AppText variant="h1">{entry.title}</AppText>
          <AppText variant="callout" muted>{entry.summary}</AppText>
        </View>
        <Card bereich={entry.bereich}>
          <AppText>Dieser Inhalt ist fuer LabPilot Pro vorbereitet.</AppText>
        </Card>
        <Button label="Pro ansehen" icon="workspace-premium" onPress={() => router.push('/modal/paywall')} />
      </Screen>
    );
  }

  return (
    <Screen>
      <View style={styles.header}>
        <AppText variant="h1">{entry.title}</AppText>
        <AppText variant="callout" muted>{entry.summary}</AppText>
      </View>
      {entry.body.map((paragraph, index) => (
        <Card key={`${entry.id}-${index}`} bereich={index === 0 ? entry.bereich : undefined}>
          <AppText>{paragraph}</AppText>
        </Card>
      ))}
    </Screen>
  );
}

const styles = StyleSheet.create({
  header: {
    gap: spacing.sm,
  },
});
