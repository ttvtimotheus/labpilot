import { beforeEach, describe, expect, it, jest } from '@jest/globals';
import { fireEvent, render, screen, waitFor } from '@testing-library/react-native';

import DataSettingsScreen from '@/app/settings/data';
import { useProtokollRunStore } from '@/src/features/protokolle/store';
import { useTimerStore } from '@/src/features/timer/store';
import { useDifferentialStore } from '@/src/features/zaehler/differential.store';
import { useKolonieStore } from '@/src/features/zaehler/kolonien.store';
import { useAuth } from '@/src/lib/auth/AuthProvider';
import { clearOrMarkLocalRowsDeleted } from '@/src/lib/db/localPersistence';

jest.mock('@/src/lib/auth/AuthProvider', () => ({
  useAuth: jest.fn(() => ({ userId: 'user_1' })),
}));

jest.mock('@/src/lib/db/localPersistence', () => ({
  clearOrMarkLocalRowsDeleted: jest.fn(async () => ({ rows: [] })),
}));

const mockedUseAuth = jest.mocked(useAuth);
const mockedClearOrMarkLocalRowsDeleted = jest.mocked(clearOrMarkLocalRowsDeleted);

function resetStores() {
  useTimerStore.setState({ activeTimers: [], completedRuns: [] });
  useProtokollRunStore.setState({ completedRuns: [] });
  useKolonieStore.setState({ savedCounts: [] });
  useDifferentialStore.setState({ savedCounts: [] });
}

describe('DataSettingsScreen', () => {
  beforeEach(() => {
    resetStores();
    mockedUseAuth.mockReturnValue({ userId: 'user_1' } as ReturnType<typeof useAuth>);
    mockedClearOrMarkLocalRowsDeleted.mockClear();
  });

  it('keeps destructive actions disabled when there is no local history', () => {
    render(<DataSettingsScreen />);

    expect(screen.getByRole('button', { name: 'Timerverlauf loeschen' }).props.accessibilityState.disabled).toBe(true);
    expect(screen.getByRole('button', { name: 'Protokollverlauf loeschen' }).props.accessibilityState.disabled).toBe(true);
    expect(screen.getByRole('button', { name: 'Kolonienzaehlungen loeschen' }).props.accessibilityState.disabled).toBe(true);
    expect(screen.getByRole('button', { name: 'Differentialzaehlungen loeschen' }).props.accessibilityState.disabled).toBe(true);
  });

  it('clears timer history through the sync-aware delete helper', async () => {
    useTimerStore.setState({
      completedRuns: [
        {
          id: 'timer_run_1',
          templateId: 'template_1',
          name: 'Gram Timer',
          durationSeconds: 60,
          startedAt: '2026-04-28T08:00:00.000Z',
          completedAt: '2026-04-28T08:01:00.000Z',
          bereich: 'mibi',
          cancelled: false,
        },
      ],
    });

    render(<DataSettingsScreen />);
    fireEvent.press(screen.getByRole('button', { name: 'Timerverlauf loeschen' }));

    await waitFor(() => {
      expect(mockedClearOrMarkLocalRowsDeleted).toHaveBeenCalledWith('timer_runs', 'user_1');
    });

    expect(useTimerStore.getState().completedRuns).toEqual([]);
    expect(screen.getByText('Timerverlauf wurde entfernt.')).toBeTruthy();
  });
});