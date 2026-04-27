import { sumCounts } from '@/src/lib/utils/collections';
import { createId } from '@/src/lib/utils/id';
import { calculateCfu } from '@/src/features/zaehler/cfu';
import type { DifferentialCell, DifferentialCountSnapshot, KolonieCategory, KolonieCountSnapshot } from '@/src/types/domain';

interface SnapshotOptions {
  id?: string;
  now?: Date;
}

export function createKolonieCountSnapshot(
  input: { name?: string; categories: KolonieCategory[]; dilutionFactor: number; platedVolumeMl: number },
  options: SnapshotOptions = {},
): KolonieCountSnapshot | null {
  const totalColonies = sumCounts(input.categories);
  if (!totalColonies) return null;

  return {
    id: options.id ?? createId('kolonie_count'),
    name: input.name?.trim() || undefined,
    categories: input.categories,
    dilutionFactor: input.dilutionFactor,
    platedVolumeMl: input.platedVolumeMl,
    totalColonies,
    totalCfu: calculateCfu(totalColonies, input.dilutionFactor, input.platedVolumeMl),
    createdAt: (options.now ?? new Date()).toISOString(),
  };
}

export function createDifferentialCountSnapshot(
  input: { name?: string; cells: DifferentialCell[]; target: number },
  options: SnapshotOptions = {},
): DifferentialCountSnapshot | null {
  const totalCells = sumCounts(input.cells);
  if (!totalCells) return null;

  return {
    id: options.id ?? createId('differential_count'),
    name: input.name?.trim() || undefined,
    cells: input.cells,
    totalCells,
    target: input.target,
    createdAt: (options.now ?? new Date()).toISOString(),
  };
}