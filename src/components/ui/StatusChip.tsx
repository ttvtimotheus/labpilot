import { StyleSheet, View } from 'react-native';

import { AppIcon } from '@/src/components/ui/AppIcon';
import { AppText } from '@/src/components/ui/AppText';
import { radius, spacing, useAppTheme } from '@/src/lib/theme/tokens';

type ChipTone = 'neutral' | 'info' | 'success' | 'warning' | 'danger';
type IconName = React.ComponentProps<typeof AppIcon>['name'];

interface StatusChipProps {
  label: string;
  tone?: ChipTone;
  icon?: IconName;
}

export function StatusChip({ label, tone = 'neutral', icon }: StatusChipProps) {
  const theme = useAppTheme();
  const color = tone === 'info'
    ? theme.info
    : tone === 'success'
      ? theme.success
      : tone === 'warning'
        ? theme.warning
        : tone === 'danger'
          ? theme.danger
          : theme.foregroundSubtle;

  return (
    <View style={[styles.chip, { backgroundColor: theme.backgroundElev, borderColor: color }]}> 
      {icon ? <AppIcon name={icon} size={14} color={color} /> : null}
      <AppText variant="caption" style={{ color }}>{label}</AppText>
    </View>
  );
}

const styles = StyleSheet.create({
  chip: {
    minHeight: 28,
    borderWidth: 1,
    borderRadius: radius.full,
    paddingHorizontal: spacing.sm,
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
  },
});