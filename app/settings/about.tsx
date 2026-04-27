import Constants from 'expo-constants';
import { StyleSheet, View } from 'react-native';

import { Screen } from '@/src/components/layout/Screen';
import { AppText } from '@/src/components/ui/AppText';
import { Card } from '@/src/components/ui/Card';
import { spacing } from '@/src/lib/theme/tokens';

export default function AboutScreen() {
  return (
    <Screen>
      <View style={styles.header}>
        <AppText variant="h1">Ueber LabPilot</AppText>
        <AppText variant="callout" muted>Version {Constants.expoConfig?.version ?? '1.0.0'}</AppText>
      </View>
      <Card>
        <AppText variant="bodyEmph">Hinweis</AppText>
        <AppText muted>LabPilot ist kein Medizinprodukt und nicht fuer Echtbefunde oder Therapieentscheidungen bestimmt.</AppText>
      </Card>
      <Card>
        <AppText variant="bodyEmph">Datenschutz</AppText>
        <AppText muted>Patienten-IDs sind als lokale Freitextfelder gedacht. Keine direkt identifizierenden Patientendaten eintragen.</AppText>
      </Card>
    </Screen>
  );
}

const styles = StyleSheet.create({
  header: {
    gap: spacing.sm,
  },
});
