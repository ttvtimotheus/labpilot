import { router } from 'expo-router';
import { StyleSheet, View } from 'react-native';

import { Screen } from '@/src/components/layout/Screen';
import { Section } from '@/src/components/layout/Section';
import { AppText } from '@/src/components/ui/AppText';
import { ListRow } from '@/src/components/ui/ListRow';
import { useAuth } from '@/src/lib/auth/AuthProvider';
import { spacing, useAppTheme } from '@/src/lib/theme/tokens';

export default function SettingsScreen() {
  const theme = useAppTheme();
  const { isGuest } = useAuth();

  return (
    <Screen>
      <View style={styles.header}>
        <AppText variant="h1">Einstellungen</AppText>
        <AppText variant="callout" muted>{isGuest ? 'Offline-Profil' : 'Angemeldetes Profil'}</AppText>
      </View>
      <Section title="Konto">
        <ListRow icon="person" title="Account" subtitle="Login, Rolle und Sync-Status" onPress={() => router.push('/settings/account')} />
        <ListRow icon="workspace-premium" title="LabPilot Pro" subtitle="Abo, Restore und Entitlements" accentColor={theme.warning} onPress={() => router.push('/settings/subscription')} />
      </Section>
      <Section title="App">
        <ListRow icon="info" title="Ueber LabPilot" subtitle="Version, Datenschutz und Hinweise" onPress={() => router.push('/settings/about')} />
      </Section>
    </Screen>
  );
}

const styles = StyleSheet.create({
  header: {
    gap: spacing.sm,
  },
});
