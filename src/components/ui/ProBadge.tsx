import { StyleSheet, View } from 'react-native';

import { AppIcon } from '@/src/components/ui/AppIcon';
import { AppText } from '@/src/components/ui/AppText';
import { radius, spacing, useAppTheme } from '@/src/lib/theme/tokens';

export function ProBadge() {
  const theme = useAppTheme();

  return (
    <View accessibilityLabel="Pro" style={[styles.badge, { backgroundColor: theme.backgroundElev, borderColor: theme.warning }]}> 
      <AppIcon name="workspace-premium" size={14} color={theme.warning} />
      <AppText variant="caption" style={{ color: theme.warning }}>Pro</AppText>
    </View>
  );
}

const styles = StyleSheet.create({
  badge: {
    minHeight: 28,
    borderWidth: 1,
    borderRadius: radius.full,
    paddingHorizontal: spacing.xs,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
});
