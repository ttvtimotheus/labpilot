import { StyleSheet, View, type ViewProps } from 'react-native';

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
          borderColor: bereich ? theme.area[bereich] : theme.border,
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
    gap: spacing.md,
  },
  elevated: {
    shadowColor: '#121A22',
    shadowOpacity: 0.06,
    shadowRadius: 18,
    shadowOffset: { width: 0, height: 8 },
    elevation: 2,
  },
});
