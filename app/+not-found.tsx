import { router } from 'expo-router';

import { Screen } from '@/src/components/layout/Screen';
import { EmptyState } from '@/src/components/ui/EmptyState';

export default function NotFoundScreen() {
  return (
    <Screen>
      <EmptyState icon="travel-explore" title="Seite nicht gefunden" description="Diese Ansicht existiert in LabPilot nicht." actionLabel="Zur Home-Ansicht" onAction={() => router.replace('/(tabs)')} />
    </Screen>
  );
}
