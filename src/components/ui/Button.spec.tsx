import { fireEvent, render, screen } from '@testing-library/react-native';

import { Button } from '@/src/components/ui/Button';

describe('Button', () => {
  it('renders the visible label as the accessible button name', () => {
    const onPress = jest.fn();
    render(<Button label="Speichern" onPress={onPress} />);

    fireEvent.press(screen.getByRole('button', { name: 'Speichern' }));

    expect(onPress).toHaveBeenCalledTimes(1);
  });

  it('exposes disabled state and does not fire presses', () => {
    const onPress = jest.fn();
    render(<Button label="Speichern" disabled onPress={onPress} />);

    const button = screen.getByRole('button', { name: 'Speichern' });
    fireEvent.press(button);

    expect(button.props.accessibilityState.disabled).toBe(true);
    expect(onPress).not.toHaveBeenCalled();
  });
});