import { useMemo, useState } from 'react';
import { StyleSheet, View } from 'react-native';

import { Screen } from '@/src/components/layout/Screen';
import { AppText } from '@/src/components/ui/AppText';
import { Card } from '@/src/components/ui/Card';
import { NumericDisplay } from '@/src/components/ui/NumericDisplay';
import { TextField } from '@/src/components/ui/TextField';
import { spacing } from '@/src/lib/theme/tokens';

function toNumber(value: string) {
  return Number(value.replace(',', '.'));
}

export default function VerduennungScreen() {
  const [c1, setC1] = useState('10');
  const [c2, setC2] = useState('1');
  const [v2, setV2] = useState('1000');

  const result = useMemo(() => {
    const stock = toNumber(c1);
    const target = toNumber(c2);
    const finalVolume = toNumber(v2);
    if (!stock || !target || !finalVolume) return null;
    return (target * finalVolume) / stock;
  }, [c1, c2, v2]);

  return (
    <Screen>
      <View style={styles.header}>
        <AppText variant="h1">Verduennung</AppText>
        <AppText variant="callout" muted>Berechnet V1 aus C1 x V1 = C2 x V2.</AppText>
      </View>
      <Card>
        <TextField label="Ausgangskonzentration C1" value={c1} onChangeText={setC1} keyboardType="decimal-pad" />
        <TextField label="Zielkonzentration C2" value={c2} onChangeText={setC2} keyboardType="decimal-pad" />
        <TextField label="Endvolumen V2" value={v2} onChangeText={setV2} keyboardType="decimal-pad" />
      </Card>
      <NumericDisplay value={result === null ? '--' : new Intl.NumberFormat('de-DE', { maximumFractionDigits: 2 }).format(result)} label="V1 einsetzen" size="lg" />
      <AppText variant="footnote" muted>Einheiten muessen innerhalb von C1/C2 und V1/V2 jeweils gleich sein.</AppText>
    </Screen>
  );
}

const styles = StyleSheet.create({
  header: {
    gap: spacing.sm,
  },
});
