import { router, useLocalSearchParams } from 'expo-router';

import { Screen } from '@/src/components/layout/Screen';
import { ScreenHeader } from '@/src/components/layout/ScreenHeader';
import { AppText } from '@/src/components/ui/AppText';
import { Button } from '@/src/components/ui/Button';
import { Card } from '@/src/components/ui/Card';
import { EmptyState } from '@/src/components/ui/EmptyState';
import { NoticeBanner } from '@/src/components/ui/NoticeBanner';
import { ProBadge } from '@/src/components/ui/ProBadge';
import { StatusChip } from '@/src/components/ui/StatusChip';
import { getTopic } from '@/src/features/wissen/data';
import { useEntitlements } from '@/src/hooks/useEntitlements';
import { areaLabels } from '@/src/lib/theme/tokens';

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
        <ScreenHeader
          eyebrow={areaLabels[entry.bereich]}
          title={entry.title}
          description={entry.summary}
          chips={<StatusChip label="LabPilot Pro" tone="warning" icon="workspace-premium" />}
        />
        <NoticeBanner title="Erweiterter Wissensbeitrag" description="Dieser Beitrag gehoert zum erweiterten Wissensbereich von LabPilot Pro." tone="warning" icon="workspace-premium" />
        <Button label="Zusatzfunktionen ansehen" icon="workspace-premium" onPress={() => router.push('/modal/paywall')} />
      </Screen>
    );
  }

  return (
    <Screen>
      <ScreenHeader
        eyebrow={areaLabels[entry.bereich]}
        title={entry.title}
        description={entry.summary}
        action={entry.proOnly ? <ProBadge /> : undefined}
        chips={<StatusChip label={areaLabels[entry.bereich]} tone="info" icon="book" />}
      />
      {entry.body.map((paragraph, index) => (
        <Card key={`${entry.id}-${index}`} bereich={index === 0 ? entry.bereich : undefined}>
          <AppText>{paragraph}</AppText>
        </Card>
      ))}
    </Screen>
  );
}
