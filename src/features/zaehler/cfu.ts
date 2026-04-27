export function calculateCfu(total: number, dilutionFactor: number, platedVolumeMl: number) {
  if (platedVolumeMl <= 0) return 0;
  return Math.round((total * dilutionFactor) / platedVolumeMl);
}
