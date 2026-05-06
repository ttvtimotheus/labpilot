import { StyleSheet, View, type ViewProps } from 'react-native';

import { AppText } from '@/src/components/ui/AppText';
import { spacing, useAppTheme } from '@/src/lib/theme/tokens';

interface SectionProps extends ViewProps {
  title: string;
  description?: string;
  action?: React.ReactNode;
}

export function Section({ title, description, action, children, style, ...props }: SectionProps) {
  const theme = useAppTheme();

  return (
    <View {...props} style={[styles.section, style]}>
      <View style={styles.header}>
        <View style={styles.headerCopy}>
          <AppText variant="h3" style={[styles.title, { color: theme.foreground }]}> 
            {title}
          </AppText>
          {description ? (
            <AppText variant="footnote" muted>
              {description}
            </AppText>
          ) : null}
        </View>
        {action}
      </View>
      <View style={styles.body}>{children}</View>
    </View>
  );
}

const styles = StyleSheet.create({
  section: {
    gap: spacing.md,
  },
  header: {
    minHeight: 24,
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    gap: spacing.md,
    paddingHorizontal: 0,
  },
  headerCopy: {
    flex: 1,
    minWidth: 0,
    gap: spacing.xxs,
  },
  title: {
    letterSpacing: -0.2,
  },
  body: {
    gap: spacing.md,
  },
});
