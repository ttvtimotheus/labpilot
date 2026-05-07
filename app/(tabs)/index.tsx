import { router } from 'expo-router';
import { Pressable, StyleSheet, View } from 'react-native';

import { TimerRow } from '@/src/components/domain/TimerRow';
import { Screen } from '@/src/components/layout/Screen';
import { ScreenHeader } from '@/src/components/layout/ScreenHeader';
import { AppIcon } from '@/src/components/ui/AppIcon';
import { AppText } from '@/src/components/ui/AppText';
import { Button } from '@/src/components/ui/Button';
import { NoticeBanner } from '@/src/components/ui/NoticeBanner';
import { StatusChip } from '@/src/components/ui/StatusChip';
import { protokolle } from '@/src/features/protokolle/data';
import { useTimerStore } from '@/src/features/timer/store';
import { useNow } from '@/src/hooks/useNow';
import { useAuth } from '@/src/lib/auth/AuthProvider';
import { areaLabels, radius, spacing, useAppTheme } from '@/src/lib/theme/tokens';
import { formatDuration } from '@/src/lib/utils/time';

type IconName = React.ComponentProps<typeof AppIcon>['name'];

interface CommandButtonProps {
  icon: IconName;
  title: string;
  subtitle: string;
  accentColor: string;
  onPress: () => void;
}

function CommandButton({ icon, title, subtitle, accentColor, onPress }: CommandButtonProps) {
  const theme = useAppTheme();

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={title}
      focusable
      onPress={onPress}
      style={(state) => {
        const focused = 'focused' in state && Boolean(state.focused);

        return [
          styles.commandButton,
          {
            backgroundColor: state.pressed ? theme.backgroundSunk : theme.card,
            borderColor: focused ? theme.focus : theme.border,
          },
          focused && styles.focused,
        ];
      }}>
      <View style={[styles.commandIcon, { backgroundColor: theme.backgroundElev, borderColor: accentColor }]}> 
        <AppIcon name={icon} size={19} color={accentColor} />
      </View>
      <View style={styles.commandCopy}>
        <AppText variant="bodyEmph" numberOfLines={1}>{title}</AppText>
        <AppText variant="caption" muted numberOfLines={1}>{subtitle}</AppText>
      </View>
    </Pressable>
  );
}

interface LibraryCellProps {
  icon: IconName;
  eyebrow: string;
  title: string;
  subtitle: string;
  accentColor: string;
  actionLabel: string;
  onPress: () => void;
}

