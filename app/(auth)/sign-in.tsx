import { router } from 'expo-router';
import { useTranslation } from 'react-i18next';
import { StyleSheet, View } from 'react-native';

import { Screen } from '@/src/components/layout/Screen';
import { AppText } from '@/src/components/ui/AppText';
import { Button } from '@/src/components/ui/Button';
import { Card } from '@/src/components/ui/Card';
import { useAuth } from '@/src/lib/auth/AuthProvider';
import { spacing, useAppTheme } from '@/src/lib/theme/tokens';

export default function SignInScreen() {
  const { t } = useTranslation();
  const { signInWithApple, signInWithGoogle, continueOffline, error } = useAuth();
  const theme = useAppTheme();

  return (
    <Screen>
      <View style={styles.header}>
        <AppText variant="h1">Anmelden</AppText>
        <AppText variant="callout" muted>
          Apple und Google laufen ueber Supabase Auth. Ohne konfigurierte Secrets bleibt der Offline-Modus verfuegbar.
        </AppText>
      </View>
      {error ? (
        <Card style={{ borderColor: theme.danger }}>
          <AppText variant="bodyEmph" style={{ color: theme.danger }}>Anmeldung nicht moeglich</AppText>
          <AppText muted>{error}</AppText>
        </Card>
      ) : null}
      <View style={styles.actions}>
        <Button label={t('auth.signInApple')} icon="apple" onPress={signInWithApple} fullWidth />
        <Button label={t('auth.signInGoogle')} icon="mail" variant="secondary" onPress={signInWithGoogle} fullWidth />
        <Button
          label={t('auth.continueOffline')}
          icon="offline-bolt"
          variant="ghost"
          onPress={() => {
            continueOffline();
            router.replace('/(tabs)');
          }}
          fullWidth
        />
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  header: {
    gap: spacing.sm,
    paddingTop: spacing.xxl,
  },
  actions: {
    gap: spacing.sm,
  },
});
