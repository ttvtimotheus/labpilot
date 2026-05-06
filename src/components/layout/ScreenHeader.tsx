import { StyleSheet, View, type ViewProps } from 'react-native';

import { AppText } from '@/src/components/ui/AppText';
import { spacing, typography, useAppTheme } from '@/src/lib/theme/tokens';

interface ScreenHeaderProps extends ViewProps {
  eyebrow?: string;
  title: string;
  description?: string;
  action?: React.ReactNode;
  chips?: React.ReactNode;
}

export function ScreenHeader({ eyebrow, title, description, action, chips, style, ...props }: ScreenHeaderProps) {
  const theme = useAppTheme();

  return (
    <View {...props} style={[styles.wrap, style]}>
      <View style={styles.topRow}>
        <View style={styles.copy}>
          {eyebrow ? (
            <AppText variant="caption" style={[styles.eyebrow, typography.caption, { color: theme.foregroundSubtle }]}>
              {eyebrow}
            </AppText>
          ) : null}
          <AppText variant="display">{title}</AppText>
          {description ? (
            <AppText variant="callout" muted>
              {description}
            </AppText>
          ) : null}
        </View>
        {action ? <View style={styles.action}>{action}</View> : null}
      </View>
      {chips ? <View style={styles.chips}>{chips}</View> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    gap: spacing.md,
  },
  topRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: spacing.md,
  },
  copy: {
    flex: 1,
    minWidth: 0,
    gap: spacing.xs,
  },
  eyebrow: {
    textTransform: 'uppercase',
    letterSpacing: 0.8,
  },
  action: {
    paddingTop: spacing.xs,
    flexShrink: 0,
  },
  chips: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.xs,
  },
});