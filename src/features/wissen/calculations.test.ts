import { describe, expect, it } from 'vitest';

import { calculateDilution, convertLabUnit, labUnitConversions, parseDecimal, parsePositiveDecimal } from '@/src/features/wissen/calculations';

describe('wissen calculations', () => {
  it('parses German decimal input', () => {
    expect(parseDecimal('12,5')).toBe(12.5);
    expect(parsePositiveDecimal('0')).toBeNull();
    expect(parsePositiveDecimal('abc')).toBeNull();
  });

  it('calculates dilution volume and diluent', () => {
    expect(calculateDilution(10, 1, 1000)).toEqual({
      sampleVolume: 100,
      diluentVolume: 900,
      dilutionFactor: 10,
    });
    expect(calculateDilution(1, 10, 1000)).toBeNull();
  });

  it('converts common lab units both ways', () => {
    const glucose = labUnitConversions.find((conversion) => conversion.id === 'glucose');
    expect(glucose).toBeDefined();
    expect(convertLabUnit(glucose!, 90, 'to-target')).toBeCloseTo(4.99, 2);
    expect(convertLabUnit(glucose!, 5, 'to-source')).toBeCloseTo(90.09, 2);
  });
});