import { StyleSheet, View, type ViewProps } from 'react-native';

import { AppIcon } from '@/src/components/ui/AppIcon';
import { AppText } from '@/src/components/ui/AppText';
import { radius, spacing, useAppTheme } from '@/src/lib/theme/tokens';

type BannerTone = 'neutral' | 'info' | 'success' | 'warning' | 'danger';
type IconName = React.ComponentProps<typeof AppIcon>['name'];

interface NoticeBannerProps extends ViewProps {
  title: string;
  description: string;
  tone?: BannerTone;
  icon?: IconName;
  action?: React.ReactNode;
}

export function NoticeBanner({ title, description, tone = 'neutral', icon = 'info', action, style, ...props }: NoticeBannerProps) {
  const theme = useAppTheme();
  const accent = tone === 'info'
    ? theme.info
    : tone === 'success'
      ? theme.success
      : tone === 'warning'
        ? theme.warning
        : tone === 'danger'
          ? theme.danger
          : theme.borderStrong;

  return (
    <View
      accessibilityRole={tone === 'danger' ? 'alert' : undefined}
      {...props}
      style={[styles.banner, { backgroundColor: theme.backgroundElev, borderColor: accent }, style]}>
      <View style={[styles.iconWrap, { backgroundColor: theme.card, borderColor: accent }]}> 
        <AppIcon name={icon} size={18} color={accent} />
      </View>
      <View style={styles.copy}>
        <AppText variant="bodyEmph">{title}</AppText>
        <AppText variant="footnote" muted>{description}</AppText>
        {action ? <View style={styles.action}>{action}</View> : null}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  banner: {
    borderWidth: 1,
    borderRadius: radius.lg,
    padding: spacing.md,
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: spacing.sm,
  },
  iconWrap: {
    width: 32,
    height: 32,
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
  action: {
    paddingTop: spacing.xs,
  },
});