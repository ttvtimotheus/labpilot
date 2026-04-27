import { describe, expect, it } from 'vitest';

import { isAppLanguage, isThemePreference, resolveColorScheme } from '@/src/features/settings/preferences';

describe('preferences helpers', () => {
  it('validates stored preference values', () => {
    expect(isThemePreference('system')).toBe(true);
    expect(isThemePreference('sepia')).toBe(false);
    expect(isAppLanguage('de')).toBe(true);
    expect(isAppLanguage('fr')).toBe(false);
  });

  it('resolves theme preference against system scheme', () => {
    expect(resolveColorScheme('system', 'dark')).toBe('dark');
    expect(resolveColorScheme('system', null)).toBe('light');
    expect(resolveColorScheme('light', 'dark')).toBe('light');
  });
});