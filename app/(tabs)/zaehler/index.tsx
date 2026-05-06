import { router } from 'expo-router';

import { Screen } from '@/src/components/layout/Screen';
import { ScreenHeader } from '@/src/components/layout/ScreenHeader';
import { Section } from '@/src/components/layout/Section';
import { ResourceRow } from '@/src/components/ui/ResourceRow';
import { StatusChip } from '@/src/components/ui/StatusChip';
import { useDifferentialStore } from '@/src/features/zaehler/differential.store';
import { useKolonieStore } from '@/src/features/zaehler/kolonien.store';
import { useAppTheme } from '@/src/lib/theme/tokens';

export default function ZaehlerScreen() {
  const theme = useAppTheme();
  const lastKolonie = useKolonieStore((state) => state.savedCounts[0]);
  const lastDifferential = useDifferentialStore((state) => state.savedCounts[0]);

  return (
    <Screen>
      <ScreenHeader
        eyebrow="Arbeitsrechner"
        title="Zaehler"
        description="Haptische Zaehler fuer Kolonien und Differentialblutbild mit lokaler Ergebnissicherung."
        chips={
          <>
            <StatusChip label="Kolonien" tone="info" icon="science" />
            <StatusChip label="Diff-BB" tone="danger" icon="bloodtype" />
          </>
        }
      />

      <Section title="Laborzaehler" description="Zwei schnelle Erfassungsmodi fuer wiederkehrende Zaehlarbeit.">
        <ResourceRow
          icon="science"
          eyebrow="Mikrobiologie"
          title="Mibi-Kolonienzaehler"
          subtitle="Kategorien, Gesamtzahl und CFU/ml Berechnung."
          accentColor={theme.area.mibi}
          onPress={() => router.push('/(tabs)/zaehler/kolonien')}
        />
        <ResourceRow
          icon="bloodtype"
          eyebrow="Haematologie"
          title="Differentialblutbild"
          subtitle="100-Zellen-Tracking mit Prozentanzeige."
          accentColor={theme.area.haema}
          onPress={() => router.push('/(tabs)/zaehler/differential')}
        />
      </Section>
      {(lastKolonie || lastDifferential) ? (
        <Section title="Letzte lokale Ergebnisse">
          {lastKolonie ? (
            <ResourceRow
              icon="science"
              eyebrow="Kolonienzaehlung"
              title={lastKolonie.name ?? 'Kolonienzaehlung'}
              subtitle={`${lastKolonie.totalColonies} Kolonien · ${new Intl.NumberFormat('de-DE').format(lastKolonie.totalCfu)} CFU/ml`}
              accentColor={theme.area.mibi}
              onPress={() => router.push('/(tabs)/zaehler/kolonien')}
            />
          ) : null}
          {lastDifferential ? (
            <ResourceRow
              icon="bloodtype"
              eyebrow="Differentialblutbild"
              title={lastDifferential.name ?? 'Differentialzaehlung'}
              subtitle={`${lastDifferential.totalCells}/${lastDifferential.target} Zellen gespeichert`}
              accentColor={theme.area.haema}
              onPress={() => router.push('/(tabs)/zaehler/differential')}
            />
          ) : null}
        </Section>
      ) : null}
    </Screen>
  );
}
