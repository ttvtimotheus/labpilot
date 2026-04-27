import { StyleSheet, View, Pressable } from 'react-native';

import { Screen } from '@/src/components/layout/Screen';
import { AppText } from '@/src/components/ui/AppText';
import { Button } from '@/src/components/ui/Button';
import { Card } from '@/src/components/ui/Card';
import { NumericDisplay } from '@/src/components/ui/NumericDisplay';
import { TextField } from '@/src/components/ui/TextField';
import { calculateCfu } from '@/src/features/zaehler/cfu';
import { useKolonieStore } from '@/src/features/zaehler/kolonien.store';
import { useHaptics } from '@/src/hooks/useHaptics';
import { spacing, useAppTheme } from '@/src/lib/theme/tokens';

export default function KolonienScreen() {
  const theme = useAppTheme();
  const haptics = useHaptics();
  const { categories, dilutionFactor, platedVolumeMl, increment, decrement, reset, setDilutionFactor, setPlatedVolumeMl } = useKolonieStore();
  const total = categories.reduce((sum, category) => sum + category.count, 0);
  const cfu = calculateCfu(total, dilutionFactor, platedVolumeMl);

  return (
    <Screen>
      <View style={styles.header}>
        <AppText variant="h1">Kolonien</AppText>
        <AppText variant="callout" muted>Kategorien antippen, Gesamtzahl und CFU/ml direkt kontrollieren.</AppText>
      </View>
      <View style={styles.metrics}>
        <NumericDisplay value={total} label="Kolonien" />
        <NumericDisplay value={new Intl.NumberFormat('de-DE').format(cfu)} label="CFU/ml" />
      </View>
      <Card>
        <View style={styles.inputGrid}>
          <TextField label="Verduennungsfaktor" value={String(dilutionFactor)} keyboardType="number-pad" onChangeText={(value) => setDilutionFactor(Number(value) || 1)} />
          <TextField label="Volumen ml" value={String(platedVolumeMl)} keyboardType="decimal-pad" onChangeText={(value) => setPlatedVolumeMl(Number(value.replace(',', '.')) || 0.1)} />
        </View>
      </Card>
      <View style={styles.categoryGrid}>
        {categories.map((category) => (
          <Pressable
            key={category.id}
            accessibilityRole="button"
            accessibilityLabel={`${category.label}: ${category.count}`}
            onPress={() => { increment(category.id); haptics.selection(); }}
            onLongPress={() => { decrement(category.id); haptics.warning(); }}
            style={({ pressed }) => [styles.category, { backgroundColor: theme.card, borderColor: pressed ? theme.focus : theme.border }]}>
            <View style={[styles.swatch, { backgroundColor: category.colour }]} />
            <AppText variant="bodyEmph">{category.label}</AppText>
            <AppText variant="display">{category.count}</AppText>
            <AppText variant="footnote" muted>Langdruck -1</AppText>
          </Pressable>
        ))}
      </View>
      <Button label="Zuruecksetzen" icon="restart-alt" variant="secondary" onPress={reset} />
    </Screen>
  );
}

const styles = StyleSheet.create({
  header: {
    gap: spacing.sm,
  },
  metrics: {
    flexDirection: 'row',
    gap: spacing.sm,
    flexWrap: 'wrap',
  },
  inputGrid: {
    gap: spacing.sm,
  },
  categoryGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
  },
  category: {
    width: '48%',
    minHeight: 154,
    borderWidth: 1,
    borderRadius: 16,
    padding: spacing.md,
    gap: spacing.xs,
  },
  swatch: {
    width: 28,
    height: 28,
    borderRadius: 14,
  },
});
