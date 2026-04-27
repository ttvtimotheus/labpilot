import { useMemo, useState } from 'react';
import { Pressable, ScrollView, StyleSheet, View } from 'react-native';

import { Screen } from '@/src/components/layout/Screen';
import { Section } from '@/src/components/layout/Section';
import { AppText } from '@/src/components/ui/AppText';
import { Card } from '@/src/components/ui/Card';
import { EmptyState } from '@/src/components/ui/EmptyState';
import { TextField } from '@/src/components/ui/TextField';
import {
  filterNormalwerte,
  normalwertCategoryIds,
  normalwertCategoryLabel,
  normalwerte,
  type NormalwertReference,
} from '@/src/features/wissen/references';
import { radius, spacing, useAppTheme } from '@/src/lib/theme/tokens';

const categoryIds = normalwertCategoryIds();

export default function NormalwerteScreen() {
  const [query, setQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const results = useMemo(() => filterNormalwerte({ query, category: selectedCategory }), [query, selectedCategory]);

  return (
    <Screen>
      <View style={styles.header}>
        <AppText variant="h1">Normalwerte</AppText>
        <AppText variant="callout" muted>Referenzbereiche nach Themen, Probe und Einheit fuer Ausbildung und Routinekontrolle.</AppText>
      </View>

      <View style={styles.filters}>
        <TextField
          label="Suche"
          value={query}
          onChangeText={setQuery}
          placeholder="Parameter, Probe, Einheit oder Hinweis"
          returnKeyType="search"
          autoCapitalize="none"
        />
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.categoryBar}>
          <CategoryChip label="Alle" selected={selectedCategory === 'all'} onPress={() => setSelectedCategory('all')} />
          {categoryIds.map((category) => (
            <CategoryChip
              key={category}
              label={normalwertCategoryLabel(category)}
              selected={selectedCategory === category}
              onPress={() => setSelectedCategory(category)}
            />
          ))}
        </ScrollView>
      </View>

      {normalwerte.length ? (
        results.length ? (
          <Section title={`${results.length} Treffer`}>
            {results.map((entry) => (
              <NormalwertCard key={entry.id} entry={entry} />
            ))}
          </Section>
        ) : (
          <EmptyState icon="search-off" title="Keine Treffer" description="Passe Suche oder Kategorie an." />
        )
      ) : (
        <EmptyState icon="fact-check" title="Keine Normalwerte" description="Der lokale Datensatz ist leer." />
      )}
      <AppText variant="footnote" muted>Referenzbereiche sind labor- und methodenabhaengig.</AppText>
    </Screen>
  );
}

function CategoryChip({ label, selected, onPress }: { label: string; selected: boolean; onPress: () => void }) {
  const theme = useAppTheme();

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityState={{ selected }}
      accessibilityLabel={label}
      onPress={onPress}
      style={({ pressed }) => [
        styles.categoryChip,
        {
          backgroundColor: selected ? theme.foreground : theme.backgroundElev,
          borderColor: selected ? theme.foreground : theme.borderStrong,
          opacity: pressed ? 0.78 : 1,
        },
      ]}>
      <AppText variant="footnote" style={{ color: selected ? theme.background : theme.foreground }}>{label}</AppText>
    </Pressable>
  );
}

function NormalwertCard({ entry }: { entry: NormalwertReference }) {
  return (
    <Card bereich={entry.bereich} style={styles.referenceCard}>
      <View style={styles.referenceHeader}>
        <View style={styles.referenceTitle}>
          <AppText variant="h3">{entry.label}</AppText>
          <AppText variant="footnote" muted>{normalwertCategoryLabel(entry.category)}</AppText>
        </View>
        <AppText variant="bodyEmph" style={styles.valueText}>{entry.value}</AppText>
      </View>
      <View style={styles.facts}>
        <FactLine label="SI" value={entry.si_value} />
        <FactLine label="Konventionell" value={entry.conventional_value} />
        <FactLine label="Probe" value={entry.specimen} />
        <FactLine label="Gruppe" value={entry.age_group} />
        <FactLine label="Geschlecht" value={entry.sex} />
      </View>
      {entry.note ? <AppText variant="footnote" muted>{entry.note}</AppText> : null}
    </Card>
  );
}

function FactLine({ label, value }: { label: string; value?: string }) {
  if (!value) return null;
  return (
    <View style={styles.factLine}>
      <AppText variant="caption" muted style={styles.factLabel}>{label}</AppText>
      <AppText variant="subhead">{value}</AppText>
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    gap: spacing.sm,
  },
  filters: {
    gap: spacing.sm,
  },
  categoryBar: {
    gap: spacing.sm,
    paddingRight: spacing.lg,
  },
  categoryChip: {
    minHeight: 40,
    justifyContent: 'center',
    borderWidth: 1,
    borderRadius: radius.full,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs,
  },
  referenceCard: {
    gap: spacing.md,
  },
  referenceHeader: {
    gap: spacing.sm,
  },
  referenceTitle: {
    gap: spacing.xxs,
  },
  valueText: {
    flexShrink: 1,
  },
  facts: {
    gap: spacing.xs,
  },
  factLine: {
    gap: spacing.xxs,
  },
  factLabel: {
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
});