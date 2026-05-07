import { router } from 'expo-router';
import { StyleSheet, View } from 'react-native';

import { Screen } from '@/src/components/layout/Screen';
import { ScreenHeader } from '@/src/components/layout/ScreenHeader';
import { Section } from '@/src/components/layout/Section';
import { ActionTile } from '@/src/components/ui/ActionTile';
import { ResourceRow } from '@/src/components/ui/ResourceRow';
import { StatusChip } from '@/src/components/ui/StatusChip';
import { knowledgeTopics, wissenBereiche } from '@/src/features/wissen/data';
import { naehrmedien, normalwerte } from '@/src/features/wissen/references';
import { areaLabels, areaSymbols, spacing, useAppTheme } from '@/src/lib/theme/tokens';

export default function WissenScreen() {
  const theme = useAppTheme();

  return (
    <Screen>
      <ScreenHeader
        eyebrow="Bibliothek"
        title="Wissen"
        description="Fachbereiche, Referenzdaten und Arbeitsrechner in einer ruhigen Laborbibliothek statt in einer Werkzeugwand."
        chips={
          <>
            <StatusChip label={`${knowledgeTopics.length} Themen`} tone="info" icon="article" />
            <StatusChip label={`${normalwerte.length + naehrmedien.length} Referenzen`} tone="neutral" icon="fact-check" />
          </>
        }
      />

      <Section title="Fachbereiche" description="Jeder Bereich oeffnet eine eigene kleine Bibliothek mit Beitraegen und Orientierung.">
        <View style={styles.actionGrid}>
          {wissenBereiche.map((bereich) => (
            <ActionTile
              key={bereich}
              style={styles.actionTile}
              icon={areaSymbols[bereich] as never}
              title={areaLabels[bereich]}
              subtitle="Kompakte Beitraege und fachliche Orientierung"
              accentColor={theme.area[bereich]}
              actionLabel="Oeffnen"
              onPress={() => router.push(`/(tabs)/wissen/${bereich}`)}
            />
          ))}
        </View>
      </Section>

      <Section title="Referenzbibliothek" description="Integrierte Datensaetze fuer Nachschlagen, Unterricht und Routineentscheidungen.">
        <ResourceRow
          icon="fact-check"
          eyebrow="Klinische Chemie und Haematologie"
          title="Normalwerte"
          subtitle={`${normalwerte.length} Eintraege mit Parametern, Einheiten und Hinweisen`}
          accentColor={theme.area.chemie}
          actionLabel="Oeffnen"
          onPress={() => router.push('/(tabs)/wissen/referenzen/normalwerte')}
        />
        <ResourceRow
          icon="biotech"
          eyebrow="Mikrobiologie"
          title="Naehrmedien"
          subtitle={`${naehrmedien.length} Medien mit Einsatz, Reaktionen und Wachstumshinweisen`}
          accentColor={theme.area.mibi}
          actionLabel="Oeffnen"
          onPress={() => router.push('/(tabs)/wissen/referenzen/naehrmedien')}
        />
      </Section>

      <Section title="Arbeitsrechner" description="Zwei schnelle Helfer fuer wiederkehrende Umrechnungen und Ansätze.">
        <View style={styles.actionGrid}>
          <ActionTile
            style={styles.actionTile}
            icon="water-drop"
            title="Verduennungsrechner"
            subtitle="C1 x V1 = C2 x V2 fuer einfache und serielle Ansaetze"
            accentColor={theme.area.chemie}
            actionLabel="Rechnen"
            onPress={() => router.push('/(tabs)/wissen/tools/verduennung')}
          />
          <ActionTile
            style={styles.actionTile}
            icon="swap-horiz"
            title="Einheiten-Konverter"
            subtitle="mg/dl, mmol/l und typische Laborumrechnungen"
            accentColor={theme.area.general}
            actionLabel="Umrechnen"
            onPress={() => router.push('/(tabs)/wissen/tools/einheiten')}
          />
        </View>
      </Section>

      <Section title="Training" description="Kurzes Wiederholen auf Basis der integrierten Referenzbibliothek.">
        <ResourceRow
          icon="quiz"
          eyebrow="Lernen"
          title="Lernkarten"
          subtitle="Kurzes Training aus Normalwerten und Naehrmedien"
          accentColor={theme.area.learn}
          actionLabel="Ueben"
          onPress={() => router.push('/(tabs)/wissen/lernen')}
        />
      </Section>
    </Screen>
  );
}

const styles = StyleSheet.create({
  actionGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
  },
  actionTile: {
    flexBasis: '48%',
  },
});
