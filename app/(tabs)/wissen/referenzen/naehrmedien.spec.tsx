import { describe, expect, it } from '@jest/globals';
import { fireEvent, render, screen } from '@testing-library/react-native';

import NaehrmedienScreen from '@/app/(tabs)/wissen/referenzen/naehrmedien';

describe('NaehrmedienScreen', () => {
  it('searches across medium details', () => {
    render(<NaehrmedienScreen />);

    fireEvent.changeText(screen.getByLabelText('Suche'), 'Bull');

    expect(screen.getByText('Cefsulodin-Irgasan-Novobiocin-Agar (CIN / Yersinia-Selektivagar)')).toBeTruthy();
    expect(screen.getByText("Yersinia: kleine Kolonien mit rotem Zentrum und farblosem Rand ('Bull's Eye' / Stiernauge)")).toBeTruthy();
  });

  it('combines category filters with search text', () => {
    render(<NaehrmedienScreen />);

    fireEvent.press(screen.getByRole('button', { name: 'Anaerobier-Medien' }));
    fireEvent.changeText(screen.getByLabelText('Suche'), 'MacConkey');

    expect(screen.getByText('Keine Treffer')).toBeTruthy();

    fireEvent.press(screen.getByRole('button', { name: 'Selektiv- und Differentialmedien' }));

    expect(screen.getByText('MacConkey-Agar (MCA)')).toBeTruthy();
  });
});