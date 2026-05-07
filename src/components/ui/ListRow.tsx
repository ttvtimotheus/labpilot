import { Pressable, StyleSheet, View, type PressableProps } from 'react-native';

import { AppIcon } from '@/src/components/ui/AppIcon';
import { AppText } from '@/src/components/ui/AppText';
import { radius, spacing, useAppTheme } from '@/src/lib/theme/tokens';

type IconName = React.ComponentProps<typeof AppIcon>['name'];

interface ListRowProps extends PressableProps {
  icon?: IconName;
  title: string;
  subtitle?: string;
  trailing?: React.ReactNode;
  accentColor?: string;
  actionLabel?: string;
}

export function ListRow({ icon, title, subtitle, trailing, accentColor, actionLabel = 'Oeffnen', disabled, style, ...props }: ListRowProps) {
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
      {icon ? (
        <View style={[styles.icon, { backgroundColor: theme.backgroundElev, borderColor: accentColor ?? theme.border }]}> 
          <AppIcon name={icon} size={22} color={accentColor ?? theme.info} />
        </View>
      ) : null}
      <View style={styles.copy}>
        <AppText variant="bodyEmph" numberOfLines={2}>{title}</AppText>
        {subtitle ? <AppText variant="subhead" muted numberOfLines={3}>{subtitle}</AppText> : null}
      </View>
      <View style={styles.trailing}>
        {trailing ?? (canPress ? (
          <View style={styles.actionHint}>
            <AppText variant="caption" style={{ color: accentColor ?? theme.info }}>{actionLabel}</AppText>
            <AppIcon name="chevron-right" size={18} color={accentColor ?? theme.info} />
          </View>
        ) : null)}
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  row: {
    minHeight: 74,
    borderWidth: 1,
    borderRadius: radius.md,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
  },
  icon: {
    width: 42,
    height: 42,
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
  trailing: {
    justifyContent: 'center',
    alignItems: 'center',
    minWidth: 20,
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
