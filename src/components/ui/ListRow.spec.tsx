import { fireEvent, render, screen } from '@testing-library/react-native';

import { ListRow } from '@/src/components/ui/ListRow';

describe('ListRow', () => {
  it('is operable when an onPress handler is present', () => {
    const onPress = jest.fn();
    render(<ListRow title="Kolonien" subtitle="Mibi-Zaehler" onPress={onPress} />);

    fireEvent.press(screen.getByRole('button', { name: 'Kolonien' }));

    expect(onPress).toHaveBeenCalledTimes(1);
  });

  it('does not expose static rows as buttons', () => {
    render(<ListRow title="Nur Anzeige" subtitle="Ohne Aktion" />);

    expect(screen.queryByRole('button', { name: 'Nur Anzeige' })).toBeNull();
    expect(screen.getByText('Nur Anzeige')).toBeTruthy();
  });
});