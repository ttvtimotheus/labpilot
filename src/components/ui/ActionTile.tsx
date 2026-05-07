import { Pressable, StyleSheet, View, type PressableProps } from 'react-native';

import { AppIcon } from '@/src/components/ui/AppIcon';
import { AppText } from '@/src/components/ui/AppText';
import { radius, spacing, useAppTheme } from '@/src/lib/theme/tokens';

type IconName = React.ComponentProps<typeof AppIcon>['name'];

interface ActionTileProps extends PressableProps {
  icon: IconName;
  title: string;
  subtitle: string;
  accentColor?: string;
  actionLabel?: string;
}

export function ActionTile({ icon, title, subtitle, accentColor, actionLabel = 'Oeffnen', style, ...props }: ActionTileProps) {
  const theme = useAppTheme();
  const canPress = !!props.onPress && !props.disabled;

  return (
    <Pressable
      accessibilityRole={canPress ? 'button' : undefined}
      accessibilityLabel={props.accessibilityLabel ?? title}
      accessibilityState={{ ...props.accessibilityState, disabled: props.disabled ? true : undefined }}
      focusable={canPress}
      disabled={!canPress}
      {...props}
      style={(state) => {
        const focused = 'focused' in state && Boolean(state.focused);
        return [
          styles.tile,
          {
            backgroundColor: state.pressed ? theme.backgroundSunk : theme.card,
            borderColor: focused ? theme.focus : theme.borderStrong,
            opacity: canPress ? 1 : 0.62,
          },
          focused && styles.focused,
          style as object,
        ];
      }}>
      <View style={[styles.iconWrap, { backgroundColor: theme.backgroundElev, borderColor: accentColor ?? theme.border }]}> 
        <AppIcon name={icon} size={20} color={accentColor ?? theme.info} />
      </View>
      <View style={styles.copy}>
        <AppText variant="bodyEmph" numberOfLines={1}>{title}</AppText>
        <AppText variant="footnote" muted numberOfLines={2}>{subtitle}</AppText>
      </View>
      {canPress ? (
        <View style={styles.footer}>
          <AppText variant="caption" style={{ color: accentColor ?? theme.info }}>{actionLabel}</AppText>
          <AppIcon name="chevron-right" size={17} color={accentColor ?? theme.info} />
        </View>
      ) : null}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  tile: {
    flexGrow: 1,
    flexShrink: 1,
    minWidth: 132,
    minHeight: 84,
    borderWidth: 1,
    borderRadius: radius.md,
    padding: spacing.sm,
    gap: spacing.sm,
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconWrap: {
    width: 38,
    height: 38,
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
  footer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xxs,
  },
  focused: {
    borderWidth: 2,
  },
});