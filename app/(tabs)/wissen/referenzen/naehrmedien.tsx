import { useMemo, useState } from 'react';
import { Pressable, ScrollView, StyleSheet, View } from 'react-native';

import { Screen } from '@/src/components/layout/Screen';
import { Section } from '@/src/components/layout/Section';
import { AppText } from '@/src/components/ui/AppText';
import { Card } from '@/src/components/ui/Card';
import { EmptyState } from '@/src/components/ui/EmptyState';
import { TextField } from '@/src/components/ui/TextField';
import {
  filterNaehrmedien,
  naehrmedien,
  naehrmediumCategoryIds,
  naehrmediumCategoryLabel,
  type NaehrmediumReference,
} from '@/src/features/wissen/references';
import { radius, spacing, useAppTheme } from '@/src/lib/theme/tokens';

const categoryIds = naehrmediumCategoryIds();

export default function NaehrmedienScreen() {
  const [query, setQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const results = useMemo(() => filterNaehrmedien({ query, category: selectedCategory, bereich: 'mibi' }), [query, selectedCategory]);

  return (
    <Screen>
      <View style={styles.header}>
        <AppText variant="h1">Naehrmedien</AppText>
        <AppText variant="callout" muted>Selektivitaet, Indikatoren, Inkubation und typische Reaktionen fuer die Mibi-Routine.</AppText>
      </View>

      <View style={styles.filters}>
        <TextField
          label="Suche"
          value={query}
          onChangeText={setQuery}
          placeholder="Medium, Keim, Reaktion oder Einsatz"
          returnKeyType="search"
          autoCapitalize="none"
        />
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.categoryBar}>
          <CategoryChip label="Alle" selected={selectedCategory === 'all'} onPress={() => setSelectedCategory('all')} />
          {categoryIds.map((category) => (
            <CategoryChip
              key={category}
              label={naehrmediumCategoryLabel(category)}
              selected={selectedCategory === category}
              onPress={() => setSelectedCategory(category)}
            />
          ))}
        </ScrollView>
      </View>

      {naehrmedien.length ? (
        results.length ? (
          <Section title={`${results.length} Treffer`}>
            {results.map((entry) => (
              <NaehrmediumCard key={entry.id} entry={entry} />
            ))}
          </Section>
        ) : (
          <EmptyState icon="search-off" title="Keine Treffer" description="Passe Suche oder Kategorie an." />
        )
      ) : (
        <EmptyState icon="biotech" title="Keine Naehrmedien" description="Der lokale Datensatz ist leer." />
      )}
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

function NaehrmediumCard({ entry }: { entry: NaehrmediumReference }) {
  return (
    <Card bereich={entry.bereich} style={styles.mediumCard}>
      <View style={styles.mediumHeader}>
        <View style={styles.mediumTitle}>
          <AppText variant="h3">{entry.name}</AppText>
          <AppText variant="footnote" muted>{naehrmediumCategoryLabel(entry.category)}</AppText>
        </View>
      </View>
      <AppText>{entry.use}</AppText>
      <View style={styles.facts}>
        <FactLine label="Selektivitaet" value={entry.selectivity} />
        <FactLine label="Indikator" value={entry.indicator} />
        <FactLine label="Inkubation" value={entry.incubation} />
        <FactLine label="Farbe" value={entry.color} />
      </View>
      <BulletBlock title="Schluesselreaktionen" values={entry.key_reactions} />
      <BulletBlock title="Wachstum" values={entry.wachstum} />
      <BulletBlock title="Gehemmt oder schwach" values={entry.kein_wachstum_oder_schwach} />
      {entry.tipps ? <AppText variant="footnote" muted>{entry.tipps}</AppText> : null}
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

function BulletBlock({ title, values }: { title: string; values?: string[] }) {
  if (!values?.length) return null;
  return (
    <View style={styles.bulletBlock}>
      <AppText variant="caption" muted style={styles.factLabel}>{title}</AppText>
      {values.map((value) => (
        <View key={value} style={styles.bulletRow}>
          <AppText variant="subhead" muted>•</AppText>
          <AppText variant="subhead">{value}</AppText>
        </View>
      ))}
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
  mediumCard: {
    gap: spacing.md,
  },
  mediumHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    gap: spacing.md,
  },
  mediumTitle: {
    flex: 1,
    minWidth: 0,
    gap: spacing.xxs,
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
  bulletBlock: {
    gap: spacing.xs,
  },
  bulletRow: {
    flexDirection: 'row',
    gap: spacing.xs,
    alignItems: 'flex-start',
  },
});