export type UnitConversionDirection = 'to-target' | 'to-source';

export interface LabUnitConversion {
  id: string;
  label: string;
  sourceUnit: string;
  targetUnit: string;
  sourceToTarget: (value: number) => number;
  targetToSource: (value: number) => number;
}

export interface DilutionResult {
  sampleVolume: number;
  diluentVolume: number;
  dilutionFactor: number;
}

export const labUnitConversions: LabUnitConversion[] = [
  {
    id: 'glucose',
    label: 'Glukose',
    sourceUnit: 'mg/dl',
    targetUnit: 'mmol/l',
    sourceToTarget: (value) => value / 18.0182,
    targetToSource: (value) => value * 18.0182,
  },
  {
    id: 'cholesterol',
    label: 'Cholesterin',
    sourceUnit: 'mg/dl',
    targetUnit: 'mmol/l',
    sourceToTarget: (value) => value / 38.67,
    targetToSource: (value) => value * 38.67,
  },
  {
    id: 'creatinine',
    label: 'Kreatinin',
    sourceUnit: 'mg/dl',
    targetUnit: 'umol/l',
    sourceToTarget: (value) => value * 88.4,
    targetToSource: (value) => value / 88.4,
  },
  {
    id: 'haemoglobin',
    label: 'Haemoglobin',
    sourceUnit: 'g/dl',
    targetUnit: 'mmol/l',
    sourceToTarget: (value) => value * 0.6206,
    targetToSource: (value) => value / 0.6206,
  },
];

export function parseDecimal(value: string) {
  const normalised = value.trim().replace(',', '.');
  if (!normalised) return null;
  const numericValue = Number(normalised);
  return Number.isFinite(numericValue) ? numericValue : null;
}

export function parsePositiveDecimal(value: string) {
  const numericValue = parseDecimal(value);
  return numericValue !== null && numericValue > 0 ? numericValue : null;
}

export function convertLabUnit(conversion: LabUnitConversion, value: number, direction: UnitConversionDirection) {
  return direction === 'to-target' ? conversion.sourceToTarget(value) : conversion.targetToSource(value);
}

export function calculateDilution(stockConcentration: number, targetConcentration: number, finalVolume: number): DilutionResult | null {
  if (stockConcentration <= 0 || targetConcentration <= 0 || finalVolume <= 0) return null;
  if (targetConcentration > stockConcentration) return null;

  const sampleVolume = (targetConcentration * finalVolume) / stockConcentration;
  return {
    sampleVolume,
    diluentVolume: Math.max(0, finalVolume - sampleVolume),
    dilutionFactor: stockConcentration / targetConcentration,
  };
}

export function formatLabNumber(value: number, maximumFractionDigits = 2) {
  return new Intl.NumberFormat('de-DE', { maximumFractionDigits }).format(value);
}