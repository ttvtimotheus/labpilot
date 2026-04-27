import { StyleSheet, View, type ViewProps } from 'react-native';

import { AppText } from '@/src/components/ui/AppText';
import { spacing, typography, useAppTheme } from '@/src/lib/theme/tokens';

interface SectionProps extends ViewProps {
  title: string;
  action?: React.ReactNode;
}

export function Section({ title, action, children, style, ...props }: SectionProps) {
  const theme = useAppTheme();

  return (
    <View {...props} style={[styles.section, style]}>
      <View style={styles.header}>
        <AppText
          variant="caption"
          style={[styles.title, typography.caption, { color: theme.foregroundMuted }]}>
          {title}
        </AppText>
        {action}
      </View>
      <View style={styles.body}>{children}</View>
    </View>
  );
}

const styles = StyleSheet.create({
  section: {
    gap: spacing.xs,
  },
  header: {
    minHeight: 24,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: spacing.md,
    paddingHorizontal: spacing.xs,
  },
  title: {
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  body: {
    gap: spacing.sm,
  },
});
