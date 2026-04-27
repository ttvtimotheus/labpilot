import { StyleSheet, View, type ViewProps } from 'react-native';

import { AppIcon } from '@/src/components/ui/AppIcon';
import { AppText } from '@/src/components/ui/AppText';
import { Button } from '@/src/components/ui/Button';
import { radius, spacing, useAppTheme } from '@/src/lib/theme/tokens';

type IconName = React.ComponentProps<typeof AppIcon>['name'];

interface EmptyStateProps extends ViewProps {
  icon: IconName;
  title: string;
  description: string;
  actionLabel?: string;
  onAction?: () => void;
}

export function EmptyState({ icon, title, description, actionLabel, onAction, style, ...props }: EmptyStateProps) {
  const theme = useAppTheme();

  return (
    <View {...props} style={[styles.wrap, { borderColor: theme.border, backgroundColor: theme.card }, style]}>
      <View style={[styles.icon, { backgroundColor: theme.backgroundSunk }]}> 
        <AppIcon name={icon} size={28} color={theme.info} />
      </View>
      <View style={styles.copy}>
        <AppText variant="h3" style={styles.center}>{title}</AppText>
        <AppText variant="subhead" muted style={styles.center}>{description}</AppText>
      </View>
      {actionLabel && onAction ? <Button label={actionLabel} onPress={onAction} variant="secondary" /> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    borderWidth: 1,
    borderStyle: 'dashed',
    borderRadius: radius.xl,
    padding: spacing.xl,
    alignItems: 'center',
    gap: spacing.md,
  },
  icon: {
    width: 56,
    height: 56,
    borderRadius: radius.lg,
    alignItems: 'center',
    justifyContent: 'center',
  },
  copy: {
    gap: spacing.xs,
    alignItems: 'center',
  },
  center: {
    textAlign: 'center',
  },
});
