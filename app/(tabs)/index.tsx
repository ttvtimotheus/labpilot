import { router } from 'expo-router';
import { StyleSheet, View } from 'react-native';

import { TimerRow } from '@/src/components/domain/TimerRow';
import { Screen } from '@/src/components/layout/Screen';
import { ScreenHeader } from '@/src/components/layout/ScreenHeader';
import { Section } from '@/src/components/layout/Section';
import { ActionTile } from '@/src/components/ui/ActionTile';
import { Button } from '@/src/components/ui/Button';
import { EmptyState } from '@/src/components/ui/EmptyState';
import { NoticeBanner } from '@/src/components/ui/NoticeBanner';
import { ResourceRow } from '@/src/components/ui/ResourceRow';
import { StatusChip } from '@/src/components/ui/StatusChip';
import { protokolle } from '@/src/features/protokolle/data';
import { useTimerStore } from '@/src/features/timer/store';
import { useNow } from '@/src/hooks/useNow';
import { useAuth } from '@/src/lib/auth/AuthProvider';
import { areaLabels, spacing, useAppTheme } from '@/src/lib/theme/tokens';
import { formatDuration } from '@/src/lib/utils/time';

export default function HomeScreen() {
  useNow();
  const theme = useAppTheme();
  const { isGuest } = useAuth();
  const templates = useTimerStore((state) => state.templates);
  const activeTimers = useTimerStore((state) => state.activeTimers);
  const startTimer = useTimerStore((state) => state.startTimer);
  const quickTemplate = templates[0];

  return (
    <Screen>
      <ScreenHeader
        eyebrow="LabPilot"
        title="Laborarbeitsplatz"
        description="Timer, Protokolle und Referenzwissen in einer klaren Arbeitsoberflaeche fuer Routine, Lehre und Nachschlagen."
        action={<Button label="Einstellungen" icon="settings" variant="secondary" onPress={() => router.push('/settings')} />}
        chips={
          <>
            <StatusChip
              label={isGuest ? 'Lokal' : 'Konto aktiv'}
              tone={isGuest ? 'warning' : 'info'}
              icon={isGuest ? 'offline-bolt' : 'cloud-done'}
            />
            <StatusChip
              label={activeTimers.length ? `${activeTimers.length} Timer aktiv` : 'Bereit'}
              tone={activeTimers.length ? 'success' : 'neutral'}
              icon={activeTimers.length ? 'timer' : 'check-circle'}
            />
          </>
        }
      />

      {isGuest ? (
        <NoticeBanner
          title="Arbeitet lokal auf diesem Geraet"
          description="Die Kernfunktionen stehen direkt zur Verfuegung. Konto und Abgleich kannst du spaeter dazuschalten."
          tone="warning"
          icon="offline-bolt"
        />
      ) : null}

      <Section title="Direkt einsteigen" description="Die vier wichtigsten Wege fuer die naechste Handlung.">
        <View style={styles.actionGrid}>
          <ActionTile style={styles.actionTile} icon="timer" title="Timer" subtitle="Zeitfenster starten und aktiv begleiten" accentColor={theme.area.mibi} onPress={() => router.push('/(tabs)/timer')} />
          <ActionTile style={styles.actionTile} icon="assignment" title="Protokolle" subtitle="Standardablaeufe aufrufen und dokumentieren" accentColor={theme.area.histo} onPress={() => router.push('/(tabs)/protokolle')} />
          <ActionTile style={styles.actionTile} icon="menu-book" title="Wissen" subtitle="Referenzen, Themen und Rechner oeffnen" accentColor={theme.area.learn} onPress={() => router.push('/(tabs)/wissen')} />
          <ActionTile style={styles.actionTile} icon="calculate" title="Zaehler" subtitle="Kolonien und Differentiale erfassen" accentColor={theme.area.haema} onPress={() => router.push('/(tabs)/zaehler')} />
        </View>
      </Section>

      <Section title="Aktueller Fokus" description="Laufende Arbeit erscheint hier zuerst, bevor du in die Bibliotheken gehst.">
        {activeTimers.length ? (
          activeTimers.map((timer) => <TimerRow key={timer.id} timer={timer} />)
        ) : (
          <EmptyState icon="timer" title="Kein Timer aktiv" description="Starte einen Zeitabschnitt oder nimm eine Standardvorlage direkt aus der Bibliothek unten." />
        )}
      </Section>

      <Section title="Standardbibliothek" description="Integrierte Startpunkte statt Demo-Daten: Vorlagen, Abläufe und Nachschlagepfade.">
        {quickTemplate ? (
          <ResourceRow
            icon="timer"
            eyebrow="Timerbibliothek"
            title={quickTemplate.name}
            subtitle={`${areaLabels[quickTemplate.bereich]} · ${formatDuration(quickTemplate.durationSeconds)} · Standardvorlage fuer den Schnellstart`}
            accentColor={theme.area[quickTemplate.bereich]}
            onPress={() => startTimer(quickTemplate)}
          />
        ) : null}
        <ResourceRow
          icon="assignment"
          eyebrow="Protokolle"
          title="Standardablaeufe"
          subtitle={`${protokolle.length} integrierte Ablaufe fuer wiederkehrende Laborwege`}
          accentColor={theme.area.histo}
          onPress={() => router.push('/(tabs)/protokolle')}
        />
        <ResourceRow
          icon="menu-book"
          eyebrow="Wissensbibliothek"
          title="Referenzen und Themen"
          subtitle="Kompakte Fachinhalte, Nachschlagewerte und Rechner fuer den Arbeitsplatz"
          accentColor={theme.area.learn}
          onPress={() => router.push('/(tabs)/wissen')}
        />
      </Section>
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
