import { router } from 'expo-router';
import { useTranslation } from 'react-i18next';
import { StyleSheet, View } from 'react-native';

import { Screen } from '@/src/components/layout/Screen';
import { ScreenHeader } from '@/src/components/layout/ScreenHeader';
import { Button } from '@/src/components/ui/Button';
import { NoticeBanner } from '@/src/components/ui/NoticeBanner';
import { StatusChip } from '@/src/components/ui/StatusChip';
import { useAuth } from '@/src/lib/auth/AuthProvider';
import { isGoogleSignInConfigured } from '@/src/lib/auth/google';
import { spacing } from '@/src/lib/theme/tokens';

export default function SignInScreen() {
  const { t } = useTranslation();
  const { signInWithApple, signInWithGoogle, continueOffline, error } = useAuth();
  const googleSignInConfigured = isGoogleSignInConfigured();

  return (
    <Screen>
      <ScreenHeader
        eyebrow="Zugang"
        title="Anmelden"
        description="Melde dich an oder arbeite direkt lokal weiter. Die Kernfunktionen der App bleiben auch ohne Konto verfuegbar."
        chips={<StatusChip label="Lokales Arbeiten moeglich" tone="warning" icon="offline-bolt" />}
      />
      {error ? (
        <NoticeBanner title="Anmeldung nicht moeglich" description={error} tone="danger" icon="error-outline" />
      ) : null}
      <View style={styles.actions}>
        <Button label={t('auth.signInApple')} icon="apple" onPress={signInWithApple} fullWidth />
        <Button
          label={t('auth.signInGoogle')}
          icon="mail"
          variant="secondary"
          onPress={signInWithGoogle}
          disabled={!googleSignInConfigured}
          fullWidth
        />
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
      {!googleSignInConfigured ? (
        <NoticeBanner title="Google-Anmeldung derzeit nicht verfuegbar" description="Auf diesem Geraet kannst du vorerst mit Apple oder direkt lokal weiterarbeiten." icon="mail" />
      ) : null}
    </Screen>
  );
}

const styles = StyleSheet.create({
  actions: {
    gap: spacing.sm,
  },
});
