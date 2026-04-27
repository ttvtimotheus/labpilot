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
}

export function ListRow({ icon, title, subtitle, trailing, accentColor, disabled, style, ...props }: ListRowProps) {
  const theme = useAppTheme();
  const canPress = !!props.onPress && !disabled;

  return (
    <Pressable
      accessibilityRole={canPress ? 'button' : undefined}
      accessibilityLabel={props.accessibilityLabel ?? title}
      disabled={!canPress}
      {...props}
      style={({ pressed }) => [
        styles.row,
        {
          backgroundColor: pressed ? theme.backgroundSunk : theme.card,
          borderColor: theme.border,
        },
        style as object,
      ]}>
      {icon ? (
        <View style={[styles.icon, { backgroundColor: theme.backgroundSunk }]}> 
          <AppIcon name={icon} size={22} color={accentColor ?? theme.info} />
        </View>
      ) : null}
      <View style={styles.copy}>
        <AppText variant="bodyEmph" numberOfLines={2}>{title}</AppText>
        {subtitle ? <AppText variant="subhead" muted numberOfLines={3}>{subtitle}</AppText> : null}
      </View>
      {trailing ?? (canPress ? <AppIcon name="chevron-right" size={22} color={theme.foregroundSubtle} /> : null)}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  row: {
    minHeight: 64,
    borderWidth: 1,
    borderRadius: radius.lg,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
  },
  icon: {
    width: 44,
    height: 44,
    borderRadius: radius.md,
    alignItems: 'center',
    justifyContent: 'center',
  },
  copy: {
    flex: 1,
    minWidth: 0,
    gap: 2,
  },
});
