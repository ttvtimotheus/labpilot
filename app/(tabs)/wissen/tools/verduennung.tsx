import { useMemo, useState } from 'react';
import { StyleSheet, View } from 'react-native';

import { Screen } from '@/src/components/layout/Screen';
import { AppText } from '@/src/components/ui/AppText';
import { Card } from '@/src/components/ui/Card';
import { NumericDisplay } from '@/src/components/ui/NumericDisplay';
import { TextField } from '@/src/components/ui/TextField';
import { calculateDilution, formatLabNumber, parsePositiveDecimal } from '@/src/features/wissen/calculations';
import { spacing } from '@/src/lib/theme/tokens';

export default function VerduennungScreen() {
  const [c1, setC1] = useState('10');
  const [c2, setC2] = useState('1');
  const [v2, setV2] = useState('1000');

  const stock = parsePositiveDecimal(c1);
  const target = parsePositiveDecimal(c2);
  const finalVolume = parsePositiveDecimal(v2);
  const impossibleDilution = stock !== null && target !== null && target > stock;
  const result = useMemo(() => {
    if (stock === null || target === null || finalVolume === null) return null;
    return calculateDilution(stock, target, finalVolume);
  }, [finalVolume, stock, target]);

  return (
    <Screen>
      <View style={styles.header}>
        <AppText variant="h1">Verduennung</AppText>
        <AppText variant="callout" muted>Berechnet V1 aus C1 x V1 = C2 x V2.</AppText>
      </View>
      <Card>
        <TextField label="Ausgangskonzentration C1" value={c1} onChangeText={setC1} keyboardType="decimal-pad" error={c1.trim() && stock === null ? 'Bitte eine positive Zahl eingeben.' : undefined} />
        <TextField label="Zielkonzentration C2" value={c2} onChangeText={setC2} keyboardType="decimal-pad" error={c2.trim() && target === null ? 'Bitte eine positive Zahl eingeben.' : impossibleDilution ? 'Die Zielkonzentration muss kleiner oder gleich C1 sein.' : undefined} />
        <TextField label="Endvolumen V2" value={v2} onChangeText={setV2} keyboardType="decimal-pad" error={v2.trim() && finalVolume === null ? 'Bitte eine positive Zahl eingeben.' : undefined} />
      </Card>
      <Card>
        <View style={styles.resultGrid}>
          <NumericDisplay value={result === null ? '--' : formatLabNumber(result.sampleVolume)} label="Probe / V1" size="md" />
          <NumericDisplay value={result === null ? '--' : formatLabNumber(result.diluentVolume)} label="Verduenner" size="md" />
        </View>
        <NumericDisplay value={result === null ? '--' : `1:${formatLabNumber(result.dilutionFactor, 1)}`} label="Verduennungsfaktor" size="sm" />
      </Card>
      <AppText variant="footnote" muted>Einheiten muessen innerhalb von C1/C2 und V1/V2 jeweils gleich sein.</AppText>
    </Screen>
  );
}

const styles = StyleSheet.create({
  header: {
    gap: spacing.sm,
  },
  resultGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
  },
});
