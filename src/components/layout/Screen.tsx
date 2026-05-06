import { Platform, ScrollView, StyleSheet, View, type ViewProps } from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';

import { spacing, useAppTheme } from '@/src/lib/theme/tokens';

interface ScreenProps extends ViewProps {
  scroll?: boolean;
  padded?: boolean;
}

export function Screen({ scroll = true, padded = true, style, children, ...props }: ScreenProps) {
  const theme = useAppTheme();
  const insets = useSafeAreaInsets();
  const tabBarReserve = Platform.OS === 'ios' ? 116 : 84;
  const contentStyle = [styles.content, { paddingBottom: spacing.xxl + tabBarReserve + insets.bottom }, padded && styles.padded, style];

  return (
    <SafeAreaView style={[styles.root, { backgroundColor: theme.background }]} edges={['top', 'left', 'right']}>
      {scroll ? (
        <ScrollView
          {...props}
          keyboardShouldPersistTaps="handled"
          contentInsetAdjustmentBehavior="automatic"
          showsVerticalScrollIndicator={false}
          style={styles.scroll}
          contentContainerStyle={contentStyle}>
          {children}
        </ScrollView>
      ) : (
        <View {...props} style={contentStyle}>
          {children}
        </View>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
  },
  scroll: {
    flex: 1,
  },
  content: {
    gap: spacing.xl,
  },
  padded: {
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.lg,
  },
});
