import { useMemo, useState } from 'react';
import { StyleSheet, View } from 'react-native';

import { Screen } from '@/src/components/layout/Screen';
import { AppText } from '@/src/components/ui/AppText';
import { Button } from '@/src/components/ui/Button';
import { Card } from '@/src/components/ui/Card';
import { NumericDisplay } from '@/src/components/ui/NumericDisplay';
import { TextField } from '@/src/components/ui/TextField';
import { spacing } from '@/src/lib/theme/tokens';

const glucoseFactor = 18.0182;

export default function EinheitenScreen() {
  const [value, setValue] = useState('90');
  const [direction, setDirection] = useState<'mgdl-to-mmol' | 'mmol-to-mgdl'>('mgdl-to-mmol');

  const result = useMemo(() => {
    const numeric = Number(value.replace(',', '.'));
    if (!Number.isFinite(numeric)) return null;
    return direction === 'mgdl-to-mmol' ? numeric / glucoseFactor : numeric * glucoseFactor;
  }, [direction, value]);

  return (
    <Screen>
      <View style={styles.header}>
        <AppText variant="h1">Einheiten</AppText>
        <AppText variant="callout" muted>Schnelle Glukose-Umrechnung als MVP-Tool.</AppText>
      </View>
      <Card>
        <TextField label={direction === 'mgdl-to-mmol' ? 'mg/dl' : 'mmol/l'} value={value} onChangeText={setValue} keyboardType="decimal-pad" />
        <View style={styles.actions}>
          <Button label="mg/dl zu mmol/l" variant={direction === 'mgdl-to-mmol' ? 'primary' : 'secondary'} onPress={() => setDirection('mgdl-to-mmol')} />
          <Button label="mmol/l zu mg/dl" variant={direction === 'mmol-to-mgdl' ? 'primary' : 'secondary'} onPress={() => setDirection('mmol-to-mgdl')} />
        </View>
      </Card>
      <NumericDisplay
        value={result === null ? '--' : new Intl.NumberFormat('de-DE', { maximumFractionDigits: 2 }).format(result)}
        label={direction === 'mgdl-to-mmol' ? 'mmol/l' : 'mg/dl'}
        size="lg"
      />
    </Screen>
  );
}

const styles = StyleSheet.create({
  header: {
    gap: spacing.sm,
  },
  actions: {
    gap: spacing.sm,
  },
});
