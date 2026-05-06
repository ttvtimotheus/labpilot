import { router } from 'expo-router';
import { Pressable, StyleSheet, View } from 'react-native';

import { AppText } from '@/src/components/ui/AppText';
import { NumericDisplay } from '@/src/components/ui/NumericDisplay';
import { areaLabels, radius, spacing, useAppTheme } from '@/src/lib/theme/tokens';
import { formatDuration, getRemainingSeconds } from '@/src/lib/utils/time';
import type { ActiveTimer } from '@/src/types/domain';

export function TimerRow({ timer }: { timer: ActiveTimer }) {
  const theme = useAppTheme();
  const remaining = getRemainingSeconds(timer.endsAt);

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={`${timer.name}, ${formatDuration(remaining)} verbleibend`}
      onPress={() => router.push(`/(tabs)/timer/${timer.id}`)}
      style={({ pressed }) => [
        styles.row,
        {
          backgroundColor: pressed ? theme.backgroundElev : theme.card,
          borderColor: theme.border,
          borderTopColor: theme.area[timer.bereich],
        },
      ]}>
      <View style={styles.copy}>
        <AppText variant="caption" muted>
          {areaLabels[timer.bereich]}
        </AppText>
        <AppText variant="bodyEmph" numberOfLines={2}>{timer.name}</AppText>
      </View>
      <NumericDisplay value={formatDuration(remaining)} label="Restzeit" size="sm" />
    </Pressable>
  );
}

const styles = StyleSheet.create({
  row: {
    minHeight: 84,
    borderWidth: 1,
    borderTopWidth: 4,
    borderRadius: radius.md,
    padding: spacing.md,
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
  },
  copy: {
    flex: 1,
    minWidth: 0,
    gap: spacing.xxs,
  },
});
