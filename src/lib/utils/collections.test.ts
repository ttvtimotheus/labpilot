import { describe, expect, it } from 'vitest';

import { decrementCountById, incrementCountById, mergeById, prependLimited, sumCounts } from '@/src/lib/utils/collections';

describe('collection helpers', () => {
  it('prepends items and caps history length', () => {
    expect(prependLimited('new', ['a', 'b', 'c'], 3)).toEqual(['new', 'a', 'b']);
  });

  it('increments and decrements matching count items only', () => {
    const items = [{ id: 'a', count: 1 }, { id: 'b', count: 0 }];
    expect(incrementCountById(items, 'a')).toEqual([{ id: 'a', count: 2 }, { id: 'b', count: 0 }]);
    expect(decrementCountById(items, 'b')).toEqual(items);
  });

  it('sums counts', () => {
    expect(sumCounts([{ count: 3 }, { count: 7 }])).toBe(10);
  });

  it('merges records by id with primary items winning', () => {
    expect(
      mergeById(
        [{ id: 'a', value: 'remote' }, { id: 'b', value: 'new' }],
        [{ id: 'a', value: 'local' }, { id: 'c', value: 'old' }],
        3,
      ),
    ).toEqual([{ id: 'a', value: 'remote' }, { id: 'b', value: 'new' }, { id: 'c', value: 'old' }]);
  });
});