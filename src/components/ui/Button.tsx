import { Pressable, StyleSheet, View, type PressableProps } from 'react-native';

import { AppIcon } from '@/src/components/ui/AppIcon';
import { AppText } from '@/src/components/ui/AppText';
import { radius, spacing, typography, useAppTheme } from '@/src/lib/theme/tokens';

type ButtonVariant = 'primary' | 'secondary' | 'ghost' | 'destructive';

type IconName = React.ComponentProps<typeof AppIcon>['name'];

interface ButtonProps extends PressableProps {
  label: string;
  variant?: ButtonVariant;
  icon?: IconName;
  fullWidth?: boolean;
}

export function Button({ label, variant = 'primary', icon, fullWidth, disabled, style, ...props }: ButtonProps) {
  const theme = useAppTheme();
  const isPrimary = variant === 'primary';
  const isDestructive = variant === 'destructive';
  const foreground = isPrimary || isDestructive ? theme.card : variant === 'ghost' ? theme.info : theme.foreground;
  const backgroundColor = isDestructive
    ? theme.danger
    : isPrimary
      ? theme.foreground
      : variant === 'secondary'
        ? theme.card
        : 'transparent';

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={props.accessibilityLabel ?? label}
      accessibilityState={{ ...props.accessibilityState, disabled: Boolean(disabled) }}
      focusable={!disabled}
      disabled={disabled}
      {...props}
      style={(state) => {
        const focused = 'focused' in state && Boolean(state.focused);

        return [
          styles.base,
          fullWidth && styles.fullWidth,
          {
            backgroundColor: state.pressed && !disabled ? (variant === 'ghost' ? theme.backgroundSunk : backgroundColor) : backgroundColor,
            borderColor: focused ? theme.focus : isPrimary || isDestructive ? backgroundColor : variant === 'ghost' ? 'transparent' : theme.borderStrong,
            opacity: disabled ? 0.55 : 1,
            transform: [{ scale: state.pressed && !disabled ? 0.98 : 1 }],
          },
          focused && styles.focused,
          style as object,
        ];
      }}>
      <View style={styles.content}>
        {icon ? <AppIcon name={icon} size={20} color={foreground} /> : null}
        <AppText variant="bodyEmph" style={[typography.bodyEmph, { color: foreground }]}>
          {label}
        </AppText>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  base: {
    minHeight: 46,
    borderRadius: radius.md,
    borderWidth: 1,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    alignItems: 'center',
    justifyContent: 'center',
  },
  fullWidth: {
    alignSelf: 'stretch',
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.xs,
  },
  focused: {
    borderWidth: 2,
  },
});
