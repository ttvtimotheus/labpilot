import { StyleSheet, TextInput, View, type TextInputProps } from 'react-native';

import { AppText } from '@/src/components/ui/AppText';
import { radius, spacing, typography, useAppTheme } from '@/src/lib/theme/tokens';

interface TextFieldProps extends TextInputProps {
  label: string;
  helpText?: string;
  error?: string;
}

export function TextField({ label, helpText, error, style, ...props }: TextFieldProps) {
  const theme = useAppTheme();

  return (
    <View style={styles.wrap}>
      <AppText variant="subhead">{label}</AppText>
      <TextInput
        accessibilityLabel={props.accessibilityLabel ?? label}
        accessibilityHint={error ?? props.accessibilityHint}
        placeholderTextColor={theme.foregroundSubtle}
        {...props}
        style={[
          styles.input,
          typography.body,
          {
            color: theme.foreground,
            borderColor: error ? theme.danger : theme.borderStrong,
            backgroundColor: theme.backgroundElev,
          },
          style,
        ]}
      />
      {error ? <AppText variant="footnote" style={{ color: theme.danger }}>{error}</AppText> : null}
      {!error && helpText ? <AppText variant="footnote" muted>{helpText}</AppText> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    gap: spacing.xs,
  },
  input: {
    minHeight: 48,
    borderWidth: 1,
    borderRadius: radius.md,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
  },
});
