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
  actionLabel?: string;
  badge?: React.ReactNode;
}

export function ResourceRow({ icon = 'article', eyebrow, title, subtitle, accentColor, actionLabel = 'Oeffnen', badge, disabled, style, ...props }: ResourceRowProps) {
  const theme = useAppTheme();
  const canPress = !!props.onPress && !disabled;

  return (
    <Pressable
      accessibilityRole={canPress ? 'button' : undefined}
      accessibilityLabel={props.accessibilityLabel ?? title}
      accessibilityState={{ ...props.accessibilityState, disabled: disabled ? true : undefined }}
      focusable={canPress}
      disabled={!canPress}
      {...props}
      style={(state) => {
        const focused = 'focused' in state && Boolean(state.focused);

        return [
          styles.row,
          {
            backgroundColor: state.pressed ? theme.backgroundSunk : theme.card,
            borderColor: focused ? theme.focus : theme.border,
            opacity: disabled ? 0.62 : 1,
          },
          focused && styles.focused,
          style as object,
        ];
      }}>
      <View style={[styles.iconWrap, { backgroundColor: theme.backgroundElev, borderColor: accentColor ?? theme.borderStrong }]}> 
        <AppIcon name={icon} size={20} color={accentColor ?? theme.info} />
      </View>
      <View style={styles.copy}>
        {eyebrow ? <AppText variant="caption" muted>{eyebrow}</AppText> : null}
        <AppText variant="bodyEmph">{title}</AppText>
        <AppText variant="footnote" muted>{subtitle}</AppText>
      </View>
      {badge || canPress ? (
        <View style={styles.trailingGroup}>
          {badge ? <View style={styles.badge}>{badge}</View> : null}
          {canPress ? (
            <View style={styles.actionHint}>
              <AppText variant="caption" style={{ color: accentColor ?? theme.info }}>{actionLabel}</AppText>
              <AppIcon name="chevron-right" size={18} color={accentColor ?? theme.info} />
            </View>
          ) : null}
        </View>
      ) : null}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  row: {
    minHeight: 78,
    borderWidth: 1,
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
  trailingGroup: {
    alignItems: 'flex-end',
    justifyContent: 'center',
    gap: spacing.xs,
  },
  actionHint: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xxs,
  },
  focused: {
    borderWidth: 2,
  },
});