import { StyleSheet, View, type ViewProps } from 'react-native';

import { AppText } from '@/src/components/ui/AppText';
import { radius, spacing, typography, useAppTheme } from '@/src/lib/theme/tokens';

interface NumericDisplayProps extends ViewProps {
  value: string | number;
  label?: string;
  size?: 'sm' | 'md' | 'lg';
}

export function NumericDisplay({ value, label, size = 'md', style, ...props }: NumericDisplayProps) {
  const theme = useAppTheme();
  const fontSize = size === 'lg' ? 42 : size === 'sm' ? 22 : 32;
  const lineHeight = size === 'lg' ? 48 : size === 'sm' ? 28 : 38;

  return (
    <View
      {...props}
      accessibilityRole="text"
      accessibilityLabel={label ? `${label}: ${value}` : String(value)}
      style={[styles.wrap, { backgroundColor: theme.backgroundSunk, borderColor: theme.border }, style]}>
      <AppText style={[typography.mono, styles.value, { color: theme.foreground, fontSize, lineHeight }]}>
        {value}
      </AppText>
      {label ? <AppText variant="caption" muted>{label}</AppText> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    borderWidth: 1,
    borderRadius: radius.lg,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    alignItems: 'center',
    justifyContent: 'center',
    minWidth: 96,
    gap: 2,
  },
  value: {
    textAlign: 'center',
  },
});
