import { useCallback, useEffect } from 'react';

import { useProtokollRunStore } from '@/src/features/protokolle/store';
import { useTimerStore } from '@/src/features/timer/store';
import { useDifferentialStore } from '@/src/features/zaehler/differential.store';
import { useKolonieStore } from '@/src/features/zaehler/kolonien.store';
import { capture } from '@/src/lib/analytics';
import { useAuth } from '@/src/lib/auth/AuthProvider';
import { loadLocalDifferentialCounts, loadLocalKolonieCounts, loadLocalProtokollRuns, loadLocalTimerData } from '@/src/lib/db/localPersistence';

interface HydrationOptions {
  auto?: boolean;
}

export function useLocalDataHydration(options: HydrationOptions = {}) {
  const { auto = true } = options;
  const { isReady, isSignedIn, userId } = useAuth();
  const hydrateTimerData = useTimerStore((state) => state.hydrateLocalData);
  const hydrateProtokollRuns = useProtokollRunStore((state) => state.hydrateLocalRuns);
  const hydrateKolonieCounts = useKolonieStore((state) => state.hydrateSavedCounts);
  const hydrateDifferentialCounts = useDifferentialStore((state) => state.hydrateSavedCounts);

  const hydrateLocalData = useCallback(
    async (targetUserId = userId) => {
      const [timerData, protokollRuns, kolonieCounts, differentialCounts] = await Promise.all([
        loadLocalTimerData(targetUserId),
        loadLocalProtokollRuns(targetUserId),
        loadLocalKolonieCounts(targetUserId),
        loadLocalDifferentialCounts(targetUserId),
      ]);

      hydrateTimerData(timerData);
      hydrateProtokollRuns(protokollRuns);
      hydrateKolonieCounts(kolonieCounts);
      hydrateDifferentialCounts(differentialCounts);

      capture('local_data_hydrated', {
        timer_templates: timerData.templates.length,
        timer_runs: timerData.completedRuns.length,
        protokoll_runs: protokollRuns.length,
        kolonie_counts: kolonieCounts.length,
        differential_counts: differentialCounts.length,
      });

      return { timerData, protokollRuns, kolonieCounts, differentialCounts };
    },
    [hydrateDifferentialCounts, hydrateKolonieCounts, hydrateProtokollRuns, hydrateTimerData, userId],
  );

  useEffect(() => {
    if (!auto || !isReady || !isSignedIn) return;
    void hydrateLocalData(userId).catch((error) => {
      capture('local_data_hydration_failed', { message: error instanceof Error ? error.message : 'Unbekannter Fehler' });
    });
  }, [auto, hydrateLocalData, isReady, isSignedIn, userId]);

  return hydrateLocalData;
}