function LibraryCell({ icon, eyebrow, title, subtitle, accentColor, actionLabel, onPress }: LibraryCellProps) {
  const theme = useAppTheme();

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={title}
      focusable
      onPress={onPress}
      style={(state) => {
        const focused = 'focused' in state && Boolean(state.focused);

        return [
          styles.libraryCell,
          {
            backgroundColor: state.pressed ? theme.backgroundSunk : theme.card,
            borderColor: focused ? theme.focus : theme.border,
          },
          focused && styles.focused,
        ];
      }}>
      <View style={styles.libraryTopRow}>
        <View style={[styles.libraryIcon, { backgroundColor: theme.backgroundElev, borderColor: accentColor }]}> 
          <AppIcon name={icon} size={18} color={accentColor} />
        </View>
        <AppText variant="caption" style={{ color: accentColor }} numberOfLines={1}>{actionLabel}</AppText>
      </View>
      <View style={styles.libraryCopy}>
        <AppText variant="caption" muted numberOfLines={1}>{eyebrow}</AppText>
        <AppText variant="bodyEmph" numberOfLines={2}>{title}</AppText>
        <AppText variant="footnote" muted numberOfLines={2}>{subtitle}</AppText>
      </View>
    </Pressable>
  );
}

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
        title="Arbeitsplatz"
        description="Schneller Zugriff auf Timer, Zaehler, Protokolle und Referenzen."
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

      <View style={styles.commandGrid}>
        <CommandButton icon="timer" title="Timer" subtitle="Starten" accentColor={theme.area.mibi} onPress={() => router.push('/(tabs)/timer')} />
        <CommandButton icon="calculate" title="Zaehler" subtitle="Erfassen" accentColor={theme.area.haema} onPress={() => router.push('/(tabs)/zaehler')} />
        <CommandButton icon="assignment" title="Protokolle" subtitle="Ablauf" accentColor={theme.area.histo} onPress={() => router.push('/(tabs)/protokolle')} />
        <CommandButton icon="menu-book" title="Wissen" subtitle="Referenz" accentColor={theme.area.learn} onPress={() => router.push('/(tabs)/wissen')} />
      </View>

      <View style={[styles.workbench, { backgroundColor: theme.backgroundElev, borderColor: theme.border }]}> 
        <View style={styles.workbenchHeader}>
          <View style={styles.workbenchTitleBlock}>
            <AppText variant="caption" muted>Jetzt</AppText>
            <AppText variant="h2">Fokus & Schnellstart</AppText>
          </View>
          <StatusChip label={activeTimers.length ? `${activeTimers.length} aktiv` : 'Bereit'} tone={activeTimers.length ? 'success' : 'neutral'} icon={activeTimers.length ? 'timer' : 'check-circle'} />
        </View>

        <View style={styles.workbenchBody}>
          <View style={styles.focusPane}>
            {activeTimers.length ? (
              activeTimers.slice(0, 2).map((timer) => <TimerRow key={timer.id} timer={timer} />)
            ) : (
              <View style={[styles.noFocusPane, { backgroundColor: theme.card, borderColor: theme.border }]}> 
                <AppIcon name="timer" size={22} color={theme.area.mibi} />
                <View style={styles.noFocusCopy}>
                  <AppText variant="bodyEmph">Kein Timer aktiv</AppText>
                  <AppText variant="footnote" muted>Direkt starten oder Arbeitsbereich oeffnen.</AppText>
                </View>
              </View>
            )}
          </View>

          {quickTemplate ? (
            <Pressable
              accessibilityRole="button"
              accessibilityLabel={`${quickTemplate.name} starten`}
              focusable
              onPress={() => startTimer(quickTemplate)}
              style={(state) => {
                const focused = 'focused' in state && Boolean(state.focused);

                return [
                  styles.quickStart,
                  {
                    backgroundColor: state.pressed ? theme.backgroundSunk : theme.card,
                    borderColor: focused ? theme.focus : theme.border,
                  },
                  focused && styles.focused,
                ];
              }}>
              <AppText variant="caption" style={{ color: theme.area[quickTemplate.bereich] }}>Schnellstart</AppText>
              <AppText variant="h3" numberOfLines={2}>{quickTemplate.name}</AppText>
              <AppText variant="mono">{formatDuration(quickTemplate.durationSeconds)}</AppText>
              <AppText variant="footnote" muted numberOfLines={1}>{areaLabels[quickTemplate.bereich]}</AppText>
            </Pressable>
          ) : null}
        </View>
      </View>

      <View style={styles.libraryBand}>
        <View style={styles.libraryHeader}>
          <View style={styles.libraryTitleBlock}>
            <AppText variant="caption" muted>Bibliothek</AppText>
            <AppText variant="h3">Standardpfade</AppText>
          </View>
          <AppText variant="footnote" muted>{protokolle.length} Protokolle</AppText>
        </View>
        <View style={styles.libraryGrid}>
          <LibraryCell
            icon="assignment"
            eyebrow="Protokolle"
            title="Standardablaeufe"
            subtitle={`${protokolle.length} integrierte Laborwege`}
            accentColor={theme.area.histo}
            actionLabel="Oeffnen"
            onPress={() => router.push('/(tabs)/protokolle')}
          />
          <LibraryCell
            icon="menu-book"
            eyebrow="Wissen"
            title="Referenzen"
            subtitle="Werte, Medien, Rechner"
            accentColor={theme.area.learn}
            actionLabel="Oeffnen"
            onPress={() => router.push('/(tabs)/wissen')}
          />
          <LibraryCell
            icon="science"
            eyebrow="Zaehler"
            title="Kolonien"
            subtitle="CFU/ml und Kategorien"
            accentColor={theme.area.mibi}
            actionLabel="Zaehlen"
            onPress={() => router.push('/(tabs)/zaehler/kolonien')}
          />
        </View>
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  commandGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.xs,
  },
  commandButton: {
    flexBasis: '48.8%',
    minHeight: 58,
    borderWidth: 1,
    borderRadius: radius.md,
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
  },
  commandIcon: {
    width: 34,
    height: 34,
    borderRadius: radius.full,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  commandCopy: {
    flex: 1,
    minWidth: 0,
    gap: 1,
  },
  workbench: {
    borderWidth: 1,
    borderRadius: radius.lg,
    padding: spacing.md,
    gap: spacing.md,
  },
  workbenchHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: spacing.md,
  },
  workbenchTitleBlock: {
    flex: 1,
    minWidth: 0,
    gap: spacing.xxs,
  },
  workbenchBody: {
    flexDirection: 'row',
    alignItems: 'stretch',
    gap: spacing.sm,
    flexWrap: 'wrap',
  },
  focusPane: {
    flexGrow: 1,
    flexShrink: 1,
    flexBasis: '58%',
    gap: spacing.sm,
    minWidth: 168,
  },
  noFocusPane: {
    minHeight: 116,
    borderWidth: 1,
    borderRadius: radius.md,
    padding: spacing.md,
    justifyContent: 'space-between',
    gap: spacing.sm,
  },
  noFocusCopy: {
    gap: spacing.xxs,
  },
  quickStart: {
    flexGrow: 1,
    flexShrink: 1,
    flexBasis: '36%',
    minWidth: 128,
    minHeight: 116,
    borderWidth: 1,
    borderRadius: radius.md,
    padding: spacing.md,
    justifyContent: 'space-between',
    gap: spacing.xs,
  },
  libraryBand: {
    gap: spacing.sm,
  },
  libraryHeader: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'space-between',
    gap: spacing.md,
  },
  libraryTitleBlock: {
    flex: 1,
    minWidth: 0,
    gap: spacing.xxs,
  },
  libraryGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.xs,
  },
  libraryCell: {
    flexGrow: 1,
    flexShrink: 1,
    flexBasis: '31%',
    minWidth: 100,
    minHeight: 122,
    borderWidth: 1,
    borderRadius: radius.md,
    padding: spacing.sm,
    justifyContent: 'space-between',
    gap: spacing.xs,
  },
  libraryTopRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: spacing.xs,
  },
  libraryIcon: {
    width: 32,
    height: 32,
    borderRadius: radius.full,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  libraryCopy: {
    gap: spacing.xxs,
  },
  focused: {
    borderWidth: 2,
  },
});
