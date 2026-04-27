import { useMemo, useState } from 'react';
import { StyleSheet, View } from 'react-native';

import { Screen } from '@/src/components/layout/Screen';
import { AppText } from '@/src/components/ui/AppText';
import { Button } from '@/src/components/ui/Button';
import { Card } from '@/src/components/ui/Card';
import { NumericDisplay } from '@/src/components/ui/NumericDisplay';
import { TextField } from '@/src/components/ui/TextField';
import {
  convertLabUnit,
  formatLabNumber,
  labUnitConversions,
  parsePositiveDecimal,
  type UnitConversionDirection,
} from '@/src/features/wissen/calculations';
import { spacing } from '@/src/lib/theme/tokens';

export default function EinheitenScreen() {
  const [value, setValue] = useState('90');
  const [conversionId, setConversionId] = useState(labUnitConversions[0].id);
  const [direction, setDirection] = useState<UnitConversionDirection>('to-target');
  const conversion = labUnitConversions.find((candidate) => candidate.id === conversionId) ?? labUnitConversions[0];
  const numericValue = parsePositiveDecimal(value);

  const result = useMemo(() => {
    if (numericValue === null) return null;
    return convertLabUnit(conversion, numericValue, direction);
  }, [conversion, direction, numericValue]);

  const inputUnit = direction === 'to-target' ? conversion.sourceUnit : conversion.targetUnit;
  const outputUnit = direction === 'to-target' ? conversion.targetUnit : conversion.sourceUnit;

  return (
    <Screen>
      <View style={styles.header}>
        <AppText variant="h1">Einheiten</AppText>
        <AppText variant="callout" muted>Haeufige Laborwerte zwischen konventionellen und SI-Einheiten umrechnen.</AppText>
      </View>
      <Card>
        <AppText variant="subhead">Parameter</AppText>
        <View style={styles.buttonGrid}>
          {labUnitConversions.map((candidate) => (
            <Button
              key={candidate.id}
              label={candidate.label}
              variant={candidate.id === conversion.id ? 'primary' : 'secondary'}
              onPress={() => setConversionId(candidate.id)}
            />
          ))}
        </View>
      </Card>
      <Card>
        <TextField
          label={`Wert in ${inputUnit}`}
          value={value}
          onChangeText={setValue}
          keyboardType="decimal-pad"
          error={value.trim() && numericValue === null ? 'Bitte eine positive Zahl eingeben.' : undefined}
        />
        <View style={styles.buttonGrid}>
          <Button label={`${conversion.sourceUnit} zu ${conversion.targetUnit}`} variant={direction === 'to-target' ? 'primary' : 'secondary'} onPress={() => setDirection('to-target')} />
          <Button label={`${conversion.targetUnit} zu ${conversion.sourceUnit}`} variant={direction === 'to-source' ? 'primary' : 'secondary'} onPress={() => setDirection('to-source')} />
        </View>
      </Card>
      <NumericDisplay
        value={result === null ? '--' : formatLabNumber(result)}
        label={outputUnit}
        size="lg"
      />
      <AppText variant="footnote" muted>Referenzbereiche sind methoden- und laborabhaengig; die Umrechnung ersetzt keine Befundbewertung.</AppText>
    </Screen>
  );
}

const styles = StyleSheet.create({
  header: {
    gap: spacing.sm,
  },
  buttonGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
  },
});
