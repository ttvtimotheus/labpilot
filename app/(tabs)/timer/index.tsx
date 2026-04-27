import { router } from 'expo-router';
import { StyleSheet, View } from 'react-native';

import { Screen } from '@/src/components/layout/Screen';
import { Section } from '@/src/components/layout/Section';
import { TimerRow } from '@/src/components/domain/TimerRow';
import { AppText } from '@/src/components/ui/AppText';
import { Button } from '@/src/components/ui/Button';
import { EmptyState } from '@/src/components/ui/EmptyState';
import { ListRow } from '@/src/components/ui/ListRow';
import { useTimerStore } from '@/src/features/timer/store';
import { useNow } from '@/src/hooks/useNow';
import { areaLabels, spacing, useAppTheme } from '@/src/lib/theme/tokens';
import { formatDuration } from '@/src/lib/utils/time';

export default function TimerScreen() {
  useNow();
  const theme = useAppTheme();
  const templates = useTimerStore((state) => state.templates);
  const activeTimers = useTimerStore((state) => state.activeTimers);
  const startTimer = useTimerStore((state) => state.startTimer);

  return (
    <Screen>
      <View style={styles.header}>
        <AppText variant="h1">Timer</AppText>
        <AppText variant="callout" muted>Vorlagen fuer Faerbungen, Inkubationen und kurze Routinefenster.</AppText>
        <Button label="Neuer Timer" icon="add" onPress={() => router.push('/(tabs)/timer/new')} />
      </View>

      <Section title="Aktiv">
        {activeTimers.length ? activeTimers.map((timer) => <TimerRow key={timer.id} timer={timer} />) : <EmptyState icon="timer" title="Alles ruhig" description="Aktive Timer erscheinen hier mit verbleibender Zeit." />}
      </Section>

      <Section title="Vorlagen">
        {templates.map((template) => (
          <ListRow
            key={template.id}
            icon="timer"
            title={template.name}
            subtitle={`${formatDuration(template.durationSeconds)} · ${areaLabels[template.bereich]}`}
            accentColor={theme.area[template.bereich]}
            trailing={<Button label="Start" icon="play-arrow" variant="secondary" onPress={() => startTimer(template)} />}
            onPress={() => startTimer(template)}
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
