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
}

export function ActionTile({ icon, title, subtitle, accentColor, style, ...props }: ActionTileProps) {
  const theme = useAppTheme();

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={props.accessibilityLabel ?? title}
      {...props}
      style={({ pressed }) => [
        styles.tile,
        {
          backgroundColor: pressed ? theme.backgroundSunk : theme.card,
          borderColor: theme.borderStrong,
          borderTopColor: accentColor ?? theme.borderStrong,
        },
        style as object,
      ]}>
      <View style={[styles.iconWrap, { backgroundColor: theme.backgroundElev, borderColor: accentColor ?? theme.border }]}> 
        <AppIcon name={icon} size={22} color={accentColor ?? theme.info} />
      </View>
      <View style={styles.copy}>
        <AppText variant="bodyEmph">{title}</AppText>
        <AppText variant="footnote" muted>{subtitle}</AppText>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  tile: {
    flexGrow: 1,
    flexShrink: 1,
    minWidth: 132,
    minHeight: 128,
    borderWidth: 1,
    borderTopWidth: 4,
    borderRadius: radius.md,
    padding: spacing.md,
    gap: spacing.sm,
  },
  iconWrap: {
    width: 42,
    height: 42,
    borderRadius: radius.full,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  copy: {
    gap: spacing.xs,
  },
});