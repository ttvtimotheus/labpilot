import { Image } from 'expo-image';
import { router } from 'expo-router';
import { useTranslation } from 'react-i18next';
import { StyleSheet, View } from 'react-native';

import { Screen } from '@/src/components/layout/Screen';
import { AppText } from '@/src/components/ui/AppText';
import { Button } from '@/src/components/ui/Button';
import { Card } from '@/src/components/ui/Card';
import { useAuth } from '@/src/lib/auth/AuthProvider';
import { spacing, useAppTheme } from '@/src/lib/theme/tokens';

export default function WelcomeScreen() {
  const { t } = useTranslation();
  const { continueOffline } = useAuth();
  const theme = useAppTheme();

  return (
    <Screen>
      <View style={styles.hero}>
        <View style={[styles.iconWrap, { backgroundColor: theme.backgroundSunk }]}> 
          <Image source={require('@/assets/images/icon.png')} style={styles.icon} contentFit="contain" />
        </View>
        <AppText variant="display">{t('auth.welcomeTitle')}</AppText>
        <AppText variant="callout" muted>{t('auth.welcomeSubtitle')}</AppText>
      </View>
      <Card elevated>
        <AppText variant="h3">Offline-first</AppText>
        <AppText muted>
          Timer, Zaehler und Referenzen funktionieren sofort. Sync und Pro-Features lassen sich nach der Backend-Konfiguration aktivieren.
        </AppText>
      </Card>
      <View style={styles.actions}>
        <Button
          label={t('auth.continueOffline')}
          icon="offline-bolt"
          fullWidth
          onPress={() => {
            continueOffline();
            router.replace('/(tabs)');
          }}
        />
        <Button label="Login einrichten" icon="login" variant="secondary" fullWidth onPress={() => router.push('/(auth)/sign-in')} />
      </View>
      <AppText variant="footnote" muted>{t('auth.offlineNote')}</AppText>
    </Screen>
  );
}

const styles = StyleSheet.create({
  hero: {
    gap: spacing.sm,
    paddingTop: spacing.xxl,
  },
  iconWrap: {
    width: 84,
    height: 84,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.sm,
  },
  icon: {
    width: 58,
    height: 58,
  },
  actions: {
    gap: spacing.sm,
  },
});
