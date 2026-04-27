import { describe, expect, it } from 'vitest';

import { calculateCfu } from '@/src/features/zaehler/cfu';

describe('calculateCfu', () => {
  it('calculates cfu per ml from colony count, dilution factor and plated volume', () => {
    expect(calculateCfu(42, 1000, 0.1)).toBe(420000);
  });

  it('guards against invalid plated volume', () => {
    expect(calculateCfu(42, 1000, 0)).toBe(0);
  });
});
