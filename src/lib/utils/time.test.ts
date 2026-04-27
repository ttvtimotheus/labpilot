import { describe, expect, it } from 'vitest';

import { formatDuration, secondsFromMinutes } from '@/src/lib/utils/time';

describe('time utilities', () => {
  it('formats seconds as mm:ss', () => {
    expect(formatDuration(65)).toBe('01:05');
    expect(formatDuration(0)).toBe('00:00');
  });

  it('converts minutes to seconds with a minimum of one second', () => {
    expect(secondsFromMinutes(2.5)).toBe(150);
    expect(secondsFromMinutes(0)).toBe(1);
  });
});
