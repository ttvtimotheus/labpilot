import { Pressable, StyleSheet, View, type PressableProps } from 'react-native';

import { AppIcon } from '@/src/components/ui/AppIcon';
import { AppText } from '@/src/components/ui/AppText';
import { radius, spacing, useAppTheme } from '@/src/lib/theme/tokens';

type IconName = React.ComponentProps<typeof AppIcon>['name'];

interface ResourceRowProps extends PressableProps {
  icon?: IconName;
  eyebrow?: string;
  title: string;
  subtitle: string;
  accentColor?: string;
  badge?: React.ReactNode;
}

export function ResourceRow({ icon = 'article', eyebrow, title, subtitle, accentColor, badge, style, ...props }: ResourceRowProps) {
  const theme = useAppTheme();

  return (
    <Pressable
      accessibilityRole={props.onPress ? 'button' : undefined}
      accessibilityLabel={props.accessibilityLabel ?? title}
      {...props}
      style={({ pressed }) => [
        styles.row,
        {
          backgroundColor: pressed ? theme.backgroundSunk : theme.card,
          borderColor: theme.border,
          borderLeftColor: accentColor ?? theme.borderStrong,
        },
        style as object,
      ]}>
      <View style={[styles.iconWrap, { backgroundColor: theme.backgroundElev, borderColor: accentColor ?? theme.borderStrong }]}> 
        <AppIcon name={icon} size={20} color={accentColor ?? theme.info} />
      </View>
      <View style={styles.copy}>
        {eyebrow ? <AppText variant="caption" muted>{eyebrow}</AppText> : null}
        <AppText variant="bodyEmph">{title}</AppText>
        <AppText variant="footnote" muted>{subtitle}</AppText>
      </View>
      {badge ? <View style={styles.badge}>{badge}</View> : <AppIcon name="chevron-right" size={20} color={theme.foregroundSubtle} />}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  row: {
    minHeight: 78,
    borderWidth: 1,
    borderLeftWidth: 4,
    borderRadius: radius.md,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
  },
  iconWrap: {
    width: 40,
    height: 40,
    borderRadius: radius.full,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  copy: {
    flex: 1,
    minWidth: 0,
    gap: spacing.xxs,
  },
  badge: {
    alignItems: 'center',
    justifyContent: 'center',
  },
});