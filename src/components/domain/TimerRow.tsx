import { router } from 'expo-router';
import { Pressable, StyleSheet, View } from 'react-native';

import { AppText } from '@/src/components/ui/AppText';
import { NumericDisplay } from '@/src/components/ui/NumericDisplay';
import { areaLabels, spacing, useAppTheme } from '@/src/lib/theme/tokens';
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
          backgroundColor: pressed ? theme.backgroundSunk : theme.card,
          borderColor: theme.border,
          borderLeftColor: theme.area[timer.bereich],
        },
      ]}>
      <View style={styles.copy}>
        <AppText variant="bodyEmph" numberOfLines={2}>{timer.name}</AppText>
        <AppText variant="subhead" muted>{areaLabels[timer.bereich]}</AppText>
      </View>
      <NumericDisplay value={formatDuration(remaining)} size="sm" />
    </Pressable>
  );
}

const styles = StyleSheet.create({
  row: {
    minHeight: 76,
    borderWidth: 1,
    borderLeftWidth: 4,
    borderRadius: 16,
    padding: spacing.md,
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
  },
  copy: {
    flex: 1,
    minWidth: 0,
    gap: 2,
  },
});
