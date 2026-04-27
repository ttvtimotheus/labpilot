import { Text, type TextProps, StyleSheet } from 'react-native';

import { typography, useAppTheme } from '@/src/lib/theme/tokens';

type TextVariant = keyof typeof typography;

interface AppTextProps extends TextProps {
  variant?: TextVariant;
  muted?: boolean;
  subtle?: boolean;
}

export function AppText({ variant = 'body', muted, subtle, style, ...props }: AppTextProps) {
  const theme = useAppTheme();
  const colour = subtle ? theme.foregroundSubtle : muted ? theme.foregroundMuted : theme.foreground;

  return <Text {...props} style={[typography[variant], styles.text, { color: colour }, style]} />;
}

const styles = StyleSheet.create({
  text: {
    flexShrink: 1,
  },
});
