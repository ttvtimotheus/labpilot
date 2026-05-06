import { router } from 'expo-router';

import { Screen } from '@/src/components/layout/Screen';
import { ScreenHeader } from '@/src/components/layout/ScreenHeader';
import { Section } from '@/src/components/layout/Section';
import { Button } from '@/src/components/ui/Button';
import { NoticeBanner } from '@/src/components/ui/NoticeBanner';
import { ResourceRow } from '@/src/components/ui/ResourceRow';
import { StatusChip } from '@/src/components/ui/StatusChip';
import { useEntitlements } from '@/src/hooks/useEntitlements';
import { useRevenueCat } from '@/src/hooks/useRevenueCat';

export default function SubscriptionScreen() {
  const { isPro } = useEntitlements();
  const revenueCat = useRevenueCat();

  return (
    <Screen>
      <ScreenHeader
        eyebrow="Zusatzfunktionen"
        title="LabPilot Pro"
        description={isPro ? 'Erweiterte Funktionen sind fuer dieses Profil freigeschaltet.' : 'Erweiterte Inhalte, Exporte und Zusatzfunktionen fuer die App.'}
        chips={
          <>
            <StatusChip label={isPro ? 'Pro aktiv' : 'Standard'} tone="warning" icon="workspace-premium" />
            <StatusChip label={revenueCat.isConfigured ? `${revenueCat.packages.length} Angebote` : 'Store inaktiv'} tone={revenueCat.isConfigured ? 'info' : 'neutral'} icon="payments" />
          </>
        }
      />

      <Section title="Enthalten" description="Der Premiumbereich erweitert Bibliothek, Export und spaetere Zusatzfunktionen.">
        <ResourceRow icon="menu-book" eyebrow="Wissensbibliothek" title="Erweiterte Inhalte" subtitle="Vertiefende Beitraege, zusaetzliche Referenzen und weitere Lerninhalte." />
        <ResourceRow icon="picture-as-pdf" eyebrow="Dokumentation" title="Exporte und Ausgabe" subtitle="Mehr strukturierte PDF-Ausgaben fuer Verlauf und Dokumentation." />
        <ResourceRow icon="sync" eyebrow="Zusatzfunktionen" title="Weitere Arbeitsoptionen" subtitle="Erweiterte Produktfunktionen fuer Abgleich, Team und spaetere Workflows." />
      </Section>

      {revenueCat.message || revenueCat.error ? (
        <NoticeBanner title={revenueCat.error ? 'Hinweis' : 'Status'} description={revenueCat.error ?? revenueCat.message ?? ''} tone={revenueCat.error ? 'danger' : 'success'} icon={revenueCat.error ? 'error-outline' : 'workspace-premium'} />
      ) : null}

      <NoticeBanner
        title={revenueCat.isConfigured ? 'Store verbunden' : 'Store derzeit nicht aktiv'}
        description={revenueCat.isConfigured ? `${revenueCat.packages.length} Paket(e) geladen${revenueCat.currentOfferingId ? ` · ${revenueCat.currentOfferingId}` : ''}` : 'In dieser Installation sind derzeit keine Kaufangebote sichtbar.'}
        tone={revenueCat.isConfigured ? 'info' : 'neutral'}
        icon="payments"
      />

      <Button label="Zusatzfunktionen ansehen" icon="workspace-premium" onPress={() => router.push('/modal/paywall')} />
      {revenueCat.isConfigured ? (
        <Button label={revenueCat.isRestoring ? 'Wiederherstellen...' : 'Kaeufe wiederherstellen'} icon="restore" variant="secondary" disabled={revenueCat.isWorking} onPress={() => void revenueCat.restore()} />
      ) : null}
    </Screen>
  );
}

