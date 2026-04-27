export function prependLimited<T>(item: T, items: T[], limit = 100) {
  return [item, ...items].slice(0, limit);
}

export function incrementCountById<T extends { id: string; count: number }>(items: T[], id: string) {
  return items.map((item) => (item.id === id ? { ...item, count: item.count + 1 } : item));
}

export function decrementCountById<T extends { id: string; count: number }>(items: T[], id: string) {
  return items.map((item) => (item.id === id ? { ...item, count: Math.max(0, item.count - 1) } : item));
}

export function sumCounts(items: { count: number }[]) {
  return items.reduce((sum, item) => sum + item.count, 0);
}

export function mergeById<T extends { id: string }>(primary: T[], fallback: T[], limit = 100) {
  const seen = new Set<string>();
  const merged: T[] = [];

  for (const item of [...primary, ...fallback]) {
    if (seen.has(item.id)) continue;
    seen.add(item.id);
    merged.push(item);
    if (merged.length >= limit) break;
  }

  return merged;
}