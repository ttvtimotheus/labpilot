import { describe, expect, it } from '@jest/globals';
import { fireEvent, render, screen } from '@testing-library/react-native';

import NormalwerteScreen from '@/app/(tabs)/wissen/referenzen/normalwerte';

describe('NormalwerteScreen', () => {
  it('searches across reference values and details', () => {
    render(<NormalwerteScreen />);

    fireEvent.changeText(screen.getByLabelText('Suche'), 'Base Excess');

    expect(screen.getByText('Base Excess (BE)')).toBeTruthy();
    expect(screen.getByText('-2 bis +3 mmol/l')).toBeTruthy();
  });

  it('combines category filters with search text', () => {
    render(<NormalwerteScreen />);

    fireEvent.press(screen.getByRole('button', { name: 'Hämatologie' }));
    fireEvent.changeText(screen.getByLabelText('Suche'), 'Base Excess');

    expect(screen.getByText('Keine Treffer')).toBeTruthy();

    fireEvent.press(screen.getByRole('button', { name: 'Säure-Basen-Status' }));

    expect(screen.getByText('Base Excess (BE)')).toBeTruthy();
  });
});