import { View, type ViewProps, StyleSheet } from 'react-native';

import { radius, spacing, useAppTheme } from '@/src/lib/theme/tokens';
import type { Bereich } from '@/src/types/domain';

interface CardProps extends ViewProps {
  bereich?: Bereich;
  elevated?: boolean;
}

export function Card({ bereich, elevated, style, ...props }: CardProps) {
  const theme = useAppTheme();

  return (
    <View
      {...props}
      style={[
        styles.card,
        {
          backgroundColor: theme.card,
          borderColor: theme.border,
          borderLeftColor: bereich ? theme.area[bereich] : theme.border,
          borderLeftWidth: bereich ? 4 : 1,
        },
        elevated && styles.elevated,
        style,
      ]}
    />
  );
}

const styles = StyleSheet.create({
  card: {
    borderWidth: 1,
    borderRadius: radius.xl,
    padding: spacing.lg,
    gap: spacing.sm,
  },
  elevated: {
    shadowColor: '#000000',
    shadowOpacity: 0.08,
    shadowRadius: 18,
    shadowOffset: { width: 0, height: 10 },
    elevation: 2,
  },
});
