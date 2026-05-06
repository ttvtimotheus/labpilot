import { router } from 'expo-router';
import { StyleSheet, View } from 'react-native';

import { TimerRow } from '@/src/components/domain/TimerRow';
import { Screen } from '@/src/components/layout/Screen';
import { ScreenHeader } from '@/src/components/layout/ScreenHeader';
import { Section } from '@/src/components/layout/Section';
import { ActionTile } from '@/src/components/ui/ActionTile';
import { Button } from '@/src/components/ui/Button';
import { EmptyState } from '@/src/components/ui/EmptyState';
import { ResourceRow } from '@/src/components/ui/ResourceRow';
import { StatusChip } from '@/src/components/ui/StatusChip';
import { useTimerStore } from '@/src/features/timer/store';
import { useNow } from '@/src/hooks/useNow';
import { areaLabels, spacing, useAppTheme } from '@/src/lib/theme/tokens';
import { formatDuration } from '@/src/lib/utils/time';

export default function TimerScreen() {
  useNow();
  const theme = useAppTheme();
  const templates = useTimerStore((state) => state.templates);
  const activeTimers = useTimerStore((state) => state.activeTimers);
  const completedRuns = useTimerStore((state) => state.completedRuns);
  const startTimer = useTimerStore((state) => state.startTimer);
  const recentCompletedRuns = completedRuns.slice(0, 5);
  const featuredTemplates = templates.slice(0, 4);
  const libraryTemplates = templates.slice(4);

  return (
    <Screen>
      <ScreenHeader
        eyebrow="Timerbibliothek"
        title="Timer"
        description="Arbeitszeiten fuer Routinen, Inkubationen und kurze Laborfenster ohne Ueberbau und ohne Umwege."
        action={<Button label="Neuer Timer" icon="add" onPress={() => router.push('/(tabs)/timer/new')} />}
        chips={
          <>
            <StatusChip label={`${templates.length} Standardzeiten`} icon="timer" tone="info" />
            {activeTimers.length ? <StatusChip label={`${activeTimers.length} aktiv`} icon="play-arrow" tone="success" /> : null}
          </>
        }
      />

      <Section title="Jetzt aktiv" description="Laufende Schritte stehen oben, damit Zeit und Zustand sofort lesbar sind.">
        {activeTimers.length ? activeTimers.map((timer) => <TimerRow key={timer.id} timer={timer} />) : <EmptyState icon="timer" title="Kein laufender Schritt" description="Waehle eine Standardzeit oder lege einen neuen Timer fuer den aktuellen Arbeitsschritt an." />}
      </Section>

      <Section title="Sofortstart" description="Haeufige Standardzeiten als direkte Aktionsflaechen.">
        <View style={styles.actionGrid}>
          {featuredTemplates.map((template) => (
            <ActionTile
              key={template.id}
              style={styles.actionTile}
              icon="timer"
              title={template.name}
              subtitle={`${areaLabels[template.bereich]} · ${formatDuration(template.durationSeconds)}`}
              accentColor={theme.area[template.bereich]}
              onPress={() => startTimer(template)}
            />
          ))}
        </View>
      </Section>

      <Section title="Bibliothek" description="Alle integrierten Standardzeiten mit Bereich und Kurzbeschreibung.">
        {(libraryTemplates.length ? libraryTemplates : templates).map((template) => (
          <ResourceRow
            key={template.id}
            icon="timer"
            eyebrow={areaLabels[template.bereich]}
            title={template.name}
            subtitle={`${formatDuration(template.durationSeconds)} · ${template.description ?? 'Standardvorlage fuer die Routine'}`}
            accentColor={theme.area[template.bereich]}
            onPress={() => startTimer(template)}
          />
        ))}
      </Section>

      {recentCompletedRuns.length ? (
        <Section title="Verlauf" description="Zuletzt abgeschlossene oder abgebrochene Zeitfenster.">
          {recentCompletedRuns.map((run) => (
            <ResourceRow
              key={run.id}
              icon={run.cancelled ? 'timer-off' : 'check-circle'}
              eyebrow={run.cancelled ? 'Abgebrochen' : 'Abgeschlossen'}
              title={run.name}
              subtitle={`${formatDuration(run.durationSeconds)} · ${new Intl.DateTimeFormat('de-DE', { day: '2-digit', month: '2-digit', hour: '2-digit', minute: '2-digit' }).format(new Date(run.completedAt))}`}
              accentColor={run.cancelled ? theme.foregroundSubtle : theme.area[run.bereich]}
            />
          ))}
        </Section>
      ) : null}
    </Screen>
  );
}

const styles = StyleSheet.create({
  actionGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
  },
  actionTile: {
    flexBasis: '48%',
  },
});
