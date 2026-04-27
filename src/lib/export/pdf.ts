import * as Print from 'expo-print';
import * as Sharing from 'expo-sharing';

import {
  buildDifferentialCountReport,
  buildKolonieCountReport,
  buildProtokollRunReport,
} from '@/src/features/export/report';
import type { DifferentialCountSnapshot, KolonieCountSnapshot, ProtokollRun } from '@/src/types/domain';

async function createAndSharePdf(html: string, dialogTitle: string) {
  const file = await Print.printToFileAsync({ html });
  const canShare = await Sharing.isAvailableAsync();

  if (canShare) {
    await Sharing.shareAsync(file.uri, {
      dialogTitle,
      mimeType: 'application/pdf',
      UTI: 'com.adobe.pdf',
    });
  }

  return file.uri;
}

export function shareProtokollRunPdf(run: ProtokollRun) {
  return createAndSharePdf(buildProtokollRunReport(run), `${run.protokollSnapshot.name} exportieren`);
}

export function shareKolonieCountPdf(count: KolonieCountSnapshot) {
  return createAndSharePdf(buildKolonieCountReport(count), `${count.name ?? 'Kolonienzaehlung'} exportieren`);
}

export function shareDifferentialCountPdf(count: DifferentialCountSnapshot) {
  return createAndSharePdf(buildDifferentialCountReport(count), `${count.name ?? 'Differentialzaehlung'} exportieren`);
}