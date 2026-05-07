import { router, useLocalSearchParams } from 'expo-router';

import { Screen } from '@/src/components/layout/Screen';
import { ScreenHeader } from '@/src/components/layout/ScreenHeader';
import { Section } from '@/src/components/layout/Section';
import { EmptyState } from '@/src/components/ui/EmptyState';
import { ProBadge } from '@/src/components/ui/ProBadge';
import { ResourceRow } from '@/src/components/ui/ResourceRow';
import { StatusChip } from '@/src/components/ui/StatusChip';
import { topicsForBereich } from '@/src/features/wissen/data';
import { areaLabels, useAppTheme } from '@/src/lib/theme/tokens';
import type { Bereich } from '@/src/types/domain';

export default function BereichScreen() {
  const theme = useAppTheme();
  const { bereich } = useLocalSearchParams<{ bereich: Bereich }>();
  const topics = topicsForBereich(bereich);

  return (
    <Screen>
      <ScreenHeader
        eyebrow="Wissen"
        title={areaLabels[bereich] ?? 'Wissen'}
        description="Kompakte Inhalte fuer schnelles Nachschlagen waehrend Routine, Lehre und Befundung."
        chips={<StatusChip label={topics.length ? `${topics.length} Beitraege` : 'Keine Beitraege'} tone={topics.length ? 'info' : 'neutral'} icon="article" />}
      />
      <Section title="Beitraege" description="Kurztexte und Merkhilfen fuer diesen Laborbereich.">
        {topics.length ? (
          topics.map((topic) => (
            <ResourceRow
              key={topic.id}
              icon="article"
              eyebrow={topic.tags.join(' · ')}
              title={topic.title}
              subtitle={topic.summary}
              accentColor={theme.area[topic.bereich]}
              actionLabel="Lesen"
              badge={topic.proOnly ? <ProBadge /> : undefined}
              onPress={() => router.push(`/(tabs)/wissen/${topic.bereich}/${topic.id}`)}
            />
          ))
        ) : (
          <EmptyState icon="menu-book" title="Noch kein Beitrag freigeschaltet" description="Fuer diesen Bereich ist in dieser Version noch kein Wissensbeitrag sichtbar." />
        )}
      </Section>
    </Screen>
  );
}
