import { router } from 'expo-router';
import { useState } from 'react';
import { StyleSheet, View } from 'react-native';

import { Screen } from '@/src/components/layout/Screen';
import { AppText } from '@/src/components/ui/AppText';
import { Button } from '@/src/components/ui/Button';
import { Card } from '@/src/components/ui/Card';
import { TextField } from '@/src/components/ui/TextField';
import { useTimerStore } from '@/src/features/timer/store';
import { useAuth } from '@/src/lib/auth/AuthProvider';
import { areaLabels, spacing, useAppTheme } from '@/src/lib/theme/tokens';
import type { Bereich } from '@/src/types/domain';

const areas: Bereich[] = ['mibi', 'haema', 'chemie', 'histo', 'general'];

export default function NewTimerScreen() {
  const theme = useAppTheme();
  const { userId } = useAuth();
  const addTemplate = useTimerStore((state) => state.addTemplate);
  const startCustomTimer = useTimerStore((state) => state.startCustomTimer);
  const [name, setName] = useState('');
  const [minutes, setMinutes] = useState('5');
  const [bereich, setBereich] = useState<Bereich>('mibi');
  const [error, setError] = useState<string | null>(null);

  const durationSeconds = Math.round(Number(minutes.replace(',', '.')) * 60);

  async function save(startNow: boolean) {
    if (!name.trim()) {
      setError('Name ist erforderlich.');
      return;
    }
    if (!Number.isFinite(durationSeconds) || durationSeconds <= 0) {
      setError('Dauer muss groesser als 0 sein.');
      return;
    }

    addTemplate({ name: name.trim(), durationSeconds, bereich, userId });
    if (startNow) {
      await startCustomTimer({ name: name.trim(), durationSeconds, bereich });
    }
    router.back();
  }

  return (
    <Screen>
      <View style={styles.header}>
        <AppText variant="h1">Neuer Timer</AppText>
        <AppText variant="callout" muted>Speichere wiederkehrende Schritte als lokale Vorlage.</AppText>
      </View>
      <TextField label="Name" value={name} onChangeText={setName} placeholder="z. B. Lugol" error={error && !name.trim() ? error : undefined} />
      <TextField label="Dauer in Minuten" value={minutes} onChangeText={setMinutes} keyboardType="decimal-pad" helpText="Dezimalwerte wie 0,5 sind erlaubt." />
      <Card>
        <AppText variant="subhead">Bereich</AppText>
        <View style={styles.areaGrid}>
          {areas.map((area) => (
            <Button
              key={area}
              label={areaLabels[area]}
              variant={bereich === area ? 'primary' : 'secondary'}
              onPress={() => setBereich(area)}
              style={bereich === area ? { backgroundColor: theme.area[area], borderColor: theme.area[area] } : undefined}
            />
          ))}
        </View>
      </Card>
      {error ? <AppText style={{ color: theme.danger }}>{error}</AppText> : null}
      <View style={styles.actions}>
        <Button label="Speichern" icon="save" fullWidth onPress={() => save(false)} />
        <Button label="Speichern und starten" icon="play-arrow" variant="secondary" fullWidth onPress={() => save(true)} />
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  header: {
    gap: spacing.sm,
  },
  areaGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.xs,
  },
  actions: {
    gap: spacing.sm,
  },
});